import React, {useEffect, useState} from 'react';
import {useRecoilState} from "recoil";
import {authenticationState} from "../../atoms/AuthenticationState";
import Box from "@mui/material/Box";
import {profileState} from "../../atoms/ProfileState";
import {SeedEditViewModel} from "./SeedEditViewModel";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import {TextField, Toolbar} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {useParams} from "react-router-dom";
import ConfirmButton from "../../ui/confirmBottun/ConfirmButton";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import ImagePath from "../../models/data/ImagePath";
import {hashTagString, isHashTag} from "../../models/data/types";
import {navigationState} from "../../atoms/NavigationState";
import {AddSeedInputParamIF} from "./SeedEditViewModelIF";
import {ImageUploadForm} from "./imageUploadForm";
import IconButton from "@mui/material/IconButton";
import {endPoint} from "../../consts/api";
import {Api} from "../../models/Api/Api";

const seedEditViewModel = new SeedEditViewModel();

function DeleteIcon() {
    return null;
}

const SeedEditView: () => JSX.Element = () => {
    const urlParams = useParams<{ seedId: string }>()
    const seedId = urlParams.seedId ?? '';
    // seedIdが空の場合ホームへ遷移する
    if (seedId === '') {
        window.location.href = '/';
    }

    const [authState] = useRecoilState(authenticationState);
    const [navigation, setNavigation] = useRecoilState(navigationState);
    const [viewModel] = useState<SeedEditViewModel>(seedEditViewModel);
    const [isNeedUpdateDraft, setIsNeedUpdateDraft] = useState<boolean>(false);

    //　フォーム
    const [title, setTitle] = useState<string>('MySeed');
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
            relationSeedIdList:  JSON.stringify([]), // TODO: 未実装_関連するSeedを指定する機能
            mentionList:  JSON.stringify([]) // TODO: 未実装_メンション_ユーザーにメンションできる機能
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
        if(isNeedUpdateDraft){
                void saveSeed({isPublished: false});
        }
    }, [isNeedUpdateDraft]);

    /**
     * セットアップ
     */
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

        return () => {
            // クリーンアップ
            viewModel.cleanUp()
        };
    }, []);

    return (
        <div className="Home" style={{paddingLeft: '5rem'}}>
            <Toolbar sx={{position: 'fixed'}} className={"MainHeader"}>
                <Typography variant="h4" component="div" sx={{textAlign: "center"}}>
                    🌱 {title}
                </Typography>
            </Toolbar>
            <Grid container spacing={2} className={"MainBody"}>
                <Grid sx={{textAlign: "start"}} xs={12} sm={12} md={12} lg={12}>

                </Grid>
                <Grid xs={0} sm={0} md={3} lg={3}>
                </Grid>
                <Grid xs={12} sm={12} md={6} lg={6}>
                    <Box sx={{marginTop: 10}}>
                        <Typography variant="h5" component="div" sx={{textAlign: "start", backgroundColor: "gray"}}>
                            <TipsAndUpdatesIcon/> Title
                        </Typography>
                        <TextField
                            sx={{width: "100%"}}
                            id="outlined-required"
                            required
                            hiddenLabel
                            defaultValue={title}
                            onChange={(event) => {
                                setTitle(event.target.value);
                            }}
                        />
                    </Box>
                    <Box sx={{marginTop: 10}}>
                        <Typography variant="h5" component="div" sx={{textAlign: "start", backgroundColor: "gray"}}>
                            <ArticleIcon/> Description
                        </Typography>
                        <TextField
                            sx={{width: "100%"}}
                            id="standard-multiline-static"
                            required
                            multiline
                            rows={4}
                            variant="standard"
                            hiddenLabel
                            onChange={(event) => {
                                setDescription(event.target.value);
                            }}
                        />
                    </Box>
                    <Box sx={{marginTop: 10}}>
                        <Typography variant="h5" component="div" sx={{textAlign: "start", backgroundColor: "gray"}}>
                            <ArticleIcon/> CategoryHashTag
                        </Typography>
                        <TextField
                            sx={{width: "100%"}}
                            id="standard-multiline-static"
                            required
                            multiline
                            rows={4}
                            variant="standard"
                            hiddenLabel
                            onChange={(event) => {
                                // TODO: カンマ区切りで入ってくる文字列をカンマごとにハッシュタグの形式で格納する
                                const input = event.target.value;
                                if (isHashTag(input)) {
                                    setHashTags([input as hashTagString]);
                                }else{
                                    // TODO:自動で補正かけて画面に反映する
                                    console.log("バリデーションエラー")
                                }
                            }}
                        />
                    </Box>
                    <Box sx={{marginTop: 10}}>
                        <Typography variant="h5" component="div" sx={{textAlign: "start", backgroundColor: "gray"}}>
                            <VolunteerActivismIcon/> Benefit
                        </Typography>
                        <TextField
                            sx={{width: "100%"}}
                            id="standard-multiline-static"
                            required
                            multiline
                            rows={4}
                            variant="standard"
                            hiddenLabel
                            onChange={(event) => {
                                setBenefit(event.target.value);
                            }}
                        />
                    </Box>
                    <Box sx={{marginTop: 10}}>
                        <Typography variant="h5" component="div" sx={{textAlign: "start", backgroundColor: "gray"}}>
                            <CalendarMonthIcon/> Terms
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                onChange={
                                    (date) => setTermFrom(date)
                                }
                            />
                            <DatePicker
                                onChange={
                                    (date) => setTermTo(date)
                                }
                            />
                        </LocalizationProvider>
                    </Box>
                    <Box sx={{marginTop: 10}}>
                        <Typography variant="h5" component="div" sx={{textAlign: "start", backgroundColor: "gray"}}>
                            <TipsAndUpdatesIcon/> Image
                        </Typography>
                        <ImageUploadForm onFileChange={handleFileChange} authState={viewModel.authState} />
                        <div>
                            {imagePathList.map((imagePath:ImagePath, index:number) => (
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
                                        style={{ objectFit: "cover" }}
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
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}
                        </div>
                    </Box>
                    <Box sx={{marginTop: 10}}>
                        <ConfirmButton label={'完了'} onClick={() => {
                            saveSeed({isPublished: true})
                        }}/>
                    </Box>
                </Grid>
                <Grid xs={12} sm={12} md={12} lg={12}>
                    <Box sx={{textAlign: "center"}}>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
};

export default SeedEditView;