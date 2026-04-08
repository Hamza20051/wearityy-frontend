// src/store/reducers/cartReducer.js

const initialState = {
  items: [],
  total: 0,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingProductIndex = state.items.findIndex(item => item._id === action.payload._id);
      if (existingProductIndex !== -1) {
        // If the product already exists in the cart, update the quantity
        const updatedItems = [...state.items];
        updatedItems[existingProductIndex].quantity += 1;
        return { ...state, items: updatedItems };
      } else {
        // If the product is not in the cart, add it with quantity 1
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
        };
      }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload), // Remove item by product ID
      };

    default:
      return state;
  }
};

export default cartReducer;
