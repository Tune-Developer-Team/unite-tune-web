import {SeedEditViewModel} from "./SeedEditViewModel";
import {useRecoilState} from "recoil";
import {loaderState} from "../../atoms/LoaderState";
import {useParams} from "react-router-dom";
import {authenticationState} from "../../atoms/AuthenticationState";
import {navigationState} from "../../atoms/NavigationState";
import React, {useEffect, useState} from "react";
import {SeedDetail} from "../../models/Seed/SeedDetail/seedDetail";
import {hashTagString, isHashTag} from "../../models/data/types";
import ImagePath from "../../models/data/ImagePath";
import {Api} from "../../models/Api/Api";
import {endPoint} from "../../consts/api";
import {AddSeedInputParamIF} from "./SeedEditViewModelIF";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import {CircularProgress, Switch, TextField, ToggleButton, Toolbar} from "@mui/material";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import ArticleIcon from "@mui/icons-material/Article";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {ImageUploadForm} from "./ImageUploadForm";
import IconButton from "@mui/material/IconButton";
import ConfirmButton from "../../ui/confirmBottun/ConfirmButton";
import Profile from "../../models/Profile/Profile";
import {profileState} from "../../atoms/ProfileState";

function DeleteIcon() {
    return null;
}

interface SeedEditUIProps {
    viewModel: SeedEditViewModel
}

