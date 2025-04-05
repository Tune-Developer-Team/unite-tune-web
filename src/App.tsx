import React, {useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import './App.css';

import SignIn from "./Pages/signIn/SignInView";
import {createTheme, ThemeProvider} from "@mui/material";
import {RecoilRoot} from "recoil";
import Profile from "./Pages/profile/ProfileView";
import Portfolio from "./Pages/portfolio";
import HomeView from "./Pages/home/HomeView";
import RegisterTuneCardView from "./Pages/registration/RegisterTuneCardView";
import PreferenceView from "./Pages/preference/PreferenceView";
import RegisterView from "./Pages/register/registerView";
import BlogPostTileList from "./Pages/library/Parts/dBlog/BlogPostTileList";
import AISecretary from "./Pages/crappy/AISecretary";
import NotFound from "./Pages/notFound/NotFound";
import Layout from "./ui/layout/Layout";
import ThinkTankView from "./Pages/thinkTank/ThinkTankView";
import QuestListView from "./Pages/questList/QuestListView";
import {ThinkTankViewModel} from "./Pages/thinkTank/ThinkTankViewModel";
import ThinkTimeline from "./Pages/thinkTank/Parts/ThinkTimeline";
import ThinkDetail from "./Pages/thinkTank/Parts/ThinkDetail";
import MyThinkTank from "./Pages/profile/ThinkTankTab/MyThinkTank";
import BioTab from "./Pages/profile/BioTab/BioTab";
import AISTab from "./Pages/profile/AISTab/AISTab";
import LibraryTab from "./Pages/profile/LibraryTab/LibraryTab";
import UniteLandingPage from "./Pages/signIn/UniteLandingPage/UniteLandingPage";
import LPCurios from "./Pages/signIn/UniteLandingPage/LPCurios";
import LPThinkTank from "./Pages/signIn/UniteLandingPage/LPThinkTank";
import LPAis from "./Pages/signIn/UniteLandingPage/LPAis";
import UniteLandingPageHeader from "./Pages/signIn/UniteLandingPage/UniteLandingPageHeader";
import LibraryView from "./Pages/library/LibraryView";
import {LibraryViewModel} from "./Pages/library/LibraryViewModel";
import ClipPostTileList from "./Pages/library/Parts/clips/List/ClipPostTileList";
import TuneCardTileList from "./Pages/library/Parts/tuneCards/List/TuneCardTileList";
import ClipPostDetail from "./Pages/library/Parts/clips/Detail/ClipPostDetail";
import SelfBrandingView from "./Pages/library/Parts/tuneCards/Detail/SelfBrandingView";
import UnderConstruction from "./Pages/notFound/UnderConstruction";

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
                        {/*SignUp*/}
                        <Route path='/register-card/:cardSerial' element={<RegisterTuneCardView />} />
                        {/*After Login Content*/}
                        <Route path='/' element={<Layout />} >
                            <Route index element={<HomeView />} ></Route>
                            {/*home*/}
                            <Route path="library" element={<LibraryView viewModel={LibraryViewModel.appInit()}/>}>
                                <Route index element={<HomeView />} />
                                <Route path="d-blog-list" element={<BlogPostTileList />} />
                                <Route path="clip-list" element={<ClipPostTileList />} />
                                {/*<Route path='quest-list' element={<QuestListView />} />*/}
                                <Route path='document-list' element={<UnderConstruction />} />
                                <Route path='book-list' element={<UnderConstruction />} />
                                <Route path='card-list' element={<TuneCardTileList />} />
                                <Route path='card-list/:uid' element={<SelfBrandingView/>}/>
                                <Route path=':uniteContentId' element={<ClipPostDetail/>}/>
                            </Route>
                            {/*Preference*/}
                            <Route path='/preference' element={<PreferenceView />} />
                            {/*ThinkTank*/}
                            <Route path="think-tank" element={<ThinkTankView viewModel={ThinkTankViewModel.appInit()}/>}>
                                <Route index element={<ThinkTimeline />} />
                                <Route path=":thinkId" element={<ThinkDetail />} />
                            </Route>
                            {/*Profile*/}
                            <Route path='/user/:uid' element={<Profile/>}>
                                <Route index element={<BioTab/>}/>
                                <Route path='/user/:uid/ais' element={<AISTab/>}/>
                                <Route path='/user/:uid/think-tank' element={<MyThinkTank/>}>
                                    <Route index element={<ThinkTimeline/>}/>
                                </Route>
                                <Route path='/user/:uid/library' element={<LibraryTab/>}/>
                                <Route path='/user/:uid/portfolio' element={<Portfolio />} />
                            </Route>
                            {/*AIS*/}
                            <Route path='/ais/:uid' element={<AISecretary/>}>
                                {/*<Route index element={<BioTab/>}/>*/}
                                <Route index element={<AISecretary />}/>
                                <Route path='kintai' element={<AISecretary />}/>
                                <Route path='zatsudan' element={<AISecretary />}/>
                            </Route>
                        </Route>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </RecoilRoot>
    );
}

export default App;
