import React, {useEffect, useState} from 'react';

import {useRecoilState} from "recoil";
import Grid from "@mui/material/Unstable_Grid2";
import {RegisterResponseIF, RegisterViewModel} from "./registerViewModel";
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
    const [tuneCard, setTuneCard] = useRecoilState<TuneCard>(tuneCardState);
    const [profile, setProfile] = useRecoilState(profileState);
    const [googleOneTimeCode, setGoogleOneTimeCode] = useState(code);
    const [authState, setAuthentication] = useRecoilState(authenticationState);

    console.log("========================================");
    console.log(code);

    /**
     * サインアップを実行する
     */
    const signUp = (): void => {

        if (googleOneTimeCode === '') {
            //　何もしない
            console.log('何もしない');
            return;
        }

        void viewModel.signUp({code: googleOneTimeCode, tuneCard: tuneCard})
            .then((response: RegisterResponseIF) => {
                console.log('googleLogin')
                console.log(response)
                void swal("ようこそ.", response.userRegister.uid ?? 'undefined', "success").then(res => {
                    console.log('成功', res);

                    console.log(response.userRegister);

                    // ユーザーの認証情報のストアを更新
                    setAuthentication({
                        uid: response.userRegister.uid,
                        accessToken: response.userRegister.accessToken,
                        email: response.userRegister.email
                    });

                    // ユーザー情報のストアを更新
                    setProfile({
                        nickName: response.userRegister.nickName ?? 'user',
                        iconImage: response.userRegister.iconImagePath ?? '',
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

        // ログイン中はホームへ遷移する
        console.log(authState);
        const isLogin: boolean = authState.uid.length > 0;

        if (isLogin) {
            if (window.confirm('ログアウトして新規登録画面に遷移します.')) {
                setAuthentication({uid:""}) // TODO: ログアウト処理を実装
            } else {
                window.location.href = '/';
            }
        }

        if ((tuneCard.serial != '') && (tuneCard.uid != '') && (!tuneCard.isActivated)) {
            window.location.href = '/';
        }

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
        <Grid container spacing={2} className={"preference"} style={{paddingLeft: 20}}>
            <Grid sx={{textAlign: "center"}} xs={12} sm={12} md={12} lg={12}>
                <h1>このカードをペアリングしてあなただけのものにします。</h1>
                <Box sx={{textAlign: "center", paddingTop: 5}}>
                    {GoogleAuthenticationButton('SignUp with Google', process.env.REACT_APP_GOOGLE_REDIRECT_URI_REGISTER as string)}
                </Box>
                <Box sx={{textAlign: "start", paddingTop: 10}}>
                    <h2>TUNE CARD</h2>
                    <div>
                        <p>
                            IsActivated<br/>
                            {tuneCard.isActivated?'true':'false'}
                        </p>
                        <p>
                            SERIAL<br/>
                            {tuneCard.serial}
                        </p>
                        <p>
                            UID<br/>
                            {tuneCard.uid}
                        </p>
                    </div>
                </Box>
            </Grid>
        </Grid>
    );
};
export default RegisterView;
