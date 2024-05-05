import PropTypes from "prop-types";
import React, {useCallback, useEffect, useState} from "react";
import { Preferences } from '@capacitor/preferences';
import {loginApi} from "./auth-api";
import {User} from "../types/User";
import {getLogger} from "../core";

type LoginFn = (email?: string, password?: string) => void;
type LogOutFn = () => void;

const log = getLogger("AuthProvider")
export interface AuthState {
    authenticationError: Error | null;
    isAuthenticated: boolean;
    isAuthenticating: boolean;
    login?: LoginFn;
    logout?: LogOutFn;
    pendingAuthentication?: boolean;
    email?: string;
    password?: string;
    authenticationToken: string;
    user?: User;
}

const initialState: AuthState = {
    isAuthenticated: false,
    isAuthenticating: false,
    authenticationError: null,
    pendingAuthentication: false,
    authenticationToken: '',
};

export const AuthContext = React.createContext<AuthState>(initialState);

interface AuthProviderProps {
    children: PropTypes.ReactNodeLike,
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children}) => {
    const [state, setState] = useState<AuthState>(initialState);
    const { isAuthenticated,
            isAuthenticating,
            authenticationError,
            pendingAuthentication,
            authenticationToken,
            user,
            } = state;
    const login = useCallback<LoginFn>(loginCallback, []);
    const logout = useCallback<LogOutFn>(async () => {
        await Preferences.remove({ key: 'authtoken' });
        await Preferences.remove({ key: 'user'});
        setState(initialState);
    }, []);
    useEffect(authenticationEffect, [pendingAuthentication]);
    const value = {
        isAuthenticated,
        login,
        isAuthenticating,
        authenticationError,
        authenticationToken,
        logout,
        user,
        };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

    function loginCallback(email?: string, password?: string): void {
        setState({
            ...state,
            pendingAuthentication: true,
            email,
            password
        });
    }

    function authenticationEffect() {
        let canceled = false;
        authenticate();
        return () => {
            canceled = true;
        }

        async function authenticate() {
            if (!pendingAuthentication) {
                return;
            }
            try {
                setState({
                    ...state,
                    isAuthenticating: true,
                });
                const authTokenRes = await Preferences.get({ key: 'authtoken' });
                const userRes = await Preferences.get({key: "user"});
                console.log(authTokenRes);
                if (authTokenRes.value &&  userRes.value) {
                    setState({
                        ...state,
                        authenticationToken: authTokenRes.value,
                        pendingAuthentication: false,
                        isAuthenticated: true,
                        isAuthenticating: false,
                        user: JSON.parse(userRes.value),
                    });
                } else {
                    const { email, password } = state;
                    if (!email || !password) {
                        setState(initialState)
                        return;
                    }
                    const { data } = await loginApi(email, password);
                    console.log(data.accessToken + "    " + data.user.id);
                    if (canceled) {
                        return;
                    }
                    setState({
                        ...state,
                        authenticationToken: data.accessToken,
                        pendingAuthentication: false,
                        isAuthenticated: true,
                        isAuthenticating: false,
                        user: data.user,
                    });
                    await Preferences.set({
                        key: 'authtoken',
                        value: data.accessToken
                    });
                    await Preferences.set({
                        key: 'user',
                        value: JSON.stringify(data.user)
                    })
                }
            } catch (error: any) {
                log("canceled")
                if (canceled) {
                    return;
                }
                setState({
                    ...state,
                    authenticationError: new Error(error.message),
                    pendingAuthentication: false,
                    isAuthenticating: false,
                });
                await Preferences.remove({ key: 'authtoken' });
                await Preferences.remove({ key: 'user'});
            }
        }
    }
}