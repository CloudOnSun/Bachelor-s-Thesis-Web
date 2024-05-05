import {ReactNode, useContext} from "react";
import {AuthContext, AuthState} from "./AuthProvider";
import {Navigate, Outlet, Route, useNavigate} from "react-router-dom";
import FrontendRoutes from "../types/FrontendRoutes";

interface PrivateRouteProps {
    children: any;
}

const PrivateRoute = ({children} : PrivateRouteProps) => {
    const {isAuthenticated} = useContext<AuthState>(AuthContext);
    console.log(children)
    if (!isAuthenticated) {
        return <Navigate to={FrontendRoutes.LOGIN} />;
    }

    return children
};

export default PrivateRoute;