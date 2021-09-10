import {
  BASKET_ADD_ITEM,
  BASKET_CLEAR,
  BASKET_REMOVE_ITEM,
  BASKET_SAVE_PAYMENT_METHOD,
} from "../constants/BasketConstants";

export const basketReducer = (state = { basketItems: [] }, action) => {
  switch (action.type) {
    case BASKET_ADD_ITEM:
      const item = action.payload;

      const existItem = state.basketItems.find(
        (x) => x.product === item.product
      );

      if (existItem) {
        return {
          ...state,
          basketItems: state.basketItems.map((x) =>
            x.product === existItem.product ? item : x
          ),
        };
      } else {
        return {
          ...state,
          basketItems: [...state.basketItems, item],
        };
      }

    case BASKET_REMOVE_ITEM:
      return {
        ...state,
        basketItems: state.basketItems.filter(
          (x) => x.product !== action.payload
        ),
      };

    case BASKET_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      };
    case BASKET_CLEAR:
      return { basketItems: [] };
    default:
      return state;
  }
};
