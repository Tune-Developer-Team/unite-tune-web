import React from 'react';
import {Box, Button} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Outlet, useNavigate} from "react-router-dom";
import Loader from "../../../../ui/loading/Loader";
import RoundedButton from "../../../../ui/button/RoundedButton";

const ContentDetail = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ paddingBottom: 0.2 }} width={"100%"}>
            <Loader/>
            <Box display={"flex"}>
                <Button
                    startIcon={<ArrowBackIcon/>}
                    onClick={() => navigate(-1)} // Go back to the previous screen
                    sx={{
                        marginBottom: 2,
                        color: 'white', // ボタンのテキストカラーを白に設定
                        '&:hover': {
                            color: 'rgba(220,220,220,0.68)', // ボタンのテキストカラーを白に設定
                        },
                    }}
                >
                    List
                </Button>
                <Box sx={{textAlign: "end"}} width={"100%"}>
                    <RoundedButton onClick={() => {
                    }}>
                        気になるリストに追加
                    </RoundedButton>
                </Box>
            </Box>
            <Outlet/>
        </Box>
    );
};

export default ContentDetail;
