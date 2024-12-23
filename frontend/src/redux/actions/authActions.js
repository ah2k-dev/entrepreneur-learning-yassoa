import { authConstants } from "../constants/authConstants";
import {
  successMessage,
  errorMessage,
  warningMessage,
} from "../../services/helpers";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import custAxios, { attachToken } from "../../configs/axios.configs";


export const signup = (values) => async (dispatch) => {
  dispatch({
    type: authConstants.SIGNUP_REQUEST,
  });
  try {
    const res = await custAxios.post("/auth/register", values);
    if (res?.data?.success === true) {
      dispatch({
        type: authConstants.SIGNUP_SUCCESS,
      });
      successMessage(
        "You have successfully signed up, Please verify your email"
      );
      return "success";
    } else {
      warningMessage(
        res?.data?.message ||
        "Something wronge while creating account, Please contact us or Try again!"
      );
      return "faild";
    }
  } catch (error) {
    dispatch({
      type: authConstants.SIGNUP_FAILURE,
      payload: error.response.data.message || "Server Error",
    });
    errorMessage(error.response.data.message);
  }
};

export const checkUser = (values) => async (dispatch) => {
  dispatch({
    type: authConstants.SIGNUP_REQUEST,
  });
  try {
    const res = await custAxios.post("/auth/checkUser", values);
    if (res?.data?.success === true) {
      dispatch({
        type: authConstants.SIGNUP_SUCCESS,
      });

    }
    return res?.data
  } catch (error) {
    console.log(error)
    dispatch({
      type: authConstants.SIGNUP_FAILURE,
      payload: error?.response?.data?.message?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message?.message);
    return error?.response?.data
  }
};

export const requestEmailVerification = (value) => async (dispatch) => {
  dispatch({
    type: authConstants.REQUEST_VERIFY_EMAIL_REQUEST,
  });
  try {
    const res = await custAxios.post("/auth/requestEmailToken", value);
    if (res?.data?.success === true) {
      dispatch({
        type: authConstants.REQUEST_VERIFY_EMAIL_SUCCESS,
      });
      successMessage(
        "Email verification token sent to mustafaghouri22@gmail.com"
      );
      return "success";
    } else {
      warningMessage(
        res?.data?.message ||
        "Something wronge while creating account, Please contact us or Try again!"
      );
      return "faild";
    }
  } catch (error) {
    dispatch({
      type: authConstants.REQUEST_VERIFY_EMAIL_FAILURE,
      payload: error.response.data.message || "Server Error",
    });
    errorMessage(error.response.data.message);
  }
};


export const verifyEmail = (value) => async (dispatch) => {
  dispatch({
    type: authConstants.REQUEST_VERIFY_EMAIL_REQUEST,
  });
  try {
    const res = await custAxios.post("/auth/verifyEmail", value);
    if (res?.data?.success === true) {
      dispatch({
        type: authConstants.REQUEST_VERIFY_EMAIL_SUCCESS,
      });
      successMessage(
        "Email successfully verified"
      );
      return "success";
    } else {
      warningMessage(
        res?.data?.message ||
        "Something wronge while verifing email, Please contact us or Try again!"
      );
      return "faild";
    }
  } catch (error) {
    dispatch({
      type: authConstants.REQUEST_VERIFY_EMAIL_FAILURE,
      payload: error.response.data.message || "Server Error",
    });
    errorMessage(error.response.data.message);
  }
};

export const login = (values) => async (dispatch) => {
  dispatch({
    type: authConstants.LOGIN_REQUEST,
  });
  try {

    const res = await custAxios.post("/auth/login", values);
    if (res?.data?.success === true) {
      let data = res?.data.data;
      localStorage.setItem("token", data?.jwtToken);
      localStorage.setItem("user", JSON.stringify(data?.user));

      await dispatch({
        type: authConstants.LOGIN_SUCCESS,
        payload: { token: data.jwtToken, user: data.user },
      });
      successMessage("Login Successful");

    } else {
      warningMessage("Login Faild");

    }

    return res?.data
  } catch (error) {
    console.log(error);
    dispatch({
      type: authConstants.LOGIN_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message || "Server Error");
    return error?.response?.data?.message || "Server Error"


  }
}

export const getMee = () => async (dispatch) => {
  dispatch({
    type: authConstants.ME_REQUEST,
  });
  try {
    attachToken()
    const res = await custAxios.get("/auth/me");
    if (res?.data?.success === true) {
      let data = res?.data.data;
      localStorage.setItem("user", JSON.stringify(data));
      await dispatch({
        type: authConstants.ME_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: authConstants.ME_FAILURE,
      })
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      warningMessage("Authentication Failed");
    }

    return res?.data
  } catch (error) {
    console.log(error);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch({
      type: authConstants.ME_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    // errorMessage(error?.response?.data?.message);
  }
}

export const MyInvoices = () => async (dispatch) => {
  dispatch({
    type: authConstants.MY_INVOICES_REQUEST,
  });
  try {
    attachToken()
    const res = await custAxios.get("/auth/my-invoices");
    if (res?.data?.success === true) {
      let data = res?.data.data;

      await dispatch({
        type: authConstants.MY_INVOICES_SUCCESS,
        payload: data.reverse(),
      });
    }

    return res?.data
  } catch (error) {
    dispatch({
      type: authConstants.MY_INVOICES_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message);
  }
}

export const DashboardList = () => async (dispatch) => {
  dispatch({
    type: authConstants.GET_DASHBOARD_REQUEST,
  });
  try {
    attachToken()
    const res = await custAxios.get("/auth/dashboard");
    if (res?.data?.success === true) {
      let data = res?.data?.data?.data;

      await dispatch({
        type: authConstants.GET_DASHBOARD_SUCCESS,
        payload: data.reverse(),
      });
    }

    return res?.data
  } catch (error) {
    dispatch({
      type: authConstants.GET_DASHBOARD_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    // errorMessage(error?.response?.data?.message);
  }
}


export const logout = () => async (dispatch) => {
  dispatch({
    type: authConstants.LOGOUT_REQUEST,
  });
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    await dispatch({
      type: authConstants.LOGOUT_SUCCESS,
    });
    successMessage("Successfully logged out!");
    return true
  } catch (error) {
    dispatch({
      type: authConstants.LOGOUT_FAILURE,
      payload: error.response.data.message || "Server Error",
    });
  }
};



export const forgotPassword = (email) => async (dispatch) => {
  dispatch({
    type: authConstants.FORGOT_PASSWORD_REQUEST,
  });
  try {
    const res = await custAxios.post("/auth/forgotPassword", email);

    if (res?.data?.success) {
      dispatch({
        type: authConstants.FORGOT_PASSWORD_SUCCESS,
      });
      successMessage(res?.data?.data);
      return res?.data?.success;
    }
    return false;
  } catch (error) {
    dispatch({
      type: authConstants.FORGOT_PASSWORD_FAILURE,
      payload: error.response.data.message || "Server Error",
    });
    errorMessage(error.response.data.message);
  }
};

export const renewPassword = (values) => async (dispatch) => {
  dispatch({
    type: authConstants.UPDATE_PASSWORD_REQUEST,
  });
  try {
    const res = await custAxios.put("/auth/resetPassword", values);

    if (res?.data?.success) {
      dispatch({
        type: authConstants.UPDATE_PASSWORD_SUCCESS,
      });
      successMessage(res?.data?.data);
      return res?.data?.success;
    }
  } catch (error) {
    dispatch({
      type: authConstants.UPDATE_PASSWORD_FAILURE,
      payload: error.response.data.message || "Server Error",
    });
    errorMessage(error.response.data.message);
  }
};


export const UpdateProfile = (values) => async (dispatch) => {
  dispatch({
    type: authConstants.UPDATE_PROFILE_REQUEST,
  });
  try {
    attachToken();
    const res = await custAxios.put("/auth/updateMe", values);
    if (res?.data?.success === true) {
      let data = res?.data.data;
      localStorage.setItem("user", JSON.stringify(data?.user));

      await dispatch({
        type: authConstants.UPDATE_PROFILE_SUCCESS,
        payload: data.user,
      });
      successMessage("Profile updated successfully");

    }

    return res?.data
  } catch (error) {
    console.log(error);
    dispatch({
      type: authConstants.UPDATE_PROFILE_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message);
  }
}

export const UpdatePassword = (values) => async (dispatch) => {

  try {
    attachToken();
    const res = await custAxios.put("/auth/updatePassword", values);
    if (res?.data?.success === true) {
      successMessage("Password updated successfully");
    }

  } catch (error) {
    dispatch({
      type: authConstants.UPDATE_PROFILE_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message);
  }
}



export const GetClients = () => async (dispatch) => {
  dispatch({
    type: authConstants.GET_CLIENTS_REQUEST,
  });
  try {
    attachToken();
    const res = await custAxios.get("/auth/users");
    if (res?.data?.success === true) {
      let data = res?.data.data;
      await dispatch({
        type: authConstants.GET_CLIENTS_SUCCESS,
        payload: data,
      });

    }

    return res?.data
  } catch (error) {
    console.log(error);
    dispatch({
      type: authConstants.GET_CLIENTS_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message);
  }
}


export const AddEditor = (values) => async (dispatch) => {
  dispatch({
    type: authConstants.ADD_EDITOR_REQUEST,
  });
  try {
    attachToken();
    const res = await custAxios.post("/auth/addEditor", values);
    if (res?.data?.success === true) {
      let data = res?.data.data;
      await dispatch({
        type: authConstants.ADD_EDITOR_SUCCESS,
        payload: data,
      });

    }

    return res?.data
  } catch (error) {
    dispatch({
      type: authConstants.ADD_EDITOR_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message);
  }
}


export const UpdateEditor = (values, id) => async (dispatch) => {
  dispatch({
    type: authConstants.ADD_EDITOR_REQUEST,
  });
  try {
    attachToken();
    const res = await custAxios.put(`/auth/updateEditor?id=${id}`, values);
    if (res?.data?.success === true) {
      let data = res?.data.data;
      await dispatch({
        type: authConstants.ADD_EDITOR_SUCCESS,
        payload: data,
      });

    }

    return res?.data
  } catch (error) {
    dispatch({
      type: authConstants.ADD_EDITOR_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message);
  }
}


export const GetEditor = () => async (dispatch) => {
  dispatch({
    type: authConstants.GET_EDITOR_REQUEST,
  });
  try {
    attachToken();
    const res = await custAxios.get("/auth/getEditors");
    if (res?.data?.success === true) {
      let data = res?.data.data;
      await dispatch({
        type: authConstants.GET_EDITOR_SUCCESS,
        payload: data,
      });

    }

    return res?.data
  } catch (error) {
    console.log(error);
    dispatch({
      type: authConstants.GET_EDITOR_FAILURE,
      payload: error?.response?.data?.message || "Server Error",
    });
    errorMessage(error?.response?.data?.message);
  }
}

export const BlockEditor = (id) => async (dispatch) => {

  try {
    attachToken();
    const res = await custAxios.delete("/auth/blockEditor?id=" + id);
    if (res?.data?.success === true) {
      let data = res?.data.data;

    }

    return res?.data
  } catch (error) {
    errorMessage(error?.response?.data?.message);
  }
}

export const updateSubscriptionPage = (value) => async (dispatch) => {
  await dispatch({
    type: authConstants.UPDATE_SUBS_PAGE_DETAILS_REQUEST
  });
  try {
    attachToken();
    const res = await custAxios.post("/auth/update-subscription-page", value);
    if (res?.data?.success === true) {
      let data = res?.data.data;
      await dispatch({
        type: authConstants.UPDATE_SUBS_PAGE_DETAILS_SUCCESS,
        payload: data,
      });
    }

    return res?.data
  } catch (error) {
    await dispatch({
      type: authConstants.UPDATE_SUBS_PAGE_DETAILS_FAILURE
    });
    errorMessage(error?.response?.data?.message);
  }
}


export const gatSubscriptionPage = (value) => async (dispatch) => {
  await dispatch({
    type: authConstants.GET_SUBS_PAGE_DETAILS_REQUEST
  });
  try {
    attachToken();
    const res = await custAxios.get("/auth/get-subscription-page", value);
    if (res?.data?.success === true) {
      let data = res?.data.data;
      await dispatch({
        type: authConstants.GET_SUBS_PAGE_DETAILS_SUCCESS,
        payload: data,
      });
    }

    return res?.data
  } catch (error) {
    await dispatch({
      type: authConstants.GET_SUBS_PAGE_DETAILS_FAILURE
    });
    errorMessage(error?.response?.data?.message);
  }
}
