import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { CloudUpload } from "@mui/icons-material";
import ImagePath from "../../models/data/ImagePath";
import {Api} from "../../models/Api/Api";
import {endPoint} from "../../consts/api";
import Authentication from "../../models/Authentication/Authentication";

interface ImageUploadFormPropsIF {
    authState: Authentication; // 認証情報
    onFileChange: (imagePath: ImagePath) => void; // 親コンポーネントに結果を返すコールバック関数
}

export const ImageUploadForm: React.FC<ImageUploadFormPropsIF> = ({
                                                                      authState: authState,
                                                                      onFileChange: onFileChange
                                                                  }) => {
    const [uploadFile, setUploadFile] = useState<File | null>(null);

    // ファイル変更ハンドラ
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setUploadFile(file);

            const api = new Api(authState);
            api.setConfig({contentsType: "multipart/form-data"});
            await api.post({
                endPoint: endPoint.UPLOAD_IMAGE, body: {
                    file: file,
                }
            }).then((res) => {
                console.log("success");
                console.log(res);

                const uploadedImagePath = ImagePath.create({alt: file.name.toString(), path: res.data.url});
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

