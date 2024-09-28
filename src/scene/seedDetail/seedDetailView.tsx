import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {useNavigate, useParams} from "react-router-dom";
import {SeedDetailViewModel} from "./seedDetailViewModel";
import {useRecoilState} from "recoil";
import {navigationState} from "../../atoms/NavigationState";
import {authenticationState} from "../../atoms/AuthenticationState";
import {profileState} from "../../atoms/ProfileState";
import {SeedDetail} from "../../models/Seed/SeedDetail/seedDetail";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import RoundedButton from "../../ui/button/RoundedButton";

const seedDetailViewModel = new SeedDetailViewModel();

const SeedDetailView = () => {
    const [viewModel, setViewModel] = useState<SeedDetailViewModel>(seedDetailViewModel);
    const [seedDetail, setSeedDetail] = useState<SeedDetail>(viewModel.seedDetail);
    const [navigation, setNavigation] = useRecoilState(navigationState);
    const [authState, setAuthentication] = useRecoilState(authenticationState);

    const navigate = useNavigate();

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

    console.log(seedDetail.imagePathList)

    return (
        <Box className="SeedDetail" paddingLeft={8}>
            <Box width={"100%"} display={"flex"} paddingBottom={2}>
                <img src={seedDetail.imagePathList[0]?.path ?? ""}
                     alt={seedDetail.imagePathList[0]?.alt ?? "seedIcon"}
                     style={{width: "100%"}}
                />
            </Box>
            <Box textAlign={"end"} width={"100%"} display={seedDetail.ownerUserUid === authState.uid ? "block" : "none"}>
                <RoundedButton onClick={() => {
                    navigate(`/seed/${seedId}/edit`);
                }}>
                    Edit
                </RoundedButton>
            </Box>
            <Grid container spacing={2} className={"SeedDetailMainContent"}>
                <Grid paddingBottom={12} textAlign={"start"} xs={12} sm={12} md={12} lg={12}>

                    <Typography variant="h6" component="div" sx={{ textAlign: "start" }}>
                        {seedDetail.title}
                    </Typography>
                </Grid>

                <Grid xs={6} sm={6} md={6} lg={6}>
                    <Box sx={{ textAlign: "start" }}>
                        <Typography>
                            自分でも気づかない自分の自己紹介データが見られる。<br />現在開発中
                        </Typography>
                        {/*<ProfileBarChart/>*/}
                    </Box>
                </Grid>
                <Grid xs={6} sm={6} md={6} lg={6} sx={{ textAlign: "center" }}>
                    <Typography variant="h6" component="div" sx={{ textAlign: "center" }}>
                        ⚡️ My Values
                    </Typography>
                    <Box>
                        <Button onClick={() => {
                            navigate(`/user/${seedDetail.ownerUserUid}`)
                        }}
                        >Please See Portfolio</Button>
                    </Box>
                </Grid>
                <Grid xs={3} sm={3} md={3} lg={3}>
                </Grid>
                <Grid sx={{ textAlign: "center" }} xs={6} sm={6} md={6} lg={6}>

                </Grid>
                <Grid xs={3} sm={3} md={3} lg={3}>
                </Grid>

            </Grid>
        </Box>
        // <div className="Home" style={{paddingLeft: '5rem'}}>
        //     <Grid container spacing={2} className={"projectByLanguage"}>
        //         {/*TODO: 認可が実装できたら、シードのオーナーのみに表示される*/}
        //         <Button variant="contained" onClick={()=>{
        //             navigate(`/seed/${seedId}/edit`);
        //         }}>EditSeed🌱</Button>
        //         <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>
        //             <Typography variant="h4" component="div" sx={{textAlign: "center"}}>
        //                 {viewModel.seedDetail.title}
        //             </Typography>
        //         </Grid>
        //         <Grid xs={6} sm={6} md={6} lg={6}>
        //             <Box sx={{textAlign:"start"}}>
        //
        //             </Box>
        //         </Grid>
        //
        //         <Grid xs={6} sm={6} md={6} lg={6} sx={{textAlign: "center"}}>
        //             <Box sx={{textAlign:"start"}}>
        //                 {viewModel.seedDetail.imagePathList.length > 0 ?
        //                     <img src={viewModel.seedDetail.imagePathList[0].path} alt={viewModel.seedDetail.imagePathList[0].alt}/> : <p>画像なし</p>
        //                 }
        //                 <Typography>
        //                     {viewModel.seedDetail.description}
        //                 </Typography>
        //                 <Typography>
        //                     期間は{viewModel.seedDetail.termsFrom}（unix）から{viewModel.seedDetail.termsTo}（unix）まで
        //                 </Typography>
        //                 <Typography>
        //                     関連ワード {viewModel.seedDetail.hashTagStringList}
        //                 </Typography>
        //             </Box>
        //         </Grid>
        //
        //         <Grid xs={3} sm={3} md={3} lg={3} >
        //         </Grid>
        //         <Grid sx={{textAlign: "center"}} xs={6} sm={6} md={6} lg={6}>
        //             <Typography variant="h4" component="div" sx={{textAlign: "center"}}>
        //                 {viewModel.seedDetail.benefit}
        //             </Typography>
        //         </Grid>
        //         <Grid xs={3} sm={3} md={3} lg={3} >
        //         </Grid>
        //
        //     </Grid>
        // </div>
    );
};

export default SeedDetailView;
