import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/system";
import TuneCardTile from "./TuneCardTile";
import {authenticationState} from "../../../../../atoms/AuthenticationState";
import {Api} from "../../../../../models/Api/Api";
import Authentication from "../../../../../models/Authentication/Authentication";
import {endPoint} from "../../../../../consts/api";
import {useRecoilState} from "recoil";
import {loaderState} from "../../../../../atoms/LoaderState";
import ImagePath from "../../../../../models/data/ImagePath";

export interface TuneCardItem {
    uid: string;
    iconImage: ImagePath;
    title: string;
    link: string;
    description: string;
}

const GridContainer = styled(Box)({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "16px", // Add spacing between tiles
    padding: "16px",
    overflow: "auto",
});

export interface ProfilesResponseData {
    NickName: string
    IconImage: string
    Uid: string
    Description: string
}

const TuneCardTileList: React.FC = () => {
    const [authState] = useRecoilState(authenticationState);
    const [feedItems, setFeedItems] = useState<TuneCardItem[]>([]);
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
                await api.get(endPoint.PROFILE)
                    .then((res) => {
                        console.log(res.data.data);
                        // TODO: 時間ないので仮、本当はインターフェースとかクラスまで作りたい
                        if(res.data){
                            items = res.data.data.map((data:ProfilesResponseData) => {
                                const image = JSON.parse(data.IconImage);
                                const iconImage = ImagePath.create({path: image.path, alt: image.alt});
                                console.log(image.path);
                                return {
                                    uid: `${data.Uid}`,
                                    iconImage: iconImage ?? ImagePath.create({alt: '', path: ''}),
                                    title: `${data.NickName}`,
                                    link: `/library/card-list/${data.Uid}`,
                                    description: `${data.Description}`
                                }
                            });
                        }
                        console.log("created item data");
                        console.log(items);
                    setLoading({isLoading:false});
                }).catch((err) => {
                    console.log("failure", err);
                    setLoading({isLoading:false});
                });
                setFeedItems(items);
            } catch (error) {
                console.error("Error fetching Youtube:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <div className="PostList" >
            <Typography variant="h5" component="div">
                TuneCards
            </Typography>
            <GridContainer>
                {feedItems.map((item, index) => (
                   <TuneCardTile item={item}/>
                ))}
            </GridContainer>
        </div>
    );
};

export default TuneCardTileList;
