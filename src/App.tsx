import React from 'react';
import {AuthProvider} from "./auth/AuthProvider";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import FrontendRoutes from "./types/FrontendRoutes";
import PrivateRoute from "./auth/PrivateRoute";
import Login from "./auth/Login";
import NotFound from "./NotFound";
import Home from "./home-page/Home";
import {RfsProvider} from "./home-page/RfsProvider";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <RfsProvider>
                    <Routes>
                        <Route path={FrontendRoutes.HOME_PAGE} element={<PrivateRoute children={<Home/>}/>}/>
                        <Route path={FrontendRoutes.LOGIN} element={<Login/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </RfsProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
