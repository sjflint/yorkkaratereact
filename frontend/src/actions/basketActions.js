import axios from "axios";
import {
  BASKET_ADD_ITEM,
  BASKET_REMOVE_ITEM,
  BASKET_SAVE_PAYMENT_METHOD,
} from "../constants/BasketConstants";

export const addToBasket = (id, qty, size, print) => async (
  dispatch,
  getState
) => {
  const { data } = await axios.get(`/api/products/${id}`);

  let uniqueProductId = 0;
  if (print) {
    uniqueProductId = Math.random();
  }

  dispatch({
    type: BASKET_ADD_ITEM,
    payload: {
      product: data._id + "?" + size + uniqueProductId,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
      size,
      print,
    },
  });

  localStorage.setItem(
    "basketItems",
    JSON.stringify(getState().basket.basketItems)
  );
};

export const removeFromBasket = (id) => (dispatch, getState) => {
  dispatch({
    type: BASKET_REMOVE_ITEM,
    payload: id,
  });

  localStorage.setItem(
    "basketItems",
    JSON.stringify(getState().basket.basketItems)
  );
};

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: BASKET_SAVE_PAYMENT_METHOD,
    payload: data,
  });

  localStorage.setItem("paymentMethod", JSON.stringify(data));
};
