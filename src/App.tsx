import React, {useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import './App.css';

import SignIn from "./scene/signIn/SignInView";
import {GoogleOAuthProvider} from "@react-oauth/google";
import DrawerView from "./ui/layout/DrawerView";
import {createTheme, ThemeProvider} from "@mui/material";
import {RecoilRoot} from "recoil";
import Profile from "./scene/profile/ProfileView";
import Portfolio from "./scene/portfolio";
import SeedEditView from "./scene/seedEdit/SeedEditView";
import HomeView from "./scene/home/HomeView";
import TuneCardView from "./scene/tuneCard/tuneCardView";
import PreferenceView from "./scene/preference/PreferenceView";
import RegisterView from "./scene/register/registerView";
import SeedDetailView from "./scene/seedDetail/seedDetailView";
import BlogPostTileList from "./ui/blogPost/BlogPostTileList";
import AISecretary from "./scene/AISecretary";
import SeedListView from "./scene/seedList/SeedListView";

function App() {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;

    const [darkMode,] = useState(true);
    const theme = createTheme({
        palette: {
            // mode: darkMode ? 'dark' : 'light',
            mode: 'dark',
            primary: {
                main: '#1857df', // プライマリー色
            },
            secondary: {
                main: '#cecece', // セカンダリー色を設定
            },
        },
        breakpoints: {
            values: {
                xs: 320,  // ミニ
                sm: 480, // モバイル
                md: 768, // タブレット
                lg: 1285, // 基準
                xl: 1536, // ワイドモニター
            },
        },
    });

  return (
      <RecoilRoot>
          <ThemeProvider theme={theme}>
              <GoogleOAuthProvider clientId={clientId}>
                  <BrowserRouter>
                      <DrawerView/>
                      <Routes>
                          <Route path={'/'} element={<HomeView/>}/>
                      </Routes>
                      <Routes>
                          <Route path={'/register'} element={<RegisterView/>}/>
                      </Routes>
                      <Routes>
                          <Route path={'/signin'} element={<SignIn/>}/>
                      </Routes>
                      <Routes>
                          <Route path={'/preference'} element={<PreferenceView/>}/>
                      </Routes>
                      <Routes>
                          <Route path={'/home'} element={<HomeView/>}/>
                      </Routes>
                      <Routes>
                          <Route path={'seed/:seedId/edit'} element={<SeedEditView/>}/>
                      </Routes>
                      <Routes>
                          <Route path={'seed/:seedId'} element={<SeedDetailView/>}/>
                      </Routes>
                      <Routes>
                          <Route path={'/user/:uid'} element={<Profile/>}/>
                      </Routes>
                      <Routes>
                          <Route path={'/user/:uid/ais'} element={<AISecretary/>}/>
                      </Routes>
                      <Routes>
                          <Route path={'/user/:uid/portfolio'} element={<Portfolio/>}/>
                      </Routes>
                      <Routes>
                          <Route path={'/card/:cardSerial'} element={<TuneCardView/>}/>
                      </Routes>
                      <Routes>
                          <Route path="/seeds" element={<SeedListView />} />
                      </Routes>
                      <Routes>
                          <Route path="/blogposts" element={<BlogPostTileList />} />
                      </Routes>
                  </BrowserRouter>
              </GoogleOAuthProvider>
          </ThemeProvider>
      </RecoilRoot>
  );
}

export default App;
