import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import BlogPostTileSixColumn, {BlogService} from "../../../ui/blogPostSixColumn/BlogPostTileSixColumn";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import QuestTileBanner from "../../../ui/quest/QuestTileBanner";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {QuestListItem} from "../HomeViewModelIF";
import {HomeViewModel} from "../HomeViewModel";
import {useRecoilState} from "recoil";
import {profileState} from "../../../atoms/ProfileState";
import Avatar from "@mui/material/Avatar";
import PickUp from "./PickUp";
import {randomInt} from "crypto";
import blogIcon from "../../../assets/dBlog111Icon.png";

interface AllTabViewProps {
    viewModel: HomeViewModel
}

export interface TileInfoIF {
    title: string;
    description: string;
    link: string;
    image:string;
    ownerUid:string;
    ownerName: string|null;
    userIcon: string;
}

const AllTabView = (props: AllTabViewProps) => {
    const viewModel = props.viewModel;
    const [profile] = useRecoilState(profileState);
    const navigate = useNavigate();
    const [questList, setQuestList] = useState<QuestListItem[]>([]);
    const [pickUp, setPickUp] = useState<TileInfoIF>(
        {
            title: '',
            description: '',
            link: '',
            image: '',
            ownerUid: '',
            ownerName: '',
            userIcon: '',
        });

    /**
     * seedリストの読み込み
     */
    const loadSeedList = async (): Promise<void> => {
        console.log("===loadSeedList===");
        await viewModel.fetchHotQuestList().then((response) => {
            console.log("---------------------成功------------------------")
            console.log(response)
            setQuestList(response.questList);
        }).catch((error) => {
            console.log("---------------------失敗------------------------")
            console.log(error);
        });
    }

    /**
     * ピックアップの読み込み
     */
    const loadPickUp = async (): Promise<void> => {
        console.log("===loadSeedList===");

        const random = 1 + Math.floor( Math.random() * 10 );

        // TODO: 仮でそれっぽくなるようにしてる笑
        console.log(random)
        const isPost = random > 3;
        if (isPost) {
            const blog = BlogService;
            const response = await fetch(blog.feed);
            const text = await response.text();
            const parser = new DOMParser();
            const xml = parser.parseFromString(text, "application/xml");

            const items = Array.from(xml.querySelectorAll("item")).slice(0, 10).map((item) => ({
                title: item.querySelector("title")?.textContent || "No Title",
                link: item.querySelector("link")?.textContent || "#",
                description: item.querySelector("description")?.textContent || "",
            }));
            const item = items[random];

            setPickUp({
                title: item?.title??"",
                description: item?.description??"",
                link: item?.link??"/",
                image: blogIcon,
                ownerUid: "",
                ownerName: "dblog",
                userIcon: blogIcon,
            });
        } else {
            await viewModel.fetchPickUp().then((response) => {
                console.log("---------------------成功------------------------")
                console.log(response)
                setPickUp({
                    title: response.seed.title,
                    description: response.seed.description,
                    link: `quests/${response.seed.questId}`,
                    image: response.seed.imagePath.path,
                    ownerUid: response.seed.ownerUserUid,
                    ownerName: response.seed.ownerUserName,
                    userIcon: response.seed.userIconImagePath.path,
                });
            }).catch((error) => {
                console.log("---------------------失敗------------------------")
                console.log(error);
            });
        }
    }

    useEffect(() => {
        void loadSeedList();
        void loadPickUp();

        return () => {
            // クリーンアップ
            viewModel.cleanUp()
        };
    }, []);

    return (
        <Box>
            <Grid container spacing={2} className={"new-arrival-banner"}>
                <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12} paddingBottom={4}>
                    <Typography variant="h5" component="div">
                        ✨ NEW ARRIVAL
                    </Typography>
                </Grid>
                <BlogPostTileSixColumn/>
            </Grid>

            <Grid container spacing={2} className={"new-arrival-banner"} paddingBottom={4}>
                <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                    <span style={{display: "inline-flex"}}>
                        <Avatar
                            alt="userIcon"
                            sizes={"ss"}
                            src={profile.iconImage.path}
                        />
                        <Box paddingLeft={2}>
                            <Typography variant="body2" component="span">
                                さんの興味に基づく
                            </Typography>
                            <Typography variant="h5" component="div">
                                PICK&nbsp;UP
                            </Typography>
                        </Box>
                    </span>
                </Grid>
                <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                    <PickUp item={pickUp}/>
                </Grid>
            </Grid>

            <Grid container spacing={3} className={"quest-banner"}>
                <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                    <Typography variant="h5" component="div">
                        {/*このシードがアツい！*/}
                        🔥 HOT QUESTS !
                    </Typography>
                    <Box textAlign={"end"} paddingRight={1}>
                        <Button variant="text" style={{color: "#fff"}} onClick={() => {
                            navigate(`/quests`)
                        }}>全て表示する</Button>
                    </Box>
                    <Grid xs={12} sm={12} md={12} lg={12}>
                        <QuestTileBanner questList={questList}/>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
}

export default AllTabView