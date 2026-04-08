// src/store/store.js
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import authReducer from './reducers/authReducers';
import cartReducer from './reducers/cartReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware()) // Add thunk here if you need it
);

export default store;
