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
import BlogPostTileList from "./scene/library/Parts/dBlog/BlogPostTileList";
import AISecretary from "./scene/crappy/AISecretary";
import NotFound from "./scene/notFound/NotFound";
import Layout from "./ui/layout/Layout";
import ThinkTankView from "./scene/thinkTank/ThinkTankView";
import QuestView from "./scene/quest/QuestView";
import QuestListView from "./scene/questList/QuestListView";
import {ThinkTankViewModel} from "./scene/thinkTank/ThinkTankViewModel";
import ThinkTimeline from "./scene/thinkTank/Parts/ThinkTimeline";
import ThinkDetail from "./scene/thinkTank/Parts/ThinkDetail";
import MyThinkTank from "./scene/profile/ThinkTankTab/MyThinkTank";
import MainTab from "./scene/profile/MainTab/MainTab";
import AISTab from "./scene/profile/AISTab/AISTab";
import LibraryTab from "./scene/profile/LibraryTab/LibraryTab";
import UniteLandingPage from "./scene/signIn/UniteLandingPage/UniteLandingPage";
import LPCurios from "./scene/signIn/UniteLandingPage/LPCurios";
import LPThinkTank from "./scene/signIn/UniteLandingPage/LPThinkTank";
import LPAis from "./scene/signIn/UniteLandingPage/LPAis";
import UniteLandingPageHeader from "./scene/signIn/UniteLandingPage/UniteLandingPageHeader";
import LibraryView from "./scene/library/LibraryView";
import {LibraryViewModel} from "./scene/library/LibraryViewModel";
import CommentTimeline from "./scene/library/Parts/common/CommentTimeline";
import ClipPostTileList from "./scene/library/Parts/clips/ClipPostTileList";
import ContentDetail from "./scene/library/Parts/common/ContentDetail";

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
                        {/*Before Login Content*/}
                        <Route path='/register' element={<RegisterView />} />

                        <Route path='/lp' element={<UniteLandingPageHeader/>}>
                            <Route index element={<UniteLandingPage/>}/>
                            <Route path='/lp/curios' element={<LPCurios/>}/>
                            <Route path='/lp/think-tank' element={<LPThinkTank/>}/>
                            <Route path='/lp/ais' element={<LPAis/>}/>
                        </Route>

                        <Route path='/signin' element={<SignIn />} />
                        {/*Card*/}
                        <Route path='/card/:cardSerial' element={<TuneCardView />} />
                        {/*After Login Content*/}
                        <Route path='/' element={<Layout />} >
                            <Route index element={<HomeView />} ></Route>
                            <Route path='/home' element={<HomeView />} />
                            {/*Preference*/}
                            <Route path='/preference' element={<PreferenceView />} />
                            {/*ThinkTank*/}
                            <Route path="think-tank" element={<ThinkTankView viewModel={ThinkTankViewModel.appInit()}/>}>
                                <Route index element={<ThinkTimeline />} />
                                <Route path=":thinkId" element={<ThinkDetail />} />
                            </Route>
                            {/*Profile*/}
                            <Route path='/user/:uid' element={<Profile/>}>
                                <Route index element={<MainTab/>}/>
                                <Route path='/user/:uid/ais' element={<AISTab/>}/>
                                <Route path='/user/:uid/think-tank' element={<MyThinkTank/>}>
                                    <Route index element={<ThinkTimeline/>}/>
                                </Route>
                                <Route path='/user/:uid/library' element={<LibraryTab/>}/>
                                <Route path='/user/:uid/portfolio' element={<Portfolio />} />
                            </Route>
                            {/*AIS*/}
                            <Route path='/ais/:uid' element={<AISecretary />} />
                            {/*Library*/}
                            <Route path="library" element={<LibraryView viewModel={LibraryViewModel.appInit()}/>}>
                                <Route index element={<CommentTimeline />} />
                                <Route path="d-blog-list" element={<BlogPostTileList />} />
                                <Route path="clip-list" element={<ClipPostTileList />} />
                                <Route path=":thinkId" element={<ContentDetail />} />
                            </Route>
                            {/*quest*/}
                            <Route path='/quests' element={<QuestListView />} />
                            <Route path='/quests/:questId' element={<QuestView />} />
                            <Route path='/quests/:questId/edit' element={<QuestView />} />
                        </Route>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </RecoilRoot>
    );
}

export default App;
