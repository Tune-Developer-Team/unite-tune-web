import React, {useEffect} from 'react';
import {useRecoilState} from "recoil";
import loadingImage from "./loading.gif"
import {loaderState} from "../../atoms/LoaderState";
import {Box} from "@mui/material";

const Loader: React.FunctionComponent = () => {
    const [loading] = useRecoilState(loaderState);

    useEffect(() => {
    }, []);

    return (
        <>
            {loading.isLoading && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10000, // 最前面に表示する
                        backgroundColor: 'rgba(0,0,0,0.25)', // 半透明の背景色
                        pointerEvents: 'none', // 背景の操作を無効にする
                    }}
                >
                    <Box sx={{ pointerEvents: 'all' }}> {/* ローディングGIFはクリック可能 */}
                        <img src={loadingImage} width={"100%"}/>
                    </Box>
                </Box>
            )}
        </>
    );
};

export default Loader;
