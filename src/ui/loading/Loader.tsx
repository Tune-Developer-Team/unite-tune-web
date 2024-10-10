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
        <Box sx={{display: loading.isLoading ? "flex" : "none"}} width={"100%"} position={"relative"}>
            <Box width={"100%"} position={"fixed"} top={230} left={-10}>
                <img src={loadingImage} width={"100%"}/>
            </Box>
        </Box>
    );
};
export default Loader;
