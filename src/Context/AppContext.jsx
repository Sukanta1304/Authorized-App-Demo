import React, { createContext, useReducer } from "react";

// dont change the name
export const AppContext = createContext();

// dont change the name
export const appReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS": {
      return {
        ...state,
        isAuth: true,
        token: action.payload.token
      };
    }
    case "LOGOUT_SUCCESS": {
      return {
        ...state,
        isAuth: false,
        token: null
      };
    }
    default:
      return state;
  }
  // write code
};

function AppContextProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, {
    isAuth: false,
    token: null
  });
  // you need to use context
  // fix code here
  return (
    <AppContext.Provider value={[state, dispatch]}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
