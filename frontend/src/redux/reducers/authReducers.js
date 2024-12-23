import { dashboardData, DummyAuth } from "../../data/data";
import { getToken, getUserData } from "../../services/hooks";
import { authConstants } from "../constants/authConstants";
const token = getToken();
const user = getUserData();
export const authReducer = (
  state = {
    user: token && user ? user : null,
    token: token && user ? token : null,
    isAuthenticated: token && user ? true : false,
    loading: false,
    updatePasswordLoading: false,
    verifyEmailLoading: false,
    updateProfileLoading: false,
    clients: [],
    clientsLoading: false,
    addEditorLoading: false,
    getEditors: [],
    getEditorsLoading: false,
    getMeLoading: false,
    myInvoicesLoading: false,
    myInvoicesList: [],
    dashboardLoading: false,
    dashboardData: [],
    SUBS_PAGE_DETAILS_LOADING: false,
    SUBS_PAGE_DETAILS: null,
  },
  action
) => {
  switch (action.type) {
    case authConstants.SIGNUP_REQUEST:
    case authConstants.LOGIN_REQUEST:
    case authConstants.FORGOT_PASSWORD_REQUEST:
    case authConstants.LOGOUT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case authConstants.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case authConstants.LOGOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      };

    case authConstants.SIGNUP_REQUEST:
    case authConstants.SIGNUP_SUCCESS:
    case authConstants.LOGIN_FAILURE:
    case authConstants.LOGOUT_FAILURE:
    case authConstants.FORGOT_PASSWORD_SUCCESS:
    case authConstants.FORGOT_PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
      };


    case authConstants.REQUEST_VERIFY_EMAIL_REQUEST:
      return {
        ...state,
        verifyEmailLoading: true,
      };
    case authConstants.REQUEST_VERIFY_EMAIL_FAILURE:
    case authConstants.REQUEST_VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        verifyEmailLoading: false,
      };

    case authConstants.UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        updateProfileLoading: true
      }

    case authConstants.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        updateProfileLoading: false,
        user: action.payload
      }
    case authConstants.UPDATE_PROFILE_FAILURE:
      return {
        ...state,
        updateProfileLoading: false
      }

    //GET Users
    case authConstants.GET_CLIENTS_REQUEST:
      return {
        ...state,
        clientsLoading: true
      }

    case authConstants.GET_CLIENTS_SUCCESS:
      return {
        ...state,
        clientsLoading: false,
        clients: action.payload
      }
    case authConstants.GET_CLIENTS_FAILURE:
      return {
        ...state,
        clientsLoading: false
      }

    //Add Editor
    case authConstants.ADD_EDITOR_REQUEST:
      return {
        ...state,
        addEditorLoading: true
      }

    case authConstants.ADD_EDITOR_SUCCESS:
      return {
        ...state,
        addEditorLoading: false,
        getEditors: [action.payload, ...state.getEditors],
      }
    case authConstants.ADD_EDITOR_FAILURE:
      return {
        ...state,
        addEditorLoading: false
      }

    //Add Editor
    case authConstants.UPDATE_EDITOR_REQUEST:
      return {
        ...state,
        addEditorLoading: true
      }

    case authConstants.UPDATE_EDITOR_SUCCESS:
      return {
        ...state,
        addEditorLoading: false,
      }
    case authConstants.UPDATE_EDITOR_FAILURE:
      return {
        ...state,
        addEditorLoading: false
      }

    //Get Editors
    case authConstants.GET_EDITOR_REQUEST:
      return {
        ...state,
        getEditorsLoading: true
      }

    case authConstants.GET_EDITOR_SUCCESS:
      return {
        ...state,
        getEditorsLoading: false,
        getEditors: action.payload
      }
    case authConstants.GET_EDITOR_FAILURE:
      return {
        ...state,
        getEditorsLoading: false
      }
    case authConstants.ME_REQUEST:
      return {
        ...state,
        getMeLoading: true,
      };

    case authConstants.ME_SUCCESS:
      return {
        ...state,
        getMeLoading: false,
        isAuthenticated: true,
        user: action.payload,
      };
    case authConstants.ME_FAILURE:
      return {
        ...state,
        getMeLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      };

    case authConstants.MY_INVOICES_REQUEST:
      return {
        ...state,
        myInvoicesLoading: true,
      };
    case authConstants.MY_INVOICES_SUCCESS:
      return {
        ...state,
        myInvoicesLoading: false,
        myInvoicesList: action.payload,
      };
    case authConstants.MY_INVOICES_FAILURE:
      return {
        ...state,
        myInvoicesLoading: false,
      };

    //GET Users
    case authConstants.GET_DASHBOARD_REQUEST:
      return {
        ...state,
        dashboardLoading: true
      }

    case authConstants.GET_DASHBOARD_SUCCESS:
      return {
        ...state,
        dashboardLoading: false,
        dashboardData: action.payload
      }
    case authConstants.GET_DASHBOARD_FAILURE:
      return {
        ...state,
        dashboardLoading: false
      }

    //GET Users
    case authConstants.GET_SUBS_PAGE_DETAILS_REQUEST:
      return {
        ...state,
        SUBS_PAGE_DETAILS_LOADING: true
      }

    case authConstants.GET_SUBS_PAGE_DETAILS_SUCCESS:
      return {
        ...state,
        SUBS_PAGE_DETAILS_LOADING: false,
        SUBS_PAGE_DETAILS: action.payload
      }
    case authConstants.GET_SUBS_PAGE_DETAILS_FAILURE:
      return {
        ...state,
        SUBS_PAGE_DETAILS_LOADING: false
      }

    //GET Users
    case authConstants.UPDATE_SUBS_PAGE_DETAILS_REQUEST:
      return {
        ...state,
        SUBS_PAGE_DETAILS_LOADING: true
      }

    case authConstants.UPDATE_SUBS_PAGE_DETAILS_SUCCESS:
      return {
        ...state,
        SUBS_PAGE_DETAILS_LOADING: false,
        SUBS_PAGE_DETAILS: action.payload
      }
    case authConstants.UPDATE_SUBS_PAGE_DETAILS_FAILURE:
      return {
        ...state,
        SUBS_PAGE_DETAILS_LOADING: false
      }
    default: // ? defaaaalt case yk...!
      return state;
  }
};
