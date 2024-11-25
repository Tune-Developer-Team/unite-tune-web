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
        <Box>
            <Box sx={{display: loading.isLoading ? "fixed" : "none"}}>
                <img src={loadingImage}/>
            </Box>
        </Box>
    );
};
export default Loader;
