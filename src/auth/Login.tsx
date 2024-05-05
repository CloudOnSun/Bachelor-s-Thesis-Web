import {useCallback, useContext, useEffect, useState} from "react";
import {AuthContext} from "./AuthProvider";
import {useLocation, useNavigate} from "react-router-dom";
import {Preferences} from "@capacitor/preferences";
import TextField from "@mui/material/TextField";
import FrontendRoutes from "../types/FrontendRoutes";

function Login() {
    const navigate = useNavigate()
    const {isAuthenticated, login, authenticationError} = useContext(AuthContext)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string>("");

    const validateEmail = useCallback((email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }, []);


    const validateForm = useCallback((event: any) => {
        event.preventDefault();
        if (!validateEmail(email)) {
            setError("Invalid email");
            return;
        }
        login?.(email, password);
    }, [email, password]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate(FrontendRoutes.HOME_PAGE)
        }
    }, [isAuthenticated]);

    useEffect(() => {
        // Check local storage for an authentication token.
        async function checkLocalStorage() {
            const res = await Preferences.get({key: 'authtoken'});
            if (res.value) {
                // If an authentication token is found, call login with the token.
                login?.(undefined, undefined); // You may pass null or undefined here to trigger the login.
            }
        }

        checkLocalStorage();
    }, [login]);


    useEffect(() => {
        setError(authenticationError ? authenticationError.message : "")
    }, [authenticationError]);

    return (

        <div className="background-container">
            <h1>Damage Assesment Application</h1>
            <div className="container">

                <div className="row">
                    <div className="col-12">
                        <form onSubmit={validateForm} className="loginForm">
                            <TextField
                                className="inputLogin"
                                type="text"
                                label="Email"
                                variant="outlined"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                fullWidth
                                margin="normal"
                                InputProps={{classes: {root: 'mui-input-root'}}}
                            />
                            <TextField
                                className="inputLogin"
                                type="password"
                                label="Password"
                                variant="outlined"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                fullWidth
                                margin="normal"
                                InputProps={{classes: {root: 'mui-input-root'}}}
                            />
                            <button className="butonLogin" type="submit">Login</button>
                            <span>{error}</span>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Login;