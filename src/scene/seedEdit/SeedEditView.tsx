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
import {CloudUpload} from "@mui/icons-material";
import Button from "@mui/material/Button";
import {styled} from "@mui/system";
import {hashTagString, isHashTag} from "../../models/data/types";
import {navigationState} from "../../atoms/NavigationState";
import {AddSeedInputParamIF} from "./SeedEditViewModelIF";

const seedEditViewModel = new SeedEditViewModel();

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

    // 画像
    const [file1, setFile1] = useState<File | null>(null);
    const [file2, setFile2] = useState<File | null>(null);
    const [file3, setFile3] = useState<File | null>(null);
    const [file4, setFile4] = useState<File | null>(null);

    // シードを追加する
    const addSeed = async (): Promise<void> => {

        const imageList = [];
        imageList.push(ImagePath.create({path:file1?.webkitRelativePath??'', alt: file1?.name??''}));
        imageList.push(ImagePath.create({path:file2?.webkitRelativePath??'', alt: file2?.name??''}))
        imageList.push(ImagePath.create({path:file3?.webkitRelativePath??'', alt: file3?.name??''}))
        imageList.push(ImagePath.create({path:file4?.webkitRelativePath??'', alt: file4?.name??''}))

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
            imagePathList: JSON.stringify(imageList),
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
                        <Box sx={{display: "flex", width: "100%"}}>
                            {(file1 !== null)
                                ?
                                <Box style={{maxWidth: '30%', height: 'auto'}}>
                                    <Box style={{textAlign: "center", position: "relative", zIndex:10, paddingTop: "-2rem"}}
                                         onClick={() => {
                                            setFile1(null);
                                        }}>remove</Box>
                                    <img src={window.URL.createObjectURL(file1)} alt={'Uploaded-1'} style={{maxWidth: '100%', height: 'auto'}}/>
                                </Box>
                                : <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUpload/>}
                                onChange={async (event) => {
                                    if (event.target instanceof HTMLInputElement) {
                                        console.log(event.target.files);
                                        if (event.target.files !== null) {
                                            const file = event.target.files[0] as File;
                                            await viewModel.uploadFile(file);

                                        }
                                    } else {
                                        console.log('none');
                                    }
                                }}
                            >
                                Upload file1
                                <VisuallyHiddenInput type="file"/>
                            </Button>}
                            {(file2 !== null)
                                ? <Box style={{maxWidth: '30%', height: 'auto'}}>
                                    <Box style={{textAlign: "center", position: "relative", zIndex:10, paddingTop: "-2rem"}}
                                         onClick={() => {
                                             setFile2(null);
                                         }}>remove</Box><img src={window.URL.createObjectURL(file2)} alt={'Uploaded-2'} style={{maxWidth: '100%', height: 'auto'}}/>
                                </Box>
                                : <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUpload/>}
                                onChange={(event) => {
                                    if (event.target instanceof HTMLInputElement) {
                                        console.log(event.target.files);
                                        if (event.target.files !== null) {
                                            setFile2(event.target.files[0]);
                                        }
                                    } else {
                                        console.log('none');
                                    }
                                }}
                            >
                                Upload file2
                                <VisuallyHiddenInput type="file"/>
                            </Button>}
                            {(file3 !== null)
                                ? <Box style={{maxWidth: '100%', height: 'auto'}}>
                                    <Box style={{textAlign: "center", position: "relative", zIndex:10, paddingTop: "-2rem"}}
                                         onClick={() => {
                                             setFile3(null);
                                         }}>remove</Box>
                                    <img src={window.URL.createObjectURL(file3)} alt={'Uploaded-3'} style={{maxWidth: '100%', height: 'auto'}}/>
                                </Box>
                                : <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUpload/>}
                                onChange={(event) => {
                                    if (event.target instanceof HTMLInputElement) {
                                        console.log(event.target.files);
                                        if (event.target.files !== null) {
                                            setFile3(event.target.files[0]);
                                        }
                                    } else {
                                        console.log('none');
                                    }
                                }}
                            >
                                Upload file3
                                <VisuallyHiddenInput type="file"/>
                            </Button>}
                            {(file4 !== null)
                                ? <Box style={{maxWidth: '30%', height: 'auto'}}>
                                    <Box style={{textAlign: "center", position: "relative", zIndex:10, paddingTop: "-2rem"}}
                                         onClick={() => {
                                             setFile4(null);
                                         }}>remove</Box>
                                    <img src={window.URL.createObjectURL(file4)} alt={'Uploaded-4'}
                                                     style={{maxWidth: '100%', height: 'auto'}}/>
                                </Box>
                                : <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUpload/>}
                                onChange={(event) => {
                                    if (event.target instanceof HTMLInputElement) {
                                        console.log(event.target.files);
                                        if (event.target.files !== null) {
                                            setFile4(event.target.files[0]);
                                        }
                                    } else {
                                        console.log('none');
                                    }
                                }}
                            >
                                Upload file4
                                <VisuallyHiddenInput type="file"/>
                            </Button>}
                        </Box>
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