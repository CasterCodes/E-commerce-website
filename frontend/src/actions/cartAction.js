import axios from "axios";
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SAVE_CART_SHIPPING_ADDRESS,
  SAVE_CART_PAYMENT_METHOD,
} from "../constants/cartConstants";

export const addToCart = (id, qty) => async (dispatch, getState) => {
  const res = await axios.get(`/api/products/${id}`);
  dispatch({
    type: ADD_TO_CART,
    payload: {
      product: res.data.product._id,
      name: res.data.product.name,
      price: res.data.product.price,
      image: res.data.product.image,
      countInStock: res.data.product.countInStock,
      quantity: qty,
    },
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (id) => async (dispatch, getState) => {
  dispatch({ type: REMOVE_FROM_CART, payload: id });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = (data) => async (dispatch) => {
  dispatch({ type: SAVE_CART_SHIPPING_ADDRESS, payload: data });
  localStorage.setItem("shippingAddress", JSON.stringify(data));
};

export const savePaymentMethod = (payment) => async (dispatch) => {
  dispatch({ type: SAVE_CART_PAYMENT_METHOD, payload: payment });
  localStorage.setItem("paymentMethod", JSON.stringify(payment));
};
