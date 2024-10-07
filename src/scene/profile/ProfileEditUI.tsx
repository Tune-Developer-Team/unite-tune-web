import React, { useEffect, useState } from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import { useRecoilState } from "recoil";
import { authenticationState } from "../../atoms/AuthenticationState";
import { navigationState } from "../../atoms/NavigationState";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileViewModel } from "./ProfileViewModel";
import Profile from "../../models/Profile/Profile";
import Avatar from "@mui/material/Avatar";
import {MenuItem, Select, SelectChangeEvent, Switch, TextField} from "@mui/material";
import ImagePath from "../../models/data/ImagePath";
import {ImageUploadForm} from "../seedEdit/ImageUploadForm";
import {endPoint} from "../../consts/api";

const profileViewModel = new ProfileViewModel();

interface ProfileEditUIIF {
    profile: Profile
}

const ProfileEditUI = (props: ProfileEditUIIF) => {
    const params = useParams();
    const uId = params.uid as string;

    const [viewModel] = useState<ProfileViewModel>(profileViewModel);
    const [targetUid] = useState<string>(uId);
    const navigate = useNavigate();
    const [authState] = useRecoilState(authenticationState);
    const [navigation, setNavigation] = useRecoilState(navigationState);

    const [nickName, setNickName] = useState<string>(props.profile.nickName);
    const [description, setDescription] = useState<string>(props.profile.description);
    const [iconImage, setIconImage] = useState<ImagePath>(props.profile.iconImage);

    const [curios, setCurios] = useState<string>(props.profile.curios);
    const [isPublicAis, setIsPublicAis] = useState<boolean>(props.profile.isPublicAis);
    const [isShowMbti, setIsShowMbti] = useState<boolean>(props.profile.isShowMbti);
    const [isShowPortFolio, setIsShowPortFolio] = useState<boolean>(props.profile.isShowPortfolio);
    const [mbti, setMbti] = useState<string>(props.profile.mbti);
    const [curiosDirection, setCuriosDirection] = useState<string>(props.profile.curiosDirection);
    const [isNeedUpdate, setIsNeedUpdate] = useState<boolean>(false);

    const setUp = async (): Promise<void> => {
        const newViewModel = await viewModel.setUp({
            authentication: {
                accessToken: authState.accessToken,
                uid: authState.uid,
                email: authState.email
            }, uId: targetUid,
        });
    }

    // ファイル変更時に受け取るコールバック関数
    const handleFileChange = async (iconImage: ImagePath) => {
        // アップロード済みの画像パスをリストに追加
        setIconImage(iconImage);
        // 下書きの更新
        setIsNeedUpdate(true);
    };

    useEffect(() => {
        setNavigation({ isHidden: false, isEnableRedirect: true });
        // セットアップ
        void setUp();

        return () => {
            // クリーンアップ
            viewModel.cleanUp()
        };
    },[]);

    return (
        <div className="ProfileEditUI">
            <Grid container spacing={2} className={"projectByLanguage"}>
                <Grid paddingBottom={2} textAlign={"start"} xs={12} sm={12} md={12} lg={12}>
                    <Box width={"100%"} position={"relative"} paddingBottom={2}>
                        <Avatar
                            alt="userIcon"
                            src={iconImage.path}
                            sx={{ width: 100, height: 100, position: 'relative', xIndex: 1 }} // サイズを大きくする
                            onClick={() => {
                                console.log("ユーザー");
                            }}
                        />
                        <Box
                            component="form"
                            sx={{
                                position: 'absolute',
                                top: 40,
                                left: 0,
                                width: 100,
                                borderRadius: 4,
                                backgroundColor: 'rgba(0,0,0,0.5)', // 半透明の背景色
                                zIndex: 2, // フォームをアバターの上に表示
                            }}
                        >
                            <ImageUploadForm onFileChange={handleFileChange}
                                             folderName={authState.uid}
                                             uploadEndPoint={endPoint.UPLOAD_PROFILE_IMAGE}/>
                        </Box>
                    </Box>
                    <Box sx={{backgroundColor:"#3d3f41", borderRadius: "0.4rem"}}>
                        <TextField
                            fullWidth
                            required
                            rows={1}
                            variant="standard"
                            hiddenLabel
                            defaultValue={nickName}
                            onChange={(event) => {
                                setDescription(event.target.value);
                            }}
                        />
                    </Box>
                </Grid>
                {/*詳細*/}
                <Grid xs={12} sm={12} md={12} lg={12}>
                    自己紹介
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12}>
                    <Box sx={{backgroundColor:"#3d3f41", borderRadius: "0.4rem"}}>
                        <TextField
                            fullWidth
                            required
                            multiline
                            rows={4}
                            variant="standard"
                            hiddenLabel
                            defaultValue={description}
                            onChange={(event) => {
                                setNickName(event.target.value);
                            }}
                        />
                    </Box>
                </Grid>

                <Grid xs={12} sm={12} md={12} lg={12}>
                    興味
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12}>
                    <Box sx={{backgroundColor:"#3d3f41", borderRadius: "0.2rem"}}>
                        <TextField
                            fullWidth
                            required
                            multiline
                            rows={4}
                            variant="standard"
                            hiddenLabel
                            defaultValue={curios}
                            onChange={(event) => {
                                setNickName(event.target.value);
                            }}
                        />
                    </Box>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12}>
                    <Box>
                        CuriosGaugeの自動設定
                    </Box>
                    <Select
                        labelId="profile-curios-direction"
                        id="profile-curios-direction"
                        value={curiosDirection}
                        label="CuriosDirection"
                        onChange={(event: SelectChangeEvent) => {
                            setCuriosDirection(event.target.value as string);
                        }
                        }
                    >
                        <MenuItem value={"ガンガンいこうぜ"}>ガンガンいこうぜ</MenuItem>
                        <MenuItem value={"バッチリがんばれ"}>バッチリがんばれ</MenuItem>
                        <MenuItem value={"いのちだいじに"}>いのちだいじに</MenuItem>
                        <MenuItem value={"めいれいさせろ"}>めいれいさせろ</MenuItem>
                    </Select>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12}>
                    <Box>
                        AIS
                        <Switch
                            checked={isPublicAis}
                            onChange={() => {
                                setIsPublicAis(!isPublicAis);
                                console.log("isPublicAis");
                            }
                            }
                            name="isPublicAis"
                            color="primary"
                        />
                        {isPublicAis ? "公開する" : "公開しない"}
                    </Box>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12}>
                    <Box>
                        ポートフォリオ
                        <Switch
                            checked={isShowPortFolio}
                            onChange={() => {
                                setIsShowPortFolio(!isShowPortFolio);
                                console.log("isShowMbti");
                            }
                            }
                            name="isShowMbti"
                            color="primary"
                        />
                        {isShowPortFolio?"公開する":"公開しない"}
                    </Box>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12}>
                    <Box>
                        性格タイプ
                        <Switch
                            checked={isShowMbti}
                            onChange={() => {
                                setIsShowMbti(!isShowMbti);
                                console.log("isShowMbti");
                            }
                            }
                            name="isShowMbti"
                            color="primary"
                        />
                        {isShowMbti?"公開する":"公開しない"}
                    </Box>
                    {/*{mbti}*/}
                    <Select
                        labelId="profile-mbti"
                        id="profile-mbti"
                        value={mbti}
                        label="Mbti"
                        disabled={!isShowMbti}
                        onChange={(event: SelectChangeEvent) => {
                                setMbti(event.target.value as string);
                            }
                        }
                    >
                        <MenuItem value={"建築家(INTJ-A)"}>建築家(INTJ-A)</MenuItem>
                        <MenuItem value={"建築家(INTJ-T)"}>建築家(INTJ-T)</MenuItem>
                        <MenuItem value={"論理学者(INTP-A)"}>論理学者(INTP-A)</MenuItem>
                        <MenuItem value={"論理学者(INTP-T)"}>論理学者(INTP-T)</MenuItem>
                    </Select>
                </Grid>
            </Grid>
        </div>
    );
};

export default ProfileEditUI;
