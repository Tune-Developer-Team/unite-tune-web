import React, {useState} from "react";
import Box from "@mui/material/Box";
import {styled} from "@mui/system";
import {CloudUpload} from "@mui/icons-material";
import ImagePath from "../../models/data/ImagePath";
import {Api} from "../../models/Api/Api";
import {useRecoilState} from "recoil";
import {authenticationState} from "../../atoms/AuthenticationState";
import Button, {ButtonProps} from "@mui/material/Button";
import {loaderState} from "../../atoms/LoaderState";
import Loader from "../../ui/loading/Loader";

// styledの型定義にButtonPropsを渡すことで、componentプロパティを正しく扱えるようにします
const ImageUploadButton = styled(Button)<ButtonProps>(({theme}) => ({
    borderRadius: '2em', // 楕円形の角丸スタイル
    padding: '0.2em 2.0em', // 縦横の内側の余白をem単位で指定
    textTransform: 'none', // テキストを大文字にしない
    fontSize: '0.9rem', // テキストサイズ
    backgroundColor: 'transparent', // 背景を透明に
    color: theme.palette.text.secondary, // テキスト色
    border: '0.125em solid gray', // グレーの枠線
    position: 'relative',
    overflow: 'hidden', // アニメーションのためにoverflowをhiddenに
    transition: 'color 0.3s ease', // テキスト色のトランジション
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: 'inherit',
        border: '0.125em solid transparent', // 初期は透明の枠線
        boxSizing: 'border-box',
        transition: 'border-color 0.3s ease', // 枠線の色のトランジション
    },
    '&:hover': {
        color: theme.palette.text.primary, // ホバー時のテキスト色
    },
}));

interface ImageUploadFormPropsIF {
    onFileChange: (imagePath: ImagePath) => void; // 親コンポーネントに結果を返すコールバック関数
    folderName: string;
    uploadEndPoint: string;
}

export const ImageUploadForm: React.FC<ImageUploadFormPropsIF> = ({
                                                                      onFileChange,
                                                                      folderName,
                                                                      uploadEndPoint,
                                                                  }) => {
    // グローバルオブジェクト
    const [authState] = useRecoilState(authenticationState);
    const [loading, setLoading] = useRecoilState(loaderState);
    // フォーム
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const now = new Date();
            const dateTimeString = now.toISOString().replace(/[:.]/g, '-');
            const newFileName = `${dateTimeString}_${file.name.substring(file.name.lastIndexOf('.'))}`;
            const newFile = new File([file], newFileName, {type: file.type});
            setUploadFile(newFile);

            // API開始
            setLoading({isLoading:true});
            const api = new Api(authState);
            api.setConfig({contentsType: "multipart/form-data"});
            await api.post({
                endPoint: `${uploadEndPoint}/${folderName}`,
                body: {file: newFile},
            }).then((res) => {
                const uploadedImagePath = ImagePath.create({alt: newFile.name, path: res.data.url});
                onFileChange(uploadedImagePath);
                setLoading({isLoading:false});
            }).catch((err) => {
                console.log("failure", err);
                const uploadedImagePath = ImagePath.create({alt: '', path: ''});
                onFileChange(uploadedImagePath);
                setLoading({isLoading:false});
            });
        }
    };

    return (
        <Box sx={{display: "flex", width: "100%"}}>
            <Loader/>
            <ImageUploadButton
                component="label"
                variant="contained"
                startIcon={<CloudUpload/>}
            >
                Upload
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                />
            </ImageUploadButton>
        </Box>
    );
};
