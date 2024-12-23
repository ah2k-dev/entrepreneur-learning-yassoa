
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getUserData, useAuth } from "../services/hooks";
import { useDispatch } from "react-redux";
import { getMee } from "../redux/actions/authActions";
const AuthRoute = ({ Component }) => {
    const isAuthenticated = useAuth();
    const user = getUserData();
    // const dispatch = useDispatch()
    // useEffect(() => {
    //     dispatch(getMee())
    // }, [dispatch])

    if (isAuthenticated) {

        return <Navigate to="/dashboard" />;

    } else {
        return <Component />;
    }
};
export default AuthRoute;