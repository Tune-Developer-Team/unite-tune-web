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
import {styled} from "@mui/system";
import {hashTagString, isHashTag} from "../../models/data/types";
import {navigationState} from "../../atoms/NavigationState";
import {AddSeedInputParamIF} from "./SeedEditViewModelIF";
import {ImageUploadForm} from "./imageUploadForm";
import IconButton from "@mui/material/IconButton";

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
    const [profile, setProfile] = useRecoilState(profileState);
    const [navigation, setNavigation] = useRecoilState(navigationState);
    const [viewModel] = useState<SeedEditViewModel>(seedEditViewModel);

    //　フォーム
    const [title, setTitle] = useState<string>('MySeed');
    const [description, setDescription] = useState<string>("");
    const [benefit, setBenefit] = useState<string>("");
    const [termsFrom, setTermFrom] = useState<any | null>(null);
    const [termsTo, setTermTo] = useState<any | null>(null);
    const [hashTags, setHashTags] = useState<hashTagString[]>([]);
    const [imagePathList, setImagePathList] = useState<ImagePath[]>([]);

    // 画像
    const [file1, setFile1] = useState<File | null>(null);
    const [file2, setFile2] = useState<File | null>(null);
    const [file3, setFile3] = useState<File | null>(null);
    const [file4, setFile4] = useState<File | null>(null);

    // ファイル変更時に受け取るコールバック関数
    const handleFileChange = (imagePath: ImagePath) => {
        // アップロード済みの画像パスをリストに追加
        setImagePathList((prevList: ImagePath[]) => [...prevList, imagePath]);
    };

    // 画像削除処理
    const handleImageDelete = async (index: number, imagePath: ImagePath) => {
        // const api = new Api(viewModel.authState);　// TODO:バックエンド実装待ち
        try {
            // TODO:バックエンド実装待ち
            // await api.delete({
            //     endPoint: `${endPoint.DELETE}/${imagePath.path}`,
            // });
            console.log("Image deleted successfully");

            // 画像をリストから削除
            setImagePathList((prevList) => prevList.filter((_, i) => i !== index));
        } catch (error) {
            console.log("Failed to delete image", error);
        }
    };

    const fileUploadHandler = async (file: File | null): Promise<void> => {
        if(file == null){
            return;
        }
        const index = 0;
        const imagePathList = await viewModel.uploadFile(index, file);
        setImagePathList(imagePathList);
    }

    const fileRemoveHandler = async (index: number): Promise<void> => {
        const imagePathList = await viewModel.removeFile(index);
        setImagePathList(imagePathList);
        console.log('リムーブ');
        console.log(imagePathList);
    }

    // シードを追加する
    const addSeed = async (): Promise<void> => {
        const dateTermsFrom = new Date(termsFrom);
        const unixTermsFrom = Math.floor(dateTermsFrom.getTime() / 1000);

        const dateTermsTo = new Date(termsFrom);
        const unixTermsTo = Math.floor(dateTermsTo.getTime() / 1000);


        const addSeedParam: AddSeedInputParamIF = {
            ownerUserUid: authState.uid as string,
            isPublished: true,
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
        await viewModel.addSeed(addSeedParam);
    }

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    useEffect(() => {
        console.log('際描画');
        console.log(imagePathList);
    }, [imagePathList]);

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
                        <h1>ファイルアップロード</h1>
                        <ImageUploadForm onFileChange={handleFileChange} authState={viewModel.authState} />
                        <div>
                            <h2>アップロード済み画像一覧</h2>
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
                                            bgcolor: "rgba(0, 0, 0, 0.5)",
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

                        {/*<Box sx={{display: "flex", width: "100%"}}>*/}
                        {/*    {*/}
                        {/*        (imagePathList[0].path != '')*/}
                        {/*            ?*/}
                        {/*            <Box style={{maxWidth: '30%', height: 'auto'}}>*/}
                        {/*                {imagePathList[0].path}*/}
                        {/*                <Box style={{*/}
                        {/*                    textAlign: "center",*/}
                        {/*                    position: "relative",*/}
                        {/*                    zIndex: 10,*/}
                        {/*                    paddingTop: "-2rem"*/}
                        {/*                }}*/}
                        {/*                     onClick={async () => {*/}
                        {/*                         await fileRemoveHandler(0);*/}
                        {/*                     }}>remove</Box>*/}
                        {/*                <img src={imagePathList[0].path} alt={imagePathList[0].alt}*/}
                        {/*                     style={{maxWidth: '100%', height: 'auto'}}/>*/}
                        {/*            </Box>*/}
                        {/*            :*/}
                        {/*            <Button*/}
                        {/*                component="label"*/}
                        {/*                role={undefined}*/}
                        {/*                variant="contained"*/}
                        {/*                tabIndex={-1}*/}
                        {/*                startIcon={<CloudUpload/>}*/}
                        {/*                onChange={async (event) => {*/}
                        {/*                    if (event.target instanceof HTMLInputElement) {*/}
                        {/*                        console.log(event.target.files);*/}
                        {/*                        if (event.target.files !== null) {*/}
                        {/*                            await fileUploadHandler(0, event.target.files[0] as File);*/}
                        {/*                        }*/}
                        {/*                    } else {*/}
                        {/*                        console.log('none');*/}
                        {/*                    }*/}
                        {/*                }}*/}
                        {/*            >*/}
                        {/*                Upload file1*/}
                        {/*                <VisuallyHiddenInput type="file"/>*/}
                        {/*            </Button>*/}
                        {/*    }*/}
                        {/*</Box>*/}
                    </Box>
                    <Box sx={{marginTop: 10}}>
                        <ConfirmButton label={'完了'} onClick={() => {
                            addSeed()
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