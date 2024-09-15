import React, {useEffect, useState} from 'react';

import {useRecoilState} from "recoil";
import Grid from "@mui/material/Unstable_Grid2";
import {useParams} from "react-router-dom";
import {TuneCardViewModel} from "./tuneCardViewModel";
import {navigationState} from "../../atoms/NavigationState";
import {tuneCardState} from "../../atoms/TuneCardState";
import Loader from "../../ui/loading/Loader";
import {loaderState} from "../../atoms/LoaderState";
import {TuneCard} from "../../models/TuneCard/TuneCard";
import Box from "@mui/material/Box";

const tuneCardViewModel = new TuneCardViewModel();

const TuneCardView: React.FunctionComponent = () => {
    const [loading, setLoading] = useRecoilState(loaderState);
    const [navigation, setNavigation] = useRecoilState(navigationState);
    const [tuneCard, setTuneCard] = useRecoilState<TuneCard>(tuneCardState);
    const [viewModel] = useState<TuneCardViewModel>(tuneCardViewModel);

    const urlParams = useParams<{ cardSerial: string }>()
    const cardSerial: string = urlParams.cardSerial ?? '';

    console.log('====================');
    console.log(cardSerial);
    console.log('====================');
    // serialIdが空の場合ホームへ遷移する
    if (cardSerial === '') {
        // window.location.href = '/';
    }

    const getUIdBySerial = async (): Promise<void> => {
        setLoading({isLoading: true});
        console.log("===getUIdBySerial===");
        await viewModel.getTuneCard(cardSerial).then((tuneCard) => {
            console.log(tuneCard.serial);
            console.log(tuneCard.uid);

            setLoading({isLoading: false});

            if (!tuneCard.isActivated) {
                return;
            }

            setTuneCard(tuneCard)
            if (tuneCard.uid == '') {
                // 登録画面へ
                console.log('register');
                window.location.href = '/register';
                return;
            }
        }).catch((error) => {setLoading({isLoading: false});
            console.log(error);

            const invalidCardEntity = TuneCard.creatTuneInstance({
                uid: "-",
                isActivated: false,
                serial: cardSerial,
                qrLink: "-",
                updateAt: "-",
                createdAt: "-",
                deletedAt: "-"
            });

            setTuneCard(invalidCardEntity)
        });
    }

    useEffect(() => {
        setNavigation({isHidden: true});
        void getUIdBySerial();
    }, []);

    return (
        <Grid container spacing={2} className={"preference"} style={{paddingLeft: '5rem'}}>
            <Loader/>
            <Box sx={{textAlign: "start", paddingTop: 30}}>
                <h2>TUNE CARD</h2>
                <div>
                    <p>
                        IsActivated<br/>
                        {tuneCard.isActivated?'true':'false'}
                    </p>
                    <p>
                        QRLink<br/>
                        {tuneCard.qrLink}
                    </p>
                    <p>
                        Serial<br/>
                        {tuneCard.serial}
                    </p>
                    <p>
                        UID<br/>
                        {tuneCard.uid}
                    </p>
                </div>
            </Box>
        </Grid>
    );
};
export default TuneCardView;
