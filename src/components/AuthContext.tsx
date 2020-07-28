import React from "react";

const AuthContext = React.createContext({ userLoading: true, userName: "" });
export default AuthContext;
