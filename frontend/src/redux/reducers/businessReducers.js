import { businessConstants } from "../constants/businessConstants";
export const businessReducer = (
    state = {
        businessDetail: null,
        businessDetailLoading: false,
        businessList: [],
        businessListLoading: false,
        businessAddLoading: false,
        publishedBusinessLoading: false,
        deleteBusinessLoading: false,
        downloadDocLoading: false
    },
    action
) => {
    switch (action.type) {
        // Business list 
        case businessConstants.BUSINESS_LIST_REQUEST:
            return {
                ...state,
                businessListLoading: true,
            };
        case businessConstants.BUSINESS_LIST_SUCCESS:
            return {
                ...state,
                businessList: action.payload,
                businessListLoading: false,
            };
        case businessConstants.BUSINESS_LIST_FAILURE:
            return {
                ...state,
                businessListLoading: false,
            };

        // Download Doc Business  
        case businessConstants.DOWNLOAD_DOC_BUSINESS_REQUEST:
            return {
                ...state,
                downloadDocLoading: true,
            };
        case businessConstants.DOWNLOAD_DOC_BUSINESS_SUCCESS:
            return {
                ...state, 
                downloadDocLoading: false,
            };
        case businessConstants.DOWNLOAD_DOC_BUSINESS_FAILURE:
            return {
                ...state,
                downloadDocLoading: false,
            };

        // Business detail 
        case businessConstants.SINGLE_BUSINESS_REQUEST:
            return {
                ...state,
                businessDetailLoading: true,
            };
        case businessConstants.SINGLE_BUSINESS_SUCCESS:
            return {
                ...state,
                businessDetail: action.payload,
                businessDetailLoading: false,
            };
        case businessConstants.SINGLE_BUSINESS_FAILURE:
            return {
                ...state,
                businessDetailLoading: false,
            };

        // Business add edit

        case businessConstants.ADD_EDIT_BUSINESS_REQUEST:
            return {
                ...state,
                businessAddLoading: true,
            };

        case businessConstants.ADD_EDIT_BUSINESS_SUCCESS:
            return {
                ...state,
                businessAddLoading: false,
                businessList: [action.payload, ...state.businessList],
                businessDetail: action.payload,
            };

        case businessConstants.ADD_EDIT_BUSINESS_FAILURE:
            return {
                ...state,
                businessAddLoading: false,
            };

        // Publish Podcast  

        case businessConstants.PUBLISHED_BUSINESS_REQUEST:
            return {
                ...state,
                publishedBusinessLoading: true,
            };

        case businessConstants.PUBLISHED_BUSINESS_SUCCESS:
            return {
                ...state,
                publishedBusinessLoading: false,
                businessList: [action.payload, ...state.businessList],
                businessDetail: action.payload,
            };

        case businessConstants.PUBLISHED_BUSINESS_FAILURE:
            return {
                ...state,
                publishedBusinessLoading: false,
            };

        //Business Idea delete
        case businessConstants.DELETE_BUSINESS_REQUEST:
            return {
                ...state,
                deleteBusinessLoading: true,
            };
        case businessConstants.DELETE_BUSINESS_SUCCESS:
            const { businessList } = state
            const id = action.payload;
            let newBusinessList = businessList.filter((item) => item._id !== id);
            return {
                ...state,
                businessList: newBusinessList,
                deleteBusinessLoading: false,
            };
        case businessConstants.DELETE_BUSINESS_FAILURE:
            return {
                ...state,
                deleteBusinessLoading: false,
            };

        default: // ? defaaaalt case yk...!
            return state;
    }
};
