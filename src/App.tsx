import React, {useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import './App.css';

import SignIn from "./scene/signIn/SignInView";
import {createTheme, ThemeProvider} from "@mui/material";
import {RecoilRoot, useRecoilState} from "recoil";
import Profile from "./scene/profile/ProfileView";
import Portfolio from "./scene/portfolio";
import HomeView from "./scene/home/HomeView";
import TuneCardView from "./scene/tuneCard/tuneCardView";
import PreferenceView from "./scene/preference/PreferenceView";
import RegisterView from "./scene/register/registerView";
import BlogPostTileList from "./ui/blogPost/BlogPostTileList";
import AISecretary from "./scene/crappy/AISecretary";
import NotFound from "./scene/notFound/NotFound";
import Layout from "./ui/layout/Layout";
import ThinkTankView from "./scene/thinkTank/ThinkTankView";
import QuestView from "./scene/Quest/QuestView";
import QuestListView from "./scene/questList/QuestListView";
import {authenticationState} from "./atoms/AuthenticationState";
import {ThinkTankViewModel} from "./scene/thinkTank/ThinkTankViewModel";

function App() {
    const [darkMode] = useState(true);
    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#1857df',
            },
            secondary: {
                main: '#cecece',
            },
        },
        breakpoints: {
            values: {
                xs: 320,
                sm: 480,
                md: 768,
                lg: 1285,
                xl: 1536,
            },
        },
    });

    console.log("loading-react-app");
    return (
        <RecoilRoot>
            <ThemeProvider theme={theme}>
                <BrowserRouter basename={"/"}>
                    <Routes>
                        <Route path='/card/:cardSerial' element={<TuneCardView />} />
                        <Route path='/register' element={<RegisterView />} />
                        <Route path='/signin' element={<SignIn />} />
                        <Route path='/' element={<Layout />} >
                            <Route path='/preference' element={<PreferenceView />} />
                            <Route path='/home' element={<HomeView />} />
                            <Route path='/quests/:questId/edit' element={<QuestView />} />
                            <Route path='/quests/:questId' element={<QuestView />} />
                            <Route path='/timeline' element={<ThinkTankView viewModel={ThinkTankViewModel.appInit()}/>}/>
                            {/*<Route path='/timeline/:thinkId' element={<ThinkTankView />} />*/}
                            <Route path='/user/:uid' element={<Profile />} />
                            <Route path='/user/:uid/ais' element={<AISecretary />} />
                            <Route path='/user/:uid/portfolio' element={<Portfolio />} />
                            {/*Seedの機能実装は延期する*/}
                            {/*<Route path='/quest/:seedId/edit' element={<SeedEditView />} />*/}
                            {/*<Route path='/quest/:seedId' element={<SeedDetailView />} />*/}
                            {/*<Route path='/seeds' element={<SeedListView />} />*/}
                            <Route path='/quests' element={<QuestListView />} />
                            <Route path='/blogposts' element={<BlogPostTileList />} />
                        </Route>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </RecoilRoot>
    );
}

export default App;
