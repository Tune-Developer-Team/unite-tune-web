import React, {useEffect} from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import {useRecoilState} from "recoil";
import {navigationState} from "../atoms/NavigationState";
import aiIcon from "../assets/ais.svg";

const Portfolio = () => {
    const [navigation, setNavigation] = useRecoilState(navigationState);

    useEffect(() => {
        setNavigation({isHidden: false, isEnableRedirect: true});
    }, []);

    return (
        <div className="Home" >
            <Grid container spacing={2} className={"projectByLanguage"}>
                <Grid sx={{textAlign: "center"}} xs={12} sm={12} md={12} lg={12}>
                    <Typography variant="h4" component="div" sx={{textAlign: "center"}}>
                        This is My Value
                    </Typography>
                    <br/>
                    <Typography>
                        【開発中】<br/>自分が取り組んできたSeedの連動情報
                    </Typography>
                    <br/>
                    <Typography>
                        【開発中】<br/>自分が投稿したブログの連動情報
                    </Typography>
                    <br/>
                    <Typography>
                        【開発中】<br/>TSUBUYAKIアプリの連動情報
                    </Typography>
                    <br/>
                    <Typography>
                        【開発中】<br/>GitHubでの使用言語やコミット頻度、リポジトリの数などの連動情報
                    </Typography>
                    <br/>
                    <Typography>
                        【開発中】<br/>自分で作ったWebアプリのリンク
                    </Typography>
                </Grid>
            </Grid>
        </div>
    );
};

export default Portfolio;
