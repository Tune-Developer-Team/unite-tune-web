import Grid from "@mui/material/Grid";
import {useEffect, useState} from "react";
import {Box, CircularProgress} from "@mui/material";
import {endPoint} from "../../../../consts/api";
import {loaderState} from "../../../../atoms/LoaderState";
import Authentication from "../../../../models/Authentication/Authentication";
import ImagePath from "../../../../models/data/ImagePath";
import {authenticationState} from "../../../../atoms/AuthenticationState";
import {useRecoilState} from "recoil";
import {Api} from "../../../../models/Api/Api";
import SheetManager from "./SheetManager"; // MUIのGridコンポーネントをインポート

export interface StatusItem {
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

const OfficeManager: React.FC = () => {
    const [authState] = useRecoilState(authenticationState);
    const [feedItems, setFeedItems] = useState<StatusItem[]>([]);
    const [loading, setLoading] = useRecoilState(loaderState);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                setLoading({ isLoading: true });
                let items: StatusItem[] = [];
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

        fetchStatus();
    }, [authState]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <div id="sheet-manager" className="SheetManager">
            <SheetManager items={feedItems} />
        </div>
    );
};

export default OfficeManager;
