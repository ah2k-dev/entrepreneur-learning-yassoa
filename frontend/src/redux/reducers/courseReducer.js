import { coursesConstants } from "../constants/coursesConstants";
export const courseReducer = (
    state = {
        courseDetail: null,
        courseDetailLoading: false,
        coursesList: [],
        coursesListLoading: false,
        courseAddLoading: false,
        deleteCourseLoading: false,
    },
    action
) => {
    switch (action.type) {
        // Course list 
        case coursesConstants.COURSE_LIST_REQUEST:
            return {
                ...state,
                coursesListLoading: true,
            };
        case coursesConstants.COURSE_LIST_SUCCESS:
            return {
                ...state,
                coursesList: action.payload,
                coursesListLoading: false,
            };
        case coursesConstants.COURSE_LIST_FAILURE:
            return {
                ...state,
                coursesListLoading: false,
            };

        // Course detail 
        case coursesConstants.SINGLE_COURSE_REQUEST:
            return {
                ...state,
                courseDetailLoading: true,
            };
        case coursesConstants.SINGLE_COURSE_SUCCESS:
            return {
                ...state,
                courseDetail: action.payload,
                courseDetailLoading: false,
            };
        case coursesConstants.SINGLE_COURSE_FAILURE:
            return {
                ...state,
                courseDetailLoading: false,
            };

        // Course add edit

        case coursesConstants.ADD_EDIT_COURSE_REQUEST:
            return {
                ...state,
                courseAddLoading: true,
            };

        case coursesConstants.ADD_EDIT_COURSE_SUCCESS:
            return {
                ...state,
                courseAddLoading: false,
                coursesList: [action.payload, ...state.coursesList],
                courseDetail: action.payload,
            };

        case coursesConstants.ADD_EDIT_COURSE_FAILURE:
            return {
                ...state,
                courseAddLoading: false,
            };



        //Course delete
        case coursesConstants.DELETE_COURSE_REQUEST:
            return {
                ...state,
                deleteCourseLoading: true,
            };
        case coursesConstants.DELETE_COURSE_SUCCESS:
            const { coursesList } = state
            const id = action.payload;
            let newcoursesList = coursesList.filter((item) => item._id !== id);
            return {
                ...state,
                coursesList: newcoursesList,
                deleteCourseLoading: false,
            };
        case coursesConstants.DELETE_COURSE_FAILURE:
            return {
                ...state,
                deleteCourseLoading: false,
            };

        default: // ? defaaaalt case yk...!
            return state;
    }
};
