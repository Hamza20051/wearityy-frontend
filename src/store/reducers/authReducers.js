const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      // ONLY ADMIN LOGIN
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
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      return {
        ...initialState,
      };

    default:
      return state;
  }
};

export default authReducer;
