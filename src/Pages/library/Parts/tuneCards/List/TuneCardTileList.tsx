import Grid from "@mui/material/Grid";
import {loaderState} from "../../../../../atoms/LoaderState";
import TuneCardTile from "./TuneCardTile";
import {useRecoilState} from "recoil";
import {endPoint} from "../../../../../consts/api";
import {useEffect, useState} from "react";
import {Api} from "../../../../../models/Api/Api";
import Authentication from "../../../../../models/Authentication/Authentication";
import ImagePath from "../../../../../models/data/ImagePath";
import {authenticationState} from "../../../../../atoms/AuthenticationState";
import {Box, CircularProgress, Typography} from "@mui/material"; // MUIのGridコンポーネントをインポート

export interface TuneCardItem {
    uid: string;
    iconImage: ImagePath;
    title: string;
    link: string;
    description: string;
}

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
                setLoading({ isLoading: true });
                let items: TuneCardItem[] = [];
                const api = new Api(Authentication.fromState(authState));
                const response = await api.get(endPoint.PROFILE);

                if (response.data) {
                    items = response.data.data.map((data: ProfilesResponseData) => {
                        const image = JSON.parse(data.IconImage);
                        return {
                            uid: data.Uid,
                            iconImage: ImagePath.create({ path: image.path, alt: image.alt }),
                            title: data.NickName,
                            link: `/library/card-list/${data.Uid}`,
                            description: data.Description,
                        };
                    });
                }
                setFeedItems(items);
            } catch (error) {
                console.error("Error fetching cards:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, [authState]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <div className="PostList">
            <Typography variant="h5" component="div">
                TuneCards
            </Typography>
            <Grid container spacing={4} style={{ padding: "2rem", display: "flex"}}>
                {feedItems.map((item) => (
                    <Box key={item.uid} style={{paddingLeft:34}}>
                        <TuneCardTile item={item} />
                        {/*{"a"}*/}
                    </Box>
                ))}
            </Grid>
        </div>
    );
};

export default TuneCardTileList;
