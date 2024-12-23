import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, getUserData } from "../services/hooks";
import { useDispatch } from "react-redux";
import { getMee } from "../redux/actions/authActions";

const ProtectedRoute = ({ Component }) => {
    const isAuthenticated = useAuth();
    const user = getUserData();
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getMee())
    }, [dispatch])

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    } else {
        return <Component />;

    }
};

export default ProtectedRoute;