import React, { useEffect, useState } from "react";
import { Grid, Button, Box, LinearProgress, Typography } from "@mui/material";
import {useNavigate} from "react-router-dom";

/**
 * ボタンの制御
 */
const getButtonState = (date: Date): { [key: string]: boolean } => {
    const hour = date.getHours();
    const minute = date.getMinutes();
    return {
        startWork: hour <= 8 || (hour > 8 && hour < 10) || (hour === 10 && minute < 59),
        startBreak: hour === 11 || (hour === 12 && minute < 30),
        endBreak: hour === 12 && minute >= 30 || (hour > 12 && hour < 13) || (hour === 13 && minute < 1),
        endWork: hour >= 13 || (hour === 20 && minute === 0),
    };
};


/**
 * プログレスの算出
 */
const calculateProgress = (date: Date): { progress: number, color: string } => {
    const now = date.getHours() * 60 + date.getMinutes();
    const startOfDay = 9 * 60; // 08:00 in minutes
    const endOfDay = 18 * 60; // 20:00 in minutes

    const progress = Math.min(Math.max((now - startOfDay) / (endOfDay - startOfDay), 0), 1);

    let color = '#1b79ff'; // default color for progress bar
    if (date.getHours() === 9 || (date.getHours() === 10 && date.getMinutes() < 59)) {
        color = '#ff9800'; // green for startWork
    } else if (date.getHours() === 11 || (date.getHours() === 12 && date.getMinutes() < 30)) {
        color = '#4caf50'; // red for startBreak
    } else if (date.getHours() === 12 && date.getMinutes() >= 30 || (date.getHours() === 13 && date.getMinutes() < 1)) {
        color = '#4caf50'; // orange for endBreak
    } else if (date.getHours() >= 13 && (date.getHours() < 18 || (date.getHours() === 18 && date.getMinutes() === 0))) {
        color = '#ff9800'; // yellow for endWork
    }

    return { progress: progress * 100, color };
};

const AttendanceManage: React.FC = () => {
    const navigate = useNavigate();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [buttonState, setButtonState] = useState(getButtonState(currentDate));
    const [isWorking, setIsWorking] = useState(false);
    const [isBreaking, setIsBreaking] = useState(false);
    const [progressData, setProgressData] = useState(calculateProgress(currentDate));
    const [completeUpdate, setCompleteUpdate] = useState(false);

    /**
     * ボタンの色を取得
     */
    const getButtonColor = (buttonName: string) => {
        switch (buttonName) {
            case "work":
                return isWorking ? "warning" : "info";
            case "break":

                //　勤務開始してない
                if(!isWorking) {
                    return "secondary";
                }

                return isBreaking ? "warning" : "info";
        }
        return "secondary";
    };

    useEffect(() => {
        const updateDate = () => {
            //　MEMO: 開発用
            // const now = new Date("2024-09-19 10:00");
            // const now = new Date("2024-09-19 11:56");
            // const now = new Date("2024-09-19 12:55");
            // const now = new Date("2024-09-19 13:15");
            // const now = new Date("2024-09-19 18:15");

            const now = new Date();
            setCurrentDate(now);
            setButtonState(getButtonState(now));
            setProgressData(calculateProgress(now));
        };

        updateDate();
        const intervalId = setInterval(updateDate, 60000); // Update every minute

        return () => clearInterval(intervalId);
    }, []);

    /**
     * ステータスの更新が完了したらホームへ遷移
     */
    useEffect(() => {
        if (completeUpdate) {
            setTimeout(() => {
                // navigate('/');
            }, 1000)
        }
        return () => {
        };
    }, [isBreaking, isWorking]);


    return (
        <Box>
            <Box sx={{ width: '100%', marginBottom: 2 }} paddingBottom={5}>
                <Typography variant="h6" gutterBottom>
                </Typography>
                <LinearProgress
                    variant="determinate"
                    value={progressData.progress}
                    sx={{ height: 10, borderRadius: 5, backgroundColor: "#fff", '& .MuiLinearProgress-bar': { backgroundColor: progressData.color } }}
                />
            </Box>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={12} md={12} lg={12} paddingBottom={5}>
                    <Button
                        size="large"
                        variant="contained"
                        color={getButtonColor("work")}
                        fullWidth
                        disabled={isBreaking}
                        onClick={()=>{
                            if (isWorking) {
                                const isConfirm = window.confirm("勤務を終了しますか？");
                                if (!isConfirm) {
                                    return;
                                }
                            }

                            setTimeout(()=>{
                                setIsWorking(!isWorking);
                                setCompleteUpdate(true);
                            }, 1000);
                        }}
                    >
                        {!isWorking ? "勤務　かいし" : "勤務　おわり"}
                    </Button>
                </Grid>
                <Grid item xs={12} sm={3} md={12} lg={12}>
                    <Button
                        size="large"
                        variant="contained"
                        color={getButtonColor("break")}
                        fullWidth
                        disabled={!isWorking}
                        onClick={()=>{
                            // くどいな...
                            // if (isBreaking) {
                            //     const isConfirm = window.confirm("休憩を終了しますか？");
                            //     if (!isConfirm) {
                            //         return;
                            //     }
                            // }
                            setIsBreaking(!isBreaking);
                            setTimeout(() => {
                                setCompleteUpdate(true);
                            }, 1000);
                        }}
                    >
                        {!isBreaking ? "休憩　かいし" : "休憩　おわり"}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AttendanceManage;
