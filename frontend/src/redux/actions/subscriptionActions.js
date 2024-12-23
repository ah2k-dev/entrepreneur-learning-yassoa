import { subscriptionConstants } from "../constants/subscriptionConstants";
import {
    successMessage,
    errorMessage,
    warningMessage,
} from "../../services/helpers";
import custAxios, { attachToken, attachTokenWithFormAxios, formAxios } from "../../configs/axios.configs";


export const getPlans = () => async (dispatch) => {
    dispatch({
        type: subscriptionConstants.GET_PLANS_REQUEST,
    });
    try {
        attachToken()
        const res = await custAxios.get("/subscription/plans");
        if (res?.data?.success === true) {
            let data = res?.data?.data?.data;
            await dispatch({
                type: subscriptionConstants.GET_PLANS_SUCCESS,
                payload: data.reverse(),
            });


        } else {
            warningMessage("Business not found");

        }

        return res?.data
    } catch (error) {
        console.log(error);
        dispatch({
            type: subscriptionConstants.GET_PLANS_FAILURE,
            payload: error?.response?.data?.message || "Server Error",
        });
        errorMessage(error?.response?.data?.message);
    }
}


export const addPaymentMethod = (value) => async (dispatch) => {
    dispatch({
        type: subscriptionConstants.ADD_PAYMENT_METHOD_REQUEST,
    });
    try {
        attachToken()
        const res = await custAxios.post("/subscription/addPaymentMethod", value);
        if (res?.data?.success === true) {
            let data = res?.data.data?.data;
            console.log('addPaymentMethod data ', data);
            await dispatch({
                type: subscriptionConstants.ADD_PAYMENT_METHOD_SUCCESS,
                payload: data,
            });


        } else {
            warningMessage("Faild to add payment method");
        }

        return res?.data
    } catch (error) {
        console.log(error);
        dispatch({
            type: subscriptionConstants.ADD_PAYMENT_METHOD_FAILURE,
            payload: error?.response?.data?.message || "Server Error",
        });
        errorMessage(error?.response?.data?.message);
    }
}

export const getPaymentMethods = () => async (dispatch) => {
    dispatch({
        type: subscriptionConstants.GET_PAYMENT_METHODS_REQUEST,
    });
    try {
        attachToken();
        const res = await custAxios.get("/subscription/getPaymentMethods");
        if (res?.data?.success === true) {
            let data = res?.data.data?.data;
            console.log('getPaymentMethods data ', data);
            await dispatch({
                type: subscriptionConstants.GET_PAYMENT_METHODS_SUCCESS,
                payload: data,
            });
        } else {
            warningMessage("Faild to get payment method");
        }

        return res?.data
    } catch (error) {
        console.log(error);
        dispatch({
            type: subscriptionConstants.GET_PAYMENT_METHODS_FAILURE,
            payload: error?.response?.data?.message || "Server Error",
        });
        errorMessage(error?.response?.data?.message);
    }
}


export const getMySubscription = () => async (dispatch) => {
    dispatch({
        type: subscriptionConstants.GET_MY_SUBSCRIPTION_REQUEST,
    });
    try {
        attachToken();
        const res = await custAxios.get("/subscription/getSubscriptions");
        if (res?.data?.success === true) {
            let data = res?.data.data;
            console.log('getSubscriptions data ', data);
            await dispatch({
                type: subscriptionConstants.GET_MY_SUBSCRIPTION_SUCCESS,
                payload: data,
            });
        } else {
            warningMessage("Faild to get payment method");
        }

        return res?.data
    } catch (error) {
        console.log(error);
        dispatch({
            type: subscriptionConstants.GET_MY_SUBSCRIPTION_FAILURE,
            payload: error?.response?.data?.message || "Server Error",
        });
        errorMessage(error?.response?.data?.message);
    }
}


export const cancelSubscription = () => async (dispatch) => {
    dispatch({
        type: subscriptionConstants.CANCEL_SUBSCRIPTION_REQUEST,
    });
    try {
        attachToken();
        const res = await custAxios.delete("/subscription/unsubscribe");
        if (res?.data?.success === true) {
            let data = res?.data.data;
            console.log('unsubscribe data ', data);
            await dispatch({
                type: subscriptionConstants.CANCEL_SUBSCRIPTION_SUCCESS,
                payload: data,
            });
        } else {
            warningMessage("Faild to get payment method");
        }

        return res?.data
    } catch (error) {
        console.log(error);
        dispatch({
            type: subscriptionConstants.CANCEL_SUBSCRIPTION_FAILURE,
            payload: error?.response?.data?.message || "Server Error",
        });
        errorMessage(error?.response?.data?.message);
    }
}

export const removePaymentMethod = (paymentMethodId) => async (dispatch) => {
    dispatch({
        type: subscriptionConstants.REMOVE_PAYMENT_METHOD_REQUEST,
    });
    try {
        attachToken();
        const res = await custAxios.post("/subscription/deletePaymentMethod", { paymentMethodId: paymentMethodId });
        if (res?.data?.success === true) {
            let data = res?.data.data;
            await dispatch({
                type: subscriptionConstants.REMOVE_PAYMENT_METHOD_SUCCESS,
                payload: paymentMethodId,
            });

        } else {
            warningMessage("Faild to get payment method");
        }

        return res?.data
    } catch (error) {
        console.log(error);
        dispatch({
            type: subscriptionConstants.REMOVE_PAYMENT_METHOD_FAILURE,
            payload: error?.response?.data?.message || "Server Error",
        });
        errorMessage(error?.response?.data?.message);
    }
}

export const createSubscription = (value) => async (dispatch) => {
    dispatch({
        type: subscriptionConstants.CREATE_SUBSCRIPTION_REQUEST,
    });
    try {
        attachToken();
        const res = await custAxios.post("/subscription/subscribe", value);
        if (res?.data?.success === true) {
            let data = res?.data.data;
            console.log('createSubscription data ', data);
            await dispatch({
                type: subscriptionConstants.CREATE_SUBSCRIPTION_SUCCESS,
                payload: data,
            });
        } else {
            warningMessage("Faild to get payment method");
        }

        return res?.data
    } catch (error) {
        console.log(error);
        dispatch({
            type: subscriptionConstants.CREATE_SUBSCRIPTION_FAILURE,
            payload: error?.response?.data?.message || "Server Error",
        });
        errorMessage(error?.response?.data?.message);
    }
}



