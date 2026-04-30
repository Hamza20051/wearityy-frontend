const initialState = {
  items: [],
  total: 0,
};

const calculateTotal = (items) => {
  return items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {

    case "ADD_TO_CART": {
      const product = action.payload;

      const existingIndex = state.items.findIndex(
        (item) => item._id === product._id
      );

      let updatedItems;

      if (existingIndex !== -1) {
        updatedItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedItems = [...state.items, { ...product, quantity: 1 }];
      }

      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    }

    case "REMOVE_FROM_CART": {
      const updatedItems = state.items.filter(
        (item) => item._id !== action.payload
      );

      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    }

    case "CLEAR_CART":
      return initialState;

    default:
      return state;
  }
};

export default cartReducer;
