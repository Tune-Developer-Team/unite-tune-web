import React, {useEffect, useState} from 'react';

import {useRecoilState} from "recoil";
import Grid from "@mui/material/Unstable_Grid2";
import {v4 as uuidv4} from 'uuid';
import {useParams} from "react-router-dom";
import {TuneCardViewModel} from "./tuneCardViewModel";
import {navigationState} from "../../atoms/NavigationState";
import {tuneCardState} from "../../atoms/TuneCardState";
import Loader from "../../ui/loading/Loader";
import {loaderState} from "../../atoms/LoaderState";

const tuneCardViewModel = new TuneCardViewModel();

const TuneCardView: React.FunctionComponent = () => {
    const [loading, setLoading] = useRecoilState(loaderState);
    const [navigation, setNavigation] = useRecoilState(navigationState);
    const [tuneCard, setTuneCard] = useRecoilState(tuneCardState);
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
        await viewModel.getUIdByCardSerial(cardSerial).then((response) => {
            console.log(response);

            setLoading({isLoading: false});

            if (!response.isActivated) {
                console.log(response.message);
                return;
            }

            if (response.uid !== '') {
                console.log('profile');
                setTuneCard({serial: cardSerial, uid: response.uid});
                // cardSerialと紐づいているUIdのプロフィールへ
                window.location.href = '/user/' + response.uid;
                return;
            }

            // 登録画面へ
            const uid = uuidv4() as string;
            setTuneCard({serial: cardSerial, uid: uid});
            console.log('register');
            window.location.href = '/register';
            return;
        }).catch((error) => {                 setLoading({isLoading: false});
            console.log(error);
        });
    }

    useEffect(() => {
        setNavigation({isHidden: true});
        void getUIdBySerial();
    }, []);

    return (
        <Grid container spacing={2} className={"preference"} style={{paddingLeft: '5rem'}}>
            <Loader/>
        </Grid>
    );
};
export default TuneCardView;
