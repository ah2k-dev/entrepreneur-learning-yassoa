import { podcastsConstants } from "../constants/podcastsConstants";
import {
    successMessage,
    errorMessage,
    warningMessage,
} from "../../services/helpers";
import axios from "axios";
import custAxios, { attachToken } from "../../configs/axios.configs";


export const getPodcasts = (values) => async (dispatch) => {
    dispatch({
        type: podcastsConstants.PODCASTS_LIST_REQUEST,
    });
    try {
        attachToken()
        let formdata = {}
        let apiUrl = '/podcast/all';
        if (values?.search) {
            formdata.search = values.search
        }
        if (values?.type) {
            formdata.type = values.type
        }
        if (values?.periodicity) {
            formdata.periodicity = values.periodicity
        }
        if (values?.niche) {
            formdata.niche = values.niche
        }
        if (values?.revenueFrom) {
            formdata.revenueFrom = values.revenueFrom
            formdata.revenueTo = values.revenueTo
        }
        if (values?.au_departFrom) {
            formdata.au_departFrom = values.au_departFrom
            formdata.au_departTo = values.au_departTo
        }
        if (values?.employeesFrom) {
            formdata.employeesFrom = values.employeesFrom
            formdata.employeesTo = values.employeesTo
        }
        if (values?.sortBy) {
            formdata.sortBy = values.sortBy
        }
        if (values?.sortValue) {
            formdata.sortValue = values.sortValue
        }
        const res = await custAxios.post(apiUrl, formdata);
        if (res?.data?.success === true) {
            let data = res?.data.data;
            await dispatch({
                type: podcastsConstants.PODCASTS_LIST_SUCCESS,
                payload: data,
            });


        } else {
            warningMessage("podcasts not found");

        }

        return res?.data
    } catch (error) {
        console.log(error);
        dispatch({
            type: podcastsConstants.PODCASTS_LIST_FAILURE,
            payload: error?.response?.data?.message || "Server Error",
        });
        errorMessage(error?.response?.data?.message);
    }
}


export const getSinglePodcasts = (id) => async (dispatch) => {
    dispatch({
        type: podcastsConstants.SINGLE_PODCASTS_REQUEST,
    });
    try {
        attachToken()
        const res = await custAxios.get("/podcast/single/" + id);
        if (res?.data?.success === true) {
            let data = res?.data.data;
            await dispatch({
                type: podcastsConstants.SINGLE_PODCASTS_SUCCESS,
                payload: data,
            });


        } else {
            warningMessage("podcasts not found");

        }

        return res?.data
    } catch (error) {
        console.log(error);
        dispatch({
            type: podcastsConstants.SINGLE_PODCASTS_FAILURE,
            payload: error?.response?.data?.message || "Server Error",
        });
        errorMessage(error?.response?.data?.message);
    }
}



export const AddEditPodcasts = (values) => async (dispatch) => {
    dispatch({
        type: podcastsConstants.ADD_EDIT_PODCASTS_REQUEST,
    });
    try {
        attachToken()
        const res = await custAxios.post("/podcast/addOrUpdate", values);
        if (res?.data?.success === true) {
            let data = res?.data.data;
            await dispatch({
                type: podcastsConstants.ADD_EDIT_PODCASTS_SUCCESS,
                payload: data,
            });


        } else {
            warningMessage("podcasts not found");

        }

        return res?.data
    } catch (error) {
        console.log(error);
        dispatch({
            type: podcastsConstants.ADD_EDIT_PODCASTS_FAILURE,
            payload: error?.response?.data?.message || "Server Error",
        });
        errorMessage(error?.response?.data?.message);
    }
}




export const publishPodcast = (id) => async (dispatch) => {
    dispatch({
        type: podcastsConstants.PUBLISHED_PODCASTS_REQUEST,
    });
    try {
        attachToken()
        const res = await custAxios.patch("/podcast/publish/" + id);
        if (res?.data?.success === true) {
            let data = res?.data.data;
            await dispatch({
                type: podcastsConstants.PUBLISHED_PODCASTS_SUCCESS,
                payload: data,
            });

            return data
        } else {
            warningMessage("podcasts not found");

        }

        return res?.data
    } catch (error) {
        console.log(error);
        dispatch({
            type: podcastsConstants.PUBLISHED_PODCASTS_FAILURE,
            payload: error?.response?.data?.message || "Server Error",
        });
        errorMessage(error?.response?.data?.message);
    }
}

export const DeletePodcasts = (id) => async (dispatch) => {
    dispatch({
        type: podcastsConstants.DELETE_PODCASTS_REQUEST,
    });
    try {
        attachToken()
        const res = await custAxios.delete("/podcast/delete/" + id);
        if (res?.data?.success === true) {
            let data = res?.data.data;
            await dispatch({
                type: podcastsConstants.DELETE_PODCASTS_SUCCESS,
                payload: data,
            });

            return data
        } else {
            warningMessage("podcasts not found");

        }

        return res?.data
    } catch (error) {
        console.log(error);
        dispatch({
            type: podcastsConstants.DELETE_PODCASTS_FAILURE,
            payload: error?.response?.data?.message || "Server Error",
        });
        errorMessage(error?.response?.data?.message);
    }
}


