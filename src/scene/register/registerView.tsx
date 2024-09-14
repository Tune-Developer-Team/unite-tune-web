import React, {useEffect, useState} from 'react';

import {useRecoilState} from "recoil";
import Grid from "@mui/material/Unstable_Grid2";
import {RegisterViewModel} from "./registerViewModel";
import {navigationState} from "../../atoms/NavigationState";
import Box from "@mui/material/Box";
import GoogleAuthenticationButton from "../signIn/authorization/google/GoogleAuthenticationButton";
import {authenticationState} from "../../atoms/AuthenticationState";
import {profileState} from "../../atoms/ProfileState";
import swal from "sweetalert";
import {tuneCardState} from "../../atoms/TuneCardState";
import {TuneCard} from "../../models/TuneCard/TuneCard";
import axios, {AxiosResponse} from "axios";

const registerViewModel = new RegisterViewModel();

const params = new URLSearchParams(window.location.search);
const code = params.get("code") ?? '';

const RegisterView: React.FunctionComponent = () => {
    const [viewModel] = useState<RegisterViewModel>(registerViewModel);
    const [navigation, setNavigation] = useRecoilState(navigationState);
    const [tuneCardInfo] = useRecoilState<TuneCard>(tuneCardState);
    const [profile, setProfile] = useRecoilState(profileState);
    const [googleOneTimeCode, setGoogleOneTimeCode] = useState(code);
    const [authState, setAuthentication] = useRecoilState(authenticationState);

    const redirectUriRegister = process.env.REACT_APP_GOOGLE_REDIRECT_URI_REGISTER as string;
    console.log("========================================");
    console.log(code);

    // ログイン中はホームへ遷移する
    console.log(authState);
    const isLogin: boolean = authState.uid.length > 0;
    if (isLogin) {
        window.location.href = '/';
    }

    // const registerCard = async (input: { serial: string, uid: string }): Promise<void> => {
    //     if (input.uid !== "") {
    //         const cardTuneAPI = axios.create({
    //             headers: {
    //                 'Authorization': 'registerTuneCard',
    //                 'x-api-key': '1yIDLcQTj28kU0fpfZFdCaZoi4dCoEgC8hLh1duf'
    //             }
    //         });
    //         const cardTuneRegisterEndPoint = process.env.REACT_APP_CARD_TUNE_REGISTER as string;
    //         await cardTuneAPI.post(cardTuneRegisterEndPoint, {
    //             serial: input.serial,
    //             uid: input.uid
    //         }).then((cardTuneResponse: AxiosResponse<any>) => {
    //             console.log(cardTuneResponse);
    //         }).catch((err) => {
    //             console.log(err);
    //         });
    //     }
    // }

    /**
     * サインアップを実行する
     */
    const signUp = (): void => {

        if (googleOneTimeCode === '') {
            //　何もしない
            console.log('何もしない');
            return;
        }

        const tuneCard = TuneCard.creatTuneInstance({serial: tuneCardInfo.serial, uid: tuneCardInfo.uid});

        void viewModel.signUp({code: googleOneTimeCode, tuneCard: tuneCard})
            .then(response => {
                console.log('googleLogin')
                console.log(response)
                void swal("ようこそ.", response.userRegister.data.message ?? 'undefined', "success").then( res => {
                    console.log('成功', res);

                    // ユーザーの認証情報のストアを更新
                    setAuthentication({
                        uid: response.userRegister.data.uid,
                        accessToken: response.userRegister.data.accessToken,
                        email: response.userRegister.data.email
                    });

                    // ユーザー情報のストアを更新
                    setProfile({
                        nickName: response.userRegister.data?.nickName ?? 'user',
                        iconImage: response.userRegister.data?.iconImagePath ?? '',
                    });

                    // ナビゲーションバーを表示
                    setNavigation({isHidden: false, isEnableRedirect: true});

                    // ホーム画面へ遷移
                    window.location.href = '/';
                });
            }).catch((er) => {
                console.log(er);
                void swal("Whoops !", er.message, "error").then(error => {
                    // ログイン画面へ遷移
                    console.log(error);
                    window.location.href = '/signin';
                });
                setGoogleOneTimeCode('');
            });
    }

    // 開発環境においてStrictModeの2回目を無視するフラグ
    let strictModeIgnore = false;
    useEffect(() => {
        // ナビゲーションバーを非表示
        setNavigation({isHidden: true, isEnableRedirect: false});

        viewModel.setUp({
            authentication: {
                accessToken: authState.accessToken,
                uid: authState.uid,
                email: authState.email
            }
        });

        if (!strictModeIgnore) {
            signUp();
        }

        return () => {
            strictModeIgnore = true;
        };
    }, []);

    return (
        <Grid container spacing={2} className={"preference"} style={{paddingLeft: '5rem'}}>
            <Grid sx={{textAlign: "center"}} xs={12} sm={12} md={12} lg={12}>
                <Box sx={{textAlign: "center", paddingTop: 5}}>
                    {GoogleAuthenticationButton('SignUp with Google', redirectUriRegister)}
                </Box>
            </Grid>
        </Grid>
    );
};
export default RegisterView;
