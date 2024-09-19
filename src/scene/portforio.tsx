import React, {useEffect} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import {useRecoilState} from "recoil";
import {navigationState} from "../atoms/NavigationState";
import aiIcon from "../assets/ais.svg";

const Portforio = () => {
    const [navigation, setNavigation] = useRecoilState(navigationState);

    useEffect(() => {
        setNavigation({isHidden: false, isEnableRedirect: true});
    }, []);

    return (
        <div className="Home" style={{paddingLeft: '5rem'}}>
            <Grid container spacing={2} className={"projectByLanguage"}>
                <Grid sx={{textAlign: "center"}} xs={12} sm={12} md={12} lg={12}>
                    <Typography variant="h4" component="div" sx={{textAlign: "center"}}>
                        <img src={aiIcon}/>️ AIS (AISecretary)
                    </Typography>
                    <Typography>
                        Under Construction !
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
};

export default Portforio;
