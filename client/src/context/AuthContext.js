import { createContext, useReducer, useEffect } from "react";
import AuthReducer from "./AuthReducer";


const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    error: false,
    isFetching: false
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.user))
    }, [state.user])

    return (
        <AuthContext.Provider value={{
            user: state.user,
            error: state.error,
            isFetching: state.isFetching,
            dispatch
        }}
        >
            {children}
        </AuthContext.Provider>
    )
}