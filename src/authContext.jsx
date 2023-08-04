import React, { useReducer } from "react";
import MkdSDK from "./utils/MkdSDK";

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: localStorage.getItem("token") ? true : false,
  user: null,
  token: localStorage.getItem("token") || null, // Check if token exists in local storage
  role: localStorage.getItem("role")|| null  // Check if role exists in local storage
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      const { user, token, role } = action.payload; // Extract user, token, and role from payload
      localStorage.setItem("token", token); // Store token in local storage
      localStorage.setItem("role", role); // Store role in local storage
      return {
        ...state,
        isAuthenticated: true,
        user,
        token,
        role,
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

let sdk = new MkdSDK();

export const tokenExpireError = (dispatch, errorMessage) => {
  const role = localStorage.getItem("role");
  if (errorMessage === "TOKEN_EXPIRED") {
    dispatch({
      type: "Logout",
    });
    window.location.href = "/" + role + "/login";
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

// function to check token validity
const checkToken = async () => {
  try {
    await sdk.check(); //Status code 200 means valid
  } catch (error) {
    dispatch({ type: 'LOGOUT' });
  };
}

  React.useEffect(() => {
    checkToken()
    const tokenCheckInterval = setInterval(checkToken, 6000); // one minute 

    return () => {
      clearInterval(tokenCheckInterval); // Clear the interval when the component unmounts
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
