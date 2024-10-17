import React, {useEffect, useState} from 'react';

import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import {useRecoilState, useResetRecoilState} from "recoil";
import {authenticationState} from "../../atoms/AuthenticationState";
import {profileState} from "../../atoms/ProfileState";
import {HomeViewModel} from "./HomeViewModel";
import {SeedListItem} from "./HomeViewModelIF";
import {navigationState} from "../../atoms/NavigationState";
import BlogPostTileBanner from "../../ui/blogPost/BlogPostTileBanner";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {useNavigate} from "react-router-dom";
import SeedTileBanner from "../../ui/seed/SeedTileBanner";
import CustomTabs, {TabItem} from "../../ui/layout/CustomTabs";
import {SelectedTabIF, selectedTabState} from "../../atoms/SelectedTabState";

const homeViewModel = new HomeViewModel();
const HomeView = () => {
    const navigate = useNavigate();

    const [navigation, setNavigation] = useRecoilState(navigationState);
    const [authState, setAuthentication] = useRecoilState(authenticationState);
    const [profile, setProfile] = useRecoilState(profileState);
    const [topTab] = useRecoilState<SelectedTabIF>(selectedTabState);
    const [viewModel] = useState<HomeViewModel>(homeViewModel);
    const [seedList, setSeedList] = useState<SeedListItem[]>([])

    const tabItems: TabItem[] = [
        {label: 'All'},
        {label: 'Seed'},
        {label: 'Blog'},
        {label: 'Goods'}
    ];

    /**
     * seedリストの読み込み
     */
    const loadSeedList = async (): Promise<void> => {
        console.log("===loadSeedList===");
        await viewModel.fetchSeedList(authState).then((response)=>{
            console.log("---------------------成功------------------------")
            console.log(response)
            setSeedList(response.seedList);
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

        void loadSeedList();

        return () => {
            // クリーンアップ
            viewModel.cleanUp()
        };
    }, []);

    console.log(topTab.Home.selected.label);
    return (
        <div className="Home">
            <CustomTabs tabItems={tabItems} bottomTab={'Home'}/>
            {/* All */}
            <Grid container sx={{display: (topTab.Home.selected.label === 'All') ? "block" : "none"}} spacing={2}
                  className={"All"}>
                <Grid container spacing={2} className={"new-arrival-banner"} paddingBottom={5}>
                    <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                        <Typography variant="h5" component="div">
                            NEW ARRIVAL
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

                <Grid container spacing={3} className={"seed-banner"} paddingBottom={5}>
                    <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                        <Typography variant="h5" component="div">
                            {/*このシードがアツい！*/}
                            Hot SEEDS !
                        </Typography>
                        <Box textAlign={"end"} paddingRight={1}>
                            <Button variant="text" style={{color:"#fff"}} onClick={() => {
                                navigate(`/seeds`)
                            }}>全て表示する</Button>
                        </Box>
                        <Grid xs={12} sm={12} md={12} lg={12} >
                            <SeedTileBanner seedList={seedList}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* Blog */}
            <Grid container sx={{display: topTab.Home.selected.label === 'Blog' ? "block" : "none"}} spacing={2} className={"Blog"}>
                <Grid container spacing={2} className={"new-arrival-banner"} paddingBottom={5}>
                    <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                        <Typography variant="h5" component="div">
                            NEW ARRIVAL
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

            {/* Seed */}
            <Grid container sx={{display: topTab.Home.selected.label === 'Seed' ? "block" : "none"}} spacing={2} className={"Seed"}>
                <Grid container spacing={3} className={"seed-banner"} paddingBottom={5}>
                    <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                        <Typography variant="h5" component="div">
                            {/*このシードがアツい！*/}
                            Hot SEEDS !
                        </Typography>
                        <Box textAlign={"end"} paddingRight={1}>
                            <Button variant="text" style={{color:"#fff"}} onClick={() => {
                                navigate(`/seeds`)
                            }}>全て表示する</Button>
                        </Box>
                        <Grid xs={12} sm={12} md={12} lg={12} >
                            <SeedTileBanner seedList={seedList}/>
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
