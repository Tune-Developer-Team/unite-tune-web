import React, {useEffect, useState} from 'react';

import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import {useRecoilState} from "recoil";
import {authenticationState} from "../../atoms/AuthenticationState";
import {profileState} from "../../atoms/ProfileState";
import {HomeViewModel} from "./HomeViewModel";
import {SeedListItem} from "./HomeViewModelIF";
import {navigationState} from "../../atoms/NavigationState";
import SeedViewCard from "../../ui/card/SeedViewCard";
import RSSFeedBanner from "../../ui/post/RSSFeedBanner";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {useNavigate} from "react-router-dom";

const homeViewModel = new HomeViewModel();
const HomeView = () => {
    const navigate = useNavigate();

    const [navigation, setNavigation] = useRecoilState(navigationState);
    const [authState, setAuthentication] = useRecoilState(authenticationState);
    const [profile, setProfile] = useRecoilState(profileState);
    const [viewModel] = useState<HomeViewModel>(homeViewModel);
    const [seedList, setSeedList] = useState<SeedListItem[]>([])

    /**
     * seedリストの読み込み
     */
    const loadSeedList = async (): Promise<void> => {
        console.log("===loadSeedList===");
        await viewModel.fetchSeedList(authState).then((response)=>{

            console.log(response);
            setSeedList(viewModel.seedList);
        }).catch((error)=>{
            console.log(error);
        });
    }

    useEffect(() => {
        setNavigation({isHidden: false, isEnableRedirect: true});
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

    return (
        <div className="Home" style={{paddingLeft: '5rem'}}>
            <Grid container spacing={2} className={"new-arrival-banner"}>
                <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                    <Typography variant="h5" component="div">
                        NEW ARRIVAL
                    </Typography>
                    <Box textAlign={"end"} paddingRight={10}>
                        <Button variant="text" style={{color:"#fff"}} onClick={() => {
                            navigate(`/post-list`)
                        }}>全て表示する</Button>
                    </Box>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12} >
                    <RSSFeedBanner/>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                    <Typography variant="h5" component="div">
                        人気のSeed
                    </Typography>
                </Grid>
                {seedList.map((item, index) => (
                  <Grid xs={12} sm={2} md={2} key={index}>
                      <SeedViewCard
                          seedId={item.seedId}
                          title={item.title}
                          description={item.description || "September 14, 2016"}
                          ownerUserName={item.ownerUserName}
                          imagePath={item.imagePath}
                          userIconImagePath={item.userIconImagePath}
                          favoriteCount={item.favoriteCount}
                      />
                  </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default HomeView;
