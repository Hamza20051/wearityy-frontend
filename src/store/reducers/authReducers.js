// src/store/reducers/authReducers.js

// Safely load user and token from localStorage
let userFromStorage = null;
let isAdminFromStorage = false;

try {
  const storedUser = localStorage.getItem("user");
  if (storedUser && storedUser !== "undefined") {
    userFromStorage = JSON.parse(storedUser);
    isAdminFromStorage = userFromStorage?.isAdmin || false;
  }
} catch (error) {
  console.error("Error parsing user from localStorage:", error);
}

const tokenFromStorage = localStorage.getItem("token");

const initialState = {
  user: userFromStorage,
  token: tokenFromStorage,
  isAuthenticated: !!tokenFromStorage,
  isAdmin: isAdminFromStorage,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      // Save to localStorage correctly
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);

      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isAdmin: action.payload.user?.isAdmin || false,
      };

    case "LOGOUT":
      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isAdmin: false,
      };

    default:
      return state;
  }
};

export default authReducer;
