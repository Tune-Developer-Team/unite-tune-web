import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/system";
import defaultServiceIcon from "../../../../../assets/dBlog111Icon.png";
import TuneCardTile from "./TuneCardTile";
import {endPoint} from "../../../../../consts/api";
import {loaderState} from "../../../../../atoms/LoaderState";
import {ProfilesResponseData, TuneCardItem} from "./TuneCardTileList";
import Authentication from "../../../../../models/Authentication/Authentication";
import {authenticationState} from "../../../../../atoms/AuthenticationState";
import {useRecoilState} from "recoil";
import {Api} from "../../../../../models/Api/Api";
import ImagePath from "../../../../../models/data/ImagePath";

// 取得件数
const MAX_FEED_COUNT = 5;

const ScrollContainer = styled(Box)({
    display: "flex",
    gap: 20, // Add spacing between tiles
    overflowX: "auto",
    padding: 0,
    scrollBehavior: "smooth",
    '&::-webkit-scrollbar': {
        display: 'none', // Hide scrollbar for a cleaner look
    },
});

const TuneCardTileBanner: React.FC = () => {
    const [authState] = useRecoilState(authenticationState);
    const [tuneCardItems, setTuneCardItems] = useState<TuneCardItem[]>([]);
    const [loading, setLoading] = useRecoilState(loaderState);

    useEffect(() => {
        const fetchCards = async () => {
            try {

                // 検索条件
                const search = {
                    limit: 20,
                    offset:0,
                    excludeReplies: "true",
                    parentThinkId:"",
                    ownerUserUid: ""
                }

                setLoading({isLoading:true});
                let items: TuneCardItem[] = [{
                    uid: '',
                    iconImage: ImagePath.create({alt: '', path: ''}),
                    title: ``,
                    link: "",
                    description: ""
                }];
                const api = new Api(Authentication.fromState(authState));
                const response = await api.get(endPoint.PROFILE)
                    .then((res) => {
                        console.log(res.data.data);
                        // TODO: 時間ないので仮、本当はインターフェースとかクラスまで作りたい
                        if(res.data){
                            items = res.data.data.map((data:ProfilesResponseData) => {
                                return {
                                    uid: `${data.Uid}`,
                                    iconImage: ImagePath.create({
                                        path: JSON.parse(data.IconImage).path ?? '',
                                        alt: JSON.parse(data.IconImage).alt ?? ''
                                    }),
                                    title: `${data.NickName}`,
                                    link: `/library/card-list/${data.Uid}`,
                                    description: `${data.Description}`
                                }
                            });
                        }
                        setLoading({isLoading:false});
                    }).catch((err) => {
                        console.log("failure", err);
                        setLoading({isLoading:false});
                    });
                setTuneCardItems(items);
            } catch (error) {
                console.error("Error fetching Youtube:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, []);

    const handleMouseEnter = () => {
        document.body.style.overflowY = 'hidden'; // Disable vertical scrolling
    };

    const handleMouseLeave = () => {
        document.body.style.overflowY = ''; // Re-enable vertical scrolling
    };

    const handleScroll = (e: React.WheelEvent) => {
        if (window.innerWidth >= 1024) {
            e.currentTarget.scrollLeft += e.deltaY;
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <ScrollContainer
            onWheel={handleScroll}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {tuneCardItems.map((item, index) => (
                <TuneCardTile item={item}/>
            ))}
        </ScrollContainer>
    );
};

export default TuneCardTileBanner;
