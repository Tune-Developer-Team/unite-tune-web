import React, {useEffect, useState} from 'react';

import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import {Card, CardContent, CardMedia} from "@mui/material";
import HomePiChart from "../../ui/chart/pie/homnePieChart";
import HomeGrid from "../../ui/grid/homeGrid";
import {useRecoilState} from "recoil";
import {authenticationState} from "../../atoms/AuthenticationState";
import {profileState} from "../../atoms/ProfileState";
import {HomeViewModel} from "./HomeViewModel";
import {SeedListItem} from "./HomeViewModelIF";
import {navigationState} from "../../atoms/NavigationState";
import RecipeReviewCard from "../../ui/card/RecipeReviewCard";

const homeViewModel = new HomeViewModel();
const HomeView = () => {
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
            <Grid container spacing={2} className={"projectByLanguage"}>
                <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                    <Typography variant="h5" component="div">
                        カテゴリ別Seed
                    </Typography>
                </Grid>
                <Grid xs={0} sm={0} md={3} lg={3} >
                </Grid>
                <Grid sx={{display: "flex"}}
                      xs={12} sm={12} md={6} lg={6}>
                    <HomePiChart/>
                </Grid>
                <Grid xs={0} sm={0} md={3} lg={3} >
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                    <Typography variant="h5" component="div">
                        おすすめSeed
                    </Typography>
                </Grid>
                {seedList.map((item, index) => (
                  <Grid xs={12} sm={2} md={2} key={index}>
                    <RecipeReviewCard
                      title={item.title || "Shrimp and Chorizo Paella"}
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
