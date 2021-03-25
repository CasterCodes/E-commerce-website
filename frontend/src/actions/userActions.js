import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_DETAILS_RESET,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
} from "../constants/userConstants";

import { MY_ORDER_LIST_RESET } from "../constants/orderConstants";

import axios from "axios";

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const data = { email, password };

    const config = { header: { "Content-type": "application/json" } };

    const res = await axios.post("/api/users/login", data, config);

    dispatch({ type: USER_LOGIN_SUCCESS, payload: res.data.user });

    localStorage.setItem("userInfo", JSON.stringify(res.data.user));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const registerUser = (name, email, password, confirmPassword) => async (
  dispatch
) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const data = { name, email, password, confirmPassword };

    const config = { header: { "Content-type": "application/json" } };

    const res = await axios.post("/api/users/register", data, config);

    dispatch({ type: USER_REGISTER_SUCCESS, payload: res.data.user });

    dispatch({ type: USER_LOGIN_SUCCESS, payload: res.data.user });

    localStorage.setItem("userInfo", JSON.stringify(res.data.user));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST });
    const token = getState().user.userInfo.token;

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bear ${token}`,
      },
    };

    const res = await axios.get(`/api/users/${id}`, config);

    dispatch({ type: USER_DETAILS_SUCCESS, payload: res.data.user });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST });
    const token = getState().user.userInfo.token;

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bear ${token}`,
      },
    };

    const res = await axios.put(`/api/users/profile`, user, config);

    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: res.data.user });

    dispatch({ type: USER_LOGIN_SUCCESS, payload: res.data.user });

    localStorage.setItem("userInfo", JSON.stringify(res.data.user));
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getUserList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LIST_REQUEST });
    const token = getState().user.userInfo.token;

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bear ${token}`,
      },
    };

    const res = await axios.get(`/api/users/`, config);

    dispatch({ type: USER_LIST_SUCCESS, payload: res.data.users });
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DELETE_REQUEST });

    const token = getState().user.userInfo.token;

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bear ${token}`,
      },
    };

    await axios.delete(`/api/users/${id}`, config);

    dispatch({ type: USER_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateUser = (id, user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST });

    const token = getState().user.userInfo.token;

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bear ${token}`,
      },
    };

    const res = await axios.put(`/api/users/${id}`, user, config);

    dispatch({ type: USER_UPDATE_SUCCESS, payload: res.data.user });
    dispatch({ type: USER_DETAILS_SUCCESS, payload: res.data.user });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const logout = () => async (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
  dispatch({ type: USER_DETAILS_RESET });
  dispatch({ type: MY_ORDER_LIST_RESET });
  dispatch({ type: USER_LIST_RESET });
};
