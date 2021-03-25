import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SAVE_CART_SHIPPING_ADDRESS,
  SAVE_CART_PAYMENT_METHOD,
} from "../constants/cartConstants";

export const cartReducer = (
  state = { cartItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case ADD_TO_CART:
      const item = action.payload;
      const itemExists = state.cartItems.find(
        (val) => val.product === item.product
      );

      if (!itemExists) {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      } else {
        return {
          ...state,
          cartItems: state.cartItems.map((val) =>
            val.product === itemExists.product ? item : val
          ),
        };
      }
    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => item.product !== action.payload
        ),
      };
    case SAVE_CART_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case SAVE_CART_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      };

    default:
      return state;
  }
};
