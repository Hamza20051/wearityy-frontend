// src/store/actions/cartActions.js

// Add to cart action
export const addToCart = (product) => {
  return {
    type: 'ADD_TO_CART',
    payload: product,
  };
};

// Remove from cart action
export const removeFromCart = (productId) => {
  return {
    type: 'REMOVE_FROM_CART',
    payload: productId, // Send the product ID to remove
  };
};
