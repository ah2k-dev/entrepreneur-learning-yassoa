import { coursesConstants } from "../constants/coursesConstants";
import {
    successMessage,
    errorMessage,
    warningMessage,
} from "../../services/helpers";
import custAxios, { attachToken } from "../../configs/axios.configs";


export const getCourses = (step = null) => async (dispatch) => {
    dispatch({
        type: coursesConstants.COURSE_LIST_REQUEST,
    });
    try {
        attachToken()
        if (!step) {
            let getLocalStorageStep = localStorage.getItem('courseStep') || null
            step = getLocalStorageStep ? getLocalStorageStep : 'step1'
        }
        const res = await custAxios.get(`/course/all?step=${step}`);
        if (res?.data?.success === true) {
            let data = res?.data.data;
            await dispatch({
                type: coursesConstants.COURSE_LIST_SUCCESS,
                payload: data,
            });


        } else {
            warningMessage("Course not found");

        }

        return res?.data
    } catch (error) {
        console.log(error);
        dispatch({
            type: coursesConstants.COURSE_LIST_FAILURE,
            payload: error?.response?.data?.message || "Server Error",
        });
        errorMessage(error?.response?.data?.message);
    }
}


export const getSingleCourse = (id) => async (dispatch) => {
    dispatch({
        type: coursesConstants.SINGLE_COURSE_REQUEST,
    });
    try {
        attachToken()
        const res = await custAxios.get("/course/single/" + id);
        if (res?.data?.success === true) {
            let data = res?.data.data;
            await dispatch({
                type: coursesConstants.SINGLE_COURSE_SUCCESS,
                payload: data,
            });


        } else {
            warningMessage("Course not found");

        }

        return res?.data
    } catch (error) {
        console.log(error);
        dispatch({
            type: coursesConstants.SINGLE_COURSE_FAILURE,
            payload: error?.response?.data?.message || "Server Error",
        });
        errorMessage(error?.response?.data?.message);
    }
}


export const AddCourse = (values) => async (dispatch) => {
    dispatch({
        type: coursesConstants.ADD_EDIT_COURSE_REQUEST,
    });
    try {
        attachToken()
        const res = await custAxios.post("/course/add", values);
        if (res?.data?.success === true) {
            let data = res?.data.data;
            await dispatch({
                type: coursesConstants.ADD_EDIT_COURSE_SUCCESS,
                payload: data,
            });


        } else {
            warningMessage("Course not found");

        }

        return res?.data
    } catch (error) {
        console.log(error);
        dispatch({
            type: coursesConstants.ADD_EDIT_COURSE_FAILURE,
            payload: error?.response?.data?.message || "Server Error",
        });
        errorMessage(error?.response?.data?.message);
    }
}
export const EditCourse = ({ values, id }) => async (dispatch) => {
    dispatch({
        type: coursesConstants.ADD_EDIT_COURSE_REQUEST,
    });
    try {
        attachToken()
        const res = await custAxios.put("/course/update/" + id, values);
        if (res?.data?.success === true) {
            let data = res?.data.data;
            await dispatch({
                type: coursesConstants.ADD_EDIT_COURSE_SUCCESS,
                payload: data,
            });


        } else {
            warningMessage("Course not found");

        }

        return res?.data
    } catch (error) {
        console.log(error);
        dispatch({
            type: coursesConstants.ADD_EDIT_COURSE_FAILURE,
            payload: error?.response?.data?.message || "Server Error",
        });
        errorMessage(error?.response?.data?.message);
    }
}


export const DeleteCourse = (id) => async (dispatch) => {
    dispatch({
        type: coursesConstants.DELETE_COURSE_REQUEST,
    });
    try {
        attachToken()
        const res = await custAxios.delete("/course/delete/" + id);
        if (res?.data?.success === true) {
            let data = res?.data.data;
            await dispatch({
                type: coursesConstants.DELETE_COURSE_SUCCESS,
                payload: id,
            });

            return data
        } else {
            warningMessage("Course not found");

        }

        return res?.data
    } catch (error) {
        console.log(error);
        dispatch({
            type: coursesConstants.DELETE_COURSE_FAILURE,
            payload: error?.response?.data?.message || "Server Error",
        });
        errorMessage(error?.response?.data?.message);
    }
}


