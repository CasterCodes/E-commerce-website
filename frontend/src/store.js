import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import {
  productListReducer,
  productDetails,
  deleteProductReducer,
  createProductReducer,
  updateProductReducer,
  createReviewReducer,
  topProductsReducer,
} from "./reducers/productReducers";
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  deleteUserReducer,
  updateUserReducer,
} from "./reducers/userReducers";
import { cartReducer } from "./reducers/cartReducers";

import {
  createOrderReducer,
  getOrderDetailsReducer,
  orderPayReducer,
  getMyOrdersReducer,
  ordersListReducer,
  orderDeliverReducer,
} from "./reducers/orderReducers";

import { composeWithDevTools } from "redux-devtools-extension";

const cartFromLocalStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const userInfoFromLocatStarage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const shippingAddressFromLocalStarage = localStorage.getItem("shippingAddress")
  ? JSON.parse(localStorage.getItem("shippingAddress"))
  : {};

const paymentMethodFromLocalStorage = localStorage.getItem("paymentMethod")
  ? JSON.parse(localStorage.getItem("paymentMethod"))
  : null;

const reducer = combineReducers({
  productList: productListReducer,
  product: productDetails,
  cart: cartReducer,
  user: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  orderCreate: createOrderReducer,
  orderDetails: getOrderDetailsReducer,
  orderPay: orderPayReducer,
  myOrders: getMyOrdersReducer,
  ordersList: ordersListReducer,
  orderDeliver: orderDeliverReducer,
  usersList: userListReducer,
  deleteUser: deleteUserReducer,
  updateUser: updateUserReducer,
  deleteProduct: deleteProductReducer,
  createProduct: createProductReducer,
  updateProduct: updateProductReducer,
  topProducts: topProductsReducer,
  createReview: createReviewReducer,
});

const initialState = {
  cart: {
    cartItems: cartFromLocalStorage,
    shippingAddress: shippingAddressFromLocalStarage,
    paymentMethod: paymentMethodFromLocalStorage,
  },
  user: {
    userInfo: userInfoFromLocatStarage,
  },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
