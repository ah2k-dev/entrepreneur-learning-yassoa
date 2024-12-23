import { businessConstants } from "../constants/businessConstants";
import {
    successMessage,
    errorMessage,
    warningMessage,
} from "../../services/helpers";
import custAxios, { attachToken } from "../../configs/axios.configs";


export const getBusiness = (values) => async (dispatch) => {
    dispatch({
        type: businessConstants.BUSINESS_LIST_REQUEST,
    });
    try {
        attachToken()
        let formdata = {};
        if (values?.search) {
            formdata.search = values.search
        }
        if (values?.type) {
            formdata.type = values.type
        }

        if (values?.niche) {
            formdata.niche = values.niche
        }
        if (values?.pays) {
            formdata.pays = values.pays
        }
        if (values?.tarif) {
            formdata.tarif = values.tarif
        }
        const res = await custAxios.post("/businessIdea/all", formdata);
        if (res?.data?.success === true) {
            let data = res?.data.data;
            await dispatch({
                type: businessConstants.BUSINESS_LIST_SUCCESS,
                payload: data,
            });


        } else {
            warningMessage("Business not found");

        }

        return res?.data
    } catch (error) {
        console.log(error);
        dispatch({
            type: businessConstants.BUSINESS_LIST_FAILURE,
            payload: error?.response?.data?.message || "Server Error",
        });
        errorMessage(error?.response?.data?.message);
    }
}

export const downloadBusinessDoc = (item) => async (dispatch) => {
    dispatch({
        type: businessConstants.DOWNLOAD_DOC_BUSINESS_REQUEST,
    });
    try {
        attachToken()
        const res = await custAxios.get("/businessIdea/generate-download-token/" + item._id);
        if (res?.data?.success) {
            await dispatch({
                type: businessConstants.DOWNLOAD_DOC_BUSINESS_SUCCESS,
            });

        }
        return res?.data;

    } catch (error) {
        console.log(error);
        dispatch({
            type: businessConstants.DOWNLOAD_DOC_BUSINESS_FAILURE,
            payload: error?.response?.data?.message || "Quelque chose ne va pas lors du téléchargement",
        });
        errorMessage(error?.response?.data?.message || 'Quelque chose ne va pas lors du téléchargement');
    }
}


export const getSingleBusiness = (id) => async (dispatch) => {
    dispatch({
        type: businessConstants.SINGLE_BUSINESS_REQUEST,
    });
    try {
        attachToken()
        const res = await custAxios.get("/businessIdea/single/" + id);
        if (res?.data?.success === true) {
            let data = res?.data.data;
            await dispatch({
                type: businessConstants.SINGLE_BUSINESS_SUCCESS,
                payload: data,
            });


        } else {
            warningMessage("Business not found");

        }

        return res?.data
    } catch (error) {
        console.log(error);
        dispatch({
            type: businessConstants.SINGLE_BUSINESS_FAILURE,
            payload: error?.response?.data?.message || "Server Error",
        });
        errorMessage(error?.response?.data?.message);
    }
}


export const AddEditBusiness = (values) => async (dispatch) => {
    dispatch({
        type: businessConstants.ADD_EDIT_BUSINESS_REQUEST,
    });
    try {
        attachToken()
        const res = await custAxios.post("/businessIdea/addOrUpdate", values);
        if (res?.data?.success === true) {
            let data = res?.data.data;
            await dispatch({
                type: businessConstants.ADD_EDIT_BUSINESS_SUCCESS,
                payload: data,
            });


        } else {
            warningMessage("Business not found");

        }

        return res?.data
    } catch (error) {
        console.log(error);
        dispatch({
            type: businessConstants.ADD_EDIT_BUSINESS_FAILURE,
            payload: error?.response?.data?.message || "Server Error",
        });
        errorMessage(error?.response?.data?.message);
    }
}




export const publishPodcast = (id) => async (dispatch) => {
    dispatch({
        type: businessConstants.PUBLISHED_BUSINESS_REQUEST,
    });
    try {
        attachToken()
        const res = await custAxios.patch("/businessIdea/publish/" + id);
        if (res?.data?.success === true) {
            let data = res?.data.data;
            await dispatch({
                type: businessConstants.PUBLISHED_BUSINESS_SUCCESS,
                payload: data,
            });

            return data
        } else {
            warningMessage("Business not found");

        }

        return res?.data
    } catch (error) {
        console.log(error);
        dispatch({
            type: businessConstants.PUBLISHED_BUSINESS_FAILURE,
            payload: error?.response?.data?.message || "Server Error",
        });
        errorMessage(error?.response?.data?.message);
    }
}

export const DeleteBusiness = (id) => async (dispatch) => {
    dispatch({
        type: businessConstants.DELETE_BUSINESS_REQUEST,
    });
    try {
        attachToken()
        const res = await custAxios.delete("/businessIdea/delete/" + id);
        if (res?.data?.success === true) {
            let data = res?.data.data;
            await dispatch({
                type: businessConstants.DELETE_BUSINESS_SUCCESS,
                payload: id,
            });

            return data
        } else {
            warningMessage("Business not found");

        }

        return res?.data
    } catch (error) {
        console.log(error);
        dispatch({
            type: businessConstants.DELETE_BUSINESS_FAILURE,
            payload: error?.response?.data?.message || "Server Error",
        });
        errorMessage(error?.response?.data?.message);
    }
}


