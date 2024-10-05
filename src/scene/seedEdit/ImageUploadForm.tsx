import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { CloudUpload } from "@mui/icons-material";
import ImagePath from "../../models/data/ImagePath";
import {Api} from "../../models/Api/Api";
import {useRecoilState} from "recoil";
import {authenticationState} from "../../atoms/AuthenticationState";

interface ImageUploadFormPropsIF {
    onFileChange: (imagePath: ImagePath) => void; // 親コンポーネントに結果を返すコールバック関数
    folderName: string;
    uploadEndPoint: string;
}

export const ImageUploadForm: React.FC<ImageUploadFormPropsIF> = ({
                                                                      onFileChange: onFileChange,
                                                                      folderName: folderName,
                                                                      uploadEndPoint: uploadEndPoint
                                                                  }) => {
    const [authState] = useRecoilState(authenticationState);
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    // ファイル変更ハンドラ
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];

            // 新しいファイル名を定義する
            const now = new Date();
            const dateTimeString = now.toISOString().replace(/[:.]/g, '-');
            const newFileName = `seed-image-${dateTimeString}_${file.name.substring(file.name.lastIndexOf('.'))}`;
            // 新しいFileオブジェクトを作成
            const newFile = new File([file], newFileName, { type: file.type });
            setUploadFile(newFile);

            const api = new Api(authState);
            api.setConfig({contentsType: "multipart/form-data"});
            await api.post({
                endPoint: `${uploadEndPoint}/${folderName}`, body: {
                    file: newFile,
                }
            }).then((res) => {
                console.log("success");
                console.log(res);

                const uploadedImagePath = ImagePath.create({alt: newFile.name.toString(), path: res.data.url});
                // 親コンポーネントにアップロード結果を渡す
                onFileChange(uploadedImagePath);
            }).catch((err)=>{
                console.log("failure");
                console.log(err);
                const uploadedImagePath = ImagePath.create({alt: '', path: ''});
                // 親コンポーネントにアップロード結果を渡す
                onFileChange(uploadedImagePath);
            });
        }
    };

    return (
        <Box sx={{ display: "flex", width: "100%" }}>
            <Button
                component="label"
                variant="contained"
                startIcon={<CloudUpload />}
            >
                upload image
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                />
            </Button>
        </Box>
    );
};