export default function SeedEditUI({viewModel}: SeedEditUIProps) {
    // グローバルオブジェクト
    const [profile] = useRecoilState<Profile>(profileState);
    const [loading, setLoading] = useRecoilState(loaderState);
    const [authState] = useRecoilState(authenticationState);

    const urlParams = useParams<{ seedId: string }>()
    const seedId = urlParams.seedId ?? '';
    // seedIdが空の場合ホームへ遷移する
    if (seedId === '') {
        window.location.href = '/';
    }

    // const [viewModel] = useState<SeedEditViewModel>(seedEditViewModel);
    const [isNeedUpdateDraft, setIsNeedUpdateDraft] = useState<boolean>(false);

    // シード
    const [seedDetail, setSeedDetail] = useState<SeedDetail>(viewModel.seedDetail);

    //　フォーム
    const [title, setTitle] = useState<string>("MySeed");
    const [description, setDescription] = useState<string>("");
    const [benefit, setBenefit] = useState<string>("");
    const [termsFrom, setTermFrom] = useState<any | null>(null);
    const [termsTo, setTermTo] = useState<any | null>(null);
    const [hashTags, setHashTags] = useState<hashTagString[]>([]);
    const [imagePathList, setImagePathList] = useState<ImagePath[]>([]);

    // ファイル変更時に受け取るコールバック関数
    const handleFileChange = async (imagePath: ImagePath) => {
        // アップロード済みの画像パスをリストに追加
        setImagePathList((prevList: ImagePath[]) => [...prevList, imagePath]);
        // 下書きの更新
        setIsNeedUpdateDraft(true);
    };

    // 画像削除処理
    const handleImageDelete = async (index: number, imagePath: ImagePath) => {
        const api = new Api(viewModel.authState);
        try {
            const objectName = imagePath.getGCSObjectName();

            const params = {
                ObjectName: objectName,
                BucketName: "auth-tune"
            };
            await api.post({
                endPoint: `${endPoint.DELETE_IMAGE}`,
                body: params
            });
            console.log("Image deleted successfully");

            // 画像をリストから削除
            setImagePathList((prevList) => prevList.filter((_, i) => i !== index));
            // 下書きの更新
            setIsNeedUpdateDraft(true);
        } catch (error) {
            console.log("Failed to delete image", error);
        }
    };

    // シードを追加する
    const saveSeed = async (param: { isPublished: boolean }): Promise<void> => {
        const dateTermsFrom = new Date(termsFrom);
        const unixTermsFrom = Math.floor(dateTermsFrom.getTime() / 1000);

        const dateTermsTo = new Date(termsTo);
        const unixTermsTo = Math.floor(dateTermsTo.getTime() / 1000);

        const addSeedParam: AddSeedInputParamIF = {
            ownerUserUid: authState.uid as string,
            isPublished: param.isPublished,
            seedId: seedId,
            title: title,
            description: description,
            benefit: benefit,
            termsFrom: unixTermsFrom,
            termsTo: unixTermsTo,
            hashTagStringList: hashTags,
            imagePathList: JSON.stringify(imagePathList),
            relationSeedIdList: JSON.stringify([]), // TODO: 未実装_関連するSeedを指定する機能
            mentionList: JSON.stringify([]) // TODO: 未実装_メンション_ユーザーにメンションできる機能
        };

        if (param.isPublished) {
            await viewModel.addSeed(addSeedParam);
        } else {
            await viewModel.addSeedAsDraft(addSeedParam);
        }
        setIsNeedUpdateDraft(false);
    }

    /**
     * 下書き更新フック
     */
    useEffect(() => {
        console.log('際描画と下書きの更新');
        console.log(imagePathList);
        if (isNeedUpdateDraft) {
            void saveSeed({isPublished: false});
        }
    }, [isNeedUpdateDraft]);

    /**
     * セットアップ
     */
    useEffect(() => {
        setLoading({isLoading: false});
        console.log(loading);

        const setUp = async () => {
            try {
                // セットアップ
                await viewModel.setUp({
                    authentication: {
                        accessToken: authState.accessToken,
                        uid: authState.uid,
                        email: authState.email
                    }, seedId: seedId,
                });
                setSeedDetail(viewModel.seedDetail);

                setTitle(viewModel.seedDetail.title ?? "MySeed");
                setDescription(viewModel.seedDetail.description ?? "");
                setBenefit(viewModel.seedDetail.benefit ?? "");
                const termFromAsDayJS = viewModel.seedDetail.getTermsFromAsDysJS();
                setTermFrom(termFromAsDayJS ?? dayjs());
                const termToAsDayJS = viewModel.seedDetail.getTermsFromAsDysJS();
                setTermTo(termToAsDayJS ?? dayjs());
                setHashTags(viewModel.seedDetail.hashTagStringList ?? []);
                setImagePathList(viewModel.seedDetail.imagePathList ?? []);
            } catch {
                console.log("セットアップエラー");
            } finally {
                setLoading({isLoading: false});
            }
        }

        setUp();
        console.log(viewModel);

        return () => {
            // クリーンアップ
            viewModel.cleanUp()
        };
    }, []);

    if (loading.isLoading) {
        return (
            <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
                <CircularProgress/> {/* ローディング表示 */}
            </Box>
        );
    }

    return (
        <Box className="SeedEdit">
            <Toolbar className={"MainHeader"} sx={{padding: 0}}>
                making seed.
            </Toolbar>
            <Grid container spacing={2} className={"MainBody"}>
                {/*画像*/}
                <Grid xs={12} sm={12} md={12} lg={12}>
                    <ImageUploadForm onFileChange={handleFileChange}
                                     folderName={seedId}
                                     uploadEndPoint={endPoint.UPLOAD_SEED_IMAGE}/>
                    <Box>
                        {imagePathList.map((imagePath: ImagePath, index: number) => (
                            <Box
                                key={index}
                                sx={{
                                    position: "relative",
                                    width: 100,
                                    height: 100,
                                }}
                            >
                                <img
                                    src={imagePath.path}
                                    alt={imagePath.alt}
                                    width="100"
                                    height="100"
                                    style={{objectFit: "cover"}}
                                />
                                {/* ホバーで表示される削除ボタン */}
                                <IconButton
                                    onClick={() => handleImageDelete(index, imagePath)}
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        color: "white",
                                        bgcolor: "rgba(255,255,255,0.5)",
                                        '&:hover': {
                                            bgcolor: "rgba(255, 0, 0, 0.7)"
                                        },
                                    }}
                                >
                                    <DeleteIcon/>
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                </Grid>
                {/*タイトル*/}
                <Grid xs={12} sm={12} md={12} lg={12}>
                    <Box>タイトル</Box>
                    <Box sx={{backgroundColor:"#3d3f41", borderRadius: "0.4rem"}}>
                        <TextField
                            fullWidth
                            required
                            multiline
                            rows={4}
                            variant="standard"
                            hiddenLabel
                            defaultValue={seedDetail.title}
                            onChange={(event) => {
                                setTitle(event.target.value);
                            }}
                        />
                    </Box>
                </Grid>
                {/*詳細*/}
                <Grid xs={12} sm={12} md={12} lg={12}>
                    詳細
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
                            defaultValue={seedDetail.description}
                            onChange={(event) => {
                                setDescription(event.target.value);
                            }}
                        />
                    </Box>
                </Grid>

                {/*便益*/}
                <Grid xs={12} sm={12} md={12} lg={12}>
                    約束する価値
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12}>
                    <Box sx={{backgroundColor: "#3d3f41", borderRadius: "0.4rem"}}>
                        <TextField
                            sx={{width: "100%"}}
                            id="standard-multiline-static"
                            required
                            multiline
                            rows={4}
                            variant="standard"
                            hiddenLabel
                            defaultValue={seedDetail.benefit}
                            onChange={(event) => {
                                setBenefit(event.target.value);
                            }}
                        />
                    </Box>
                </Grid>

                {/*期間*/}
                <Grid xs={12} sm={12} md={12} lg={12}>
                    期間
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12}>
                    <Box sx={{backgroundColor: "#3d3f41", borderRadius: "0.4rem", display: "flex"}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                defaultValue={seedDetail.getTermsFromAsDysJS() || dayjs()}
                                // defaultValue={termsFrom} // デフォルト値をUnixTimeから設定
                                onChange={
                                    (date) => setTermFrom(date)
                                }
                            />
                            <span>→</span>
                            <DatePicker
                                defaultValue={seedDetail.getTermsToAsDysJS() || dayjs()}
                                onChange={
                                    (date) => setTermTo(date)
                                }
                            />
                        </LocalizationProvider>
                    </Box>
                </Grid>

                {/*ジョイン設定*/}
                <Grid xs={12} sm={12} md={12} lg={12}>
                    自由参加を許可する
                    <Switch
                    checked={true}
                    onChange={() => console.log("join")}
                    name="isJoinable"
                    color="primary"
                />
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12}>
                    公開する
                    <Switch
                        checked={true}
                        onChange={() => console.log("draft")}
                        name="isDraft"
                        color="primary"
                    />
                </Grid>


                {/*タグ*/}
                <Grid xs={12} sm={12} md={12} lg={12}>
                    タグ
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12}>
                    <Box sx={{backgroundColor:"#3d3f41", borderRadius: "0.4rem"}}>
                        <TextField
                            sx={{width: "100%"}}
                            id="standard-multiline-static"
                            required
                            multiline
                            rows={4}
                            variant="standard"
                            hiddenLabel
                            defaultValue={seedDetail.hashTagStringList}
                            onChange={(event) => {
                                // TODO: カンマ区切りで入ってくる文字列をカンマごとにハッシュタグの形式で格納する
                                const input = event.target.value;
                                if (isHashTag(input)) {
                                    setHashTags([input as hashTagString]);
                                } else {
                                    // TODO:自動で補正かけて画面に反映する
                                    console.log("バリデーションエラー")
                                }
                            }}
                        />
                    </Box>

                    <Box sx={{marginTop:5}} textAlign={"center"}>
                        <ConfirmButton label={'保存'} onClick={() => {
                            saveSeed({isPublished: true})
                        }}/>
                    </Box>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12}>
                    <Box sx={{textAlign: "center"}}>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};