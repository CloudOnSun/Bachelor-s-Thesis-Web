import React, {useContext, useEffect, useReducer} from "react";
import PropTypes from 'prop-types';
import {AuthContext} from "../auth/AuthProvider";
import {RfsWithDamages} from "../types/RfsWithDamages";
import {getAllRfs} from "./home-page-api";

export interface RfsState {
    allRfs?: RfsWithDamages[],
    fetching: boolean,
    fetchingError?: Error | null,
}

interface ActionProps {
    type: string,
    payload?: any,
}

const initialState: RfsState = {
    fetching: false,
};

const FETCH_RFS_STARTED = "FETCH_RFS_STARTED";
const FETCH_RFS_SUCCEEDED = "FETCH_RFS_SUCCEEDED";
const FETCH_RFS_FAILED = "FETCH_RFS_FAILED"

const reducer: (state: RfsState, action: ActionProps) => RfsState =
    (state, { type, payload}) => {
        switch(type) {
            case FETCH_RFS_STARTED:
                return { ...state, fetching: true, fetchingError: null };
            case FETCH_RFS_SUCCEEDED:
                return { ...state, allRfs: payload.allRfs, fetching: false };
            case FETCH_RFS_FAILED:
                return { ...state, fetchingError: payload.error, fetching: false};
            default:
                return state;
        }
    };

export const RfsContext = React.createContext<RfsState>(initialState);

interface RfsProviderProps {
    children: PropTypes.ReactNodeLike,
}

export const RfsProvider: React.FC<RfsProviderProps> = ({children} : RfsProviderProps) => {
    const {authenticationToken, user} = useContext(AuthContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    const { allRfs, fetching, fetchingError } = state;

    useEffect(getRfsEffect, [authenticationToken])

    const value = { allRfs, fetching, fetchingError }
    return (
        <RfsContext.Provider value={value}>
            {children}
        </RfsContext.Provider>
    )

    function getRfsEffect() {
        let canceled = false;
        console.log("AA")
        if (authenticationToken) {
            fetchRfs();
        }
        return () => {
            canceled = true;
        }

        async function fetchRfs() {
            try {
                dispatch({type: FETCH_RFS_STARTED})
                let rfsPayload = await getAllRfs(authenticationToken);
                console.log(rfsPayload.data)
                if (!canceled) {
                    dispatch({type: FETCH_RFS_SUCCEEDED, payload: {allRfs: rfsPayload.data}})
                }
            }
            catch (error) {
                if (!canceled) {
                    dispatch({type: FETCH_RFS_FAILED, payload: {error}})
                }
            }
        }
    }
}