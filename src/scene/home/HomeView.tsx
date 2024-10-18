import React, {useEffect, useState} from 'react';

import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import {useRecoilState} from "recoil";
import {authenticationState} from "../../atoms/AuthenticationState";
import {profileState} from "../../atoms/ProfileState";
import {HomeViewModel} from "./HomeViewModel";
import {QuestListItem} from "./HomeViewModelIF";
import {navigationState} from "../../atoms/NavigationState";
import BlogPostTileBanner from "../../ui/blogPost/BlogPostTileBanner";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {useNavigate} from "react-router-dom";
import QuestTileBanner from "../../ui/quest/QuestTileBanner";
import CustomTabs, {TabItem} from "../../ui/layout/CustomTabs";
import {SelectedTabIF, selectedTabState} from "../../atoms/SelectedTabState";
import BlogPostTileSixColumn from "../../ui/blogPostSixColumn/BlogPostTileSixColumn";
import AllTabView from "./AllTabView/AllTabView";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {Switch} from "@mui/material";

const homeViewModel = new HomeViewModel();
const HomeView = () => {
    const navigate = useNavigate();

    const [navigation, setNavigation] = useRecoilState(navigationState);
    const [authState, setAuthentication] = useRecoilState(authenticationState);
    const [profile, setProfile] = useRecoilState(profileState);
    const [topTab] = useRecoilState<SelectedTabIF>(selectedTabState);
    const [viewModel] = useState<HomeViewModel>(homeViewModel);
    const [questList, setQuestList] = useState<QuestListItem[]>([])

    const tabItems: TabItem[] = [
        {label: 'All'},
        {label: 'Quest'},
        {label: 'Blog'},
        {label: 'Goods'}
    ];

    /**
     * questリストの読み込み
     */
    const loadQuestList = async (): Promise<void> => {
        console.log("===loadQuestList===");
        await viewModel.fetchQuestList(authState).then((response)=>{
            console.log("---------------------成功------------------------")
            console.log(response)
            setQuestList(response.questList);
        }).catch((error)=>{
            console.log("---------------------失敗------------------------")
            console.log(error);
        });
    }

    useEffect(() => {
        setNavigation({isHidden: false, isEnableRedirect: true});
        console.log("================セットアップ================")
        // セットアップ
        viewModel.setUp({
            authentication: {
                accessToken: authState.accessToken,
                uid: authState.uid,
                email: authState.email
            }
        });

        void loadQuestList();

        return () => {
            // クリーンアップ
            viewModel.cleanUp()
        };
    }, []);

    const [value, setValue] = React.useState(0);
    const [isActiveOwnerMode, setIsActiveOwnerMode] = React.useState(false);
    const questTabItemList = [{index: 0, label: '終了済み'}, {index: 1, label: '募集中'}];
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    function a11yProps(index: number) {
        return {
            id: `seededit-tab-${index}`,
            'aria-controls': `seededit-tabpanel-${index}`,
        };
    }

    console.log(topTab.Home.selected.label);
    return (
        <div className="Home">
            <CustomTabs tabItems={tabItems} bottomTab={'Home'}/>
            {/* All */}
            <Box sx={{display: topTab.Home.selected.label === 'All' ? "block" : "none"}}>
            <AllTabView viewModel={viewModel}/>
            </Box>
            {/* Blog */}
            <Grid container sx={{display: topTab.Home.selected.label === 'Blog' ? "block" : "none"}} spacing={2} className={"Blog"}>
                <Grid container spacing={2} className={"new-arrival-banner"} paddingBottom={5}>
                    <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                        <Typography variant="h5" component="div">
                            ✨ NEW ARRIVAL
                        </Typography>
                        <Box textAlign={"end"} paddingRight={1}>
                            <Button variant="text" style={{color:"#fff"}} onClick={() => {
                                navigate(`/blogposts`)
                            }}>全て表示する</Button>
                        </Box>
                    </Grid>
                    <Grid xs={12} sm={12} md={12} lg={12} >
                        <BlogPostTileBanner/>
                    </Grid>
                </Grid>
            </Grid>

            {/* Quest */}
            <Grid container sx={{display: topTab.Home.selected.label === 'Quest' ? "block" : "none"}} spacing={2}
                  className={"Quest"}>
                <Box width={"100%"} display={"flex"} paddingRight={4}>
                    <Box width={"100%"} textAlign={"center"}>
                        <Typography>{isActiveOwnerMode ? "OwnerMode" : "WorkerMode"}</Typography>
                    </Box>
                    <Box textAlign={"end"}>
                        <Switch
                            checked={isActiveOwnerMode}
                            onChange={(event, checked) => {
                                setIsActiveOwnerMode(!isActiveOwnerMode);
                            }}
                            name="IsPublishedAis"
                            color="primary"
                        />
                    </Box>
                </Box>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    {questTabItemList.map((item) => (
                        <Tab sx={{width: '50%'}} key={item.index}
                             label={item.label} {...a11yProps(item.index)} />
                    ))}
                </Tabs>
                <Grid container spacing={3} className={"quest-banner"} paddingBottom={5}>
                    <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                        <Typography variant="h5" component="div">
                            {/*このシードがアツい！*/}
                            ⚡️ QUESTS
                        </Typography>
                        <Box textAlign={"end"} paddingRight={1}>
                            {/*<Button variant="text" style={{color:"#fff"}} onClick={() => {*/}
                            {/*    navigate(`/quests`)*/}
                            {/*}}>全て表示する</Button>*/}
                        </Box>
                        <Grid xs={12} sm={12} md={12} lg={12} >
                            <QuestTileBanner questList={questList.filter((questItem) => {
                                if (isActiveOwnerMode) {
                                    return questItem.ownerUserUid === authState.uid
                                } else {
                                    return questItem.ownerUserUid !== authState.uid
                                }
                            })}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* Goods */}
            <Grid container sx={{display: topTab.Home.selected.label === 'Goods' ? "block" : "none"}} spacing={2} className={"Goods"}>
                新着の本とかおもちゃとかガジェットとか！
            </Grid>

        </div>
    );
};

export default HomeView;
