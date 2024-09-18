import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {useParams} from "react-router-dom";
import {SeedDetailViewModel} from "./seedDetailViewModel";
import {useRecoilState} from "recoil";
import {navigationState} from "../../atoms/NavigationState";
import {authenticationState} from "../../atoms/AuthenticationState";
import {profileState} from "../../atoms/ProfileState";
import {SeedDetail} from "../../models/Seed/SeedDetail/seedDetail";

const seedDetailViewModel = new SeedDetailViewModel();

const SeedDetailView = () => {
    const [viewModel, setViewModel] = useState<SeedDetailViewModel>(seedDetailViewModel);
    const [SeedDetail, setSeedDetail] = useState<SeedDetail>(viewModel.seedDetail);
    const [navigation, setNavigation] = useRecoilState(navigationState);
    const [authState, setAuthentication] = useRecoilState(authenticationState);
    const [profile, setProfile] = useRecoilState(profileState);

    const params = useParams();
    const seedId = params.seedId as string;

    const setUp = async (): Promise<void> => {
        const newViewModel = await viewModel.setUp({
            authentication: {
                accessToken: authState.accessToken,
                uid: authState.uid,
                email: authState.email
            }, seedId: seedId,
        });
        setSeedDetail(viewModel.seedDetail);
    }

    useEffect(() => {
        setNavigation({isHidden: false, isEnableRedirect: true});
        // セットアップ
        void setUp();

        return () => {
            // クリーンアップ
            viewModel.cleanUp()
        };
    }, []);

    return (
        <div className="Home" style={{paddingLeft: '5rem'}}>
            <Grid container spacing={2} className={"projectByLanguage"}>
                <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
                    <Typography variant="h4" component="div" sx={{textAlign: "center"}}>
                        {viewModel.seedDetail.title}
                    </Typography>
                </Grid>
                <Grid xs={6} sm={6} md={6} lg={6}>
                    <Box sx={{textAlign:"start"}}>

                    </Box>
                </Grid>

                <Grid xs={6} sm={6} md={6} lg={6} sx={{textAlign: "center"}}>
                    <Box sx={{textAlign:"start"}}>
                        {viewModel.seedDetail.imagePathList.length > 0 ?
                            <img src={viewModel.seedDetail.imagePathList[0].path} alt={viewModel.seedDetail.imagePathList[0].alt}/> : <p>画像なし</p>
                        }
                        <Typography>
                            {viewModel.seedDetail.description}
                        </Typography>
                        <Typography>
                            期間は{viewModel.seedDetail.termsFrom}（unix）から{viewModel.seedDetail.termsTo}（unix）まで
                        </Typography>
                        <Typography>
                            関連ワード {viewModel.seedDetail.hashTagStringList}
                        </Typography>
                    </Box>
                </Grid>

                <Grid xs={3} sm={3} md={3} lg={3} >
                </Grid>
                <Grid sx={{textAlign: "center"}} xs={6} sm={6} md={6} lg={6}>
                    <Typography variant="h4" component="div" sx={{textAlign: "center"}}>
                        {viewModel.seedDetail.benefit}
                    </Typography>
                </Grid>
                <Grid xs={3} sm={3} md={3} lg={3} >
                </Grid>

            </Grid>
        </div>
    );
};

export default SeedDetailView;
