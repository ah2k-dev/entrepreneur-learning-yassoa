import { podcastsConstants } from "../constants/podcastsConstants";
export const podcastsReducer = (
    state = {
        podcastDetail: null,
        podcastDetailLoading: false,
        podcastsList: [],
        podcastsListLoading: false,
        podcastAddLoading: false,
        publishedPodcastLoading: false
    },
    action
) => {
    switch (action.type) {
        // Podcast list 
        case podcastsConstants.PODCASTS_LIST_REQUEST:
            return {
                ...state,
                podcastsListLoading: true,
            };
        case podcastsConstants.PODCASTS_LIST_SUCCESS:
            return {
                ...state,
                podcastsList: action.payload,
                podcastsListLoading: false,
            };
        case podcastsConstants.PODCASTS_LIST_FAILURE:
            return {
                ...state,
                podcastsListLoading: false,
            };

        // Podcast detail 
        case podcastsConstants.SINGLE_PODCASTS_REQUEST:
            return {
                ...state,
                podcastDetailLoading: true,
            };
        case podcastsConstants.SINGLE_PODCASTS_SUCCESS:
            return {
                ...state,
                podcastDetail: action.payload,
                podcastDetailLoading: false,
            };
        case podcastsConstants.SINGLE_PODCASTS_FAILURE:
            return {
                ...state,
                podcastDetailLoading: false,
            };

        // Podcast add edit

        case podcastsConstants.ADD_EDIT_PODCASTS_REQUEST:
            return {
                ...state,
                podcastAddLoading: true,
            };

        case podcastsConstants.ADD_EDIT_PODCASTS_SUCCESS:
            let pod = [...state.podcastsList]
            let index = pod.findIndex(v => v._id.toString() === action.payload._id)
            if (index !== -1) {
                pod[index] = action.payload
            } else {
                pod = [action.payload, ...pod]
            }
            return {
                ...state,
                podcastAddLoading: false,
                podcastsList: pod,
                podcastDetail: action.payload,
            };

        case podcastsConstants.ADD_EDIT_PODCASTS_FAILURE:
            return {
                ...state,
                podcastAddLoading: false,
            };

        // Publish Podcast  

        case podcastsConstants.PUBLISHED_PODCASTS_REQUEST:
            return {
                ...state,
                publishedPodcastLoading: true,
            };

        case podcastsConstants.PUBLISHED_PODCASTS_SUCCESS:
            return {
                ...state,
                publishedPodcastLoading: false,
                podcastsList: [action.payload, ...state.podcastsList],
                podcastDetail: action.payload,
            };

        case podcastsConstants.PUBLISHED_PODCASTS_FAILURE:
            return {
                ...state,
                publishedPodcastLoading: false,
            };



        default: // ? defaaaalt case yk...!
            return state;
    }
};
