import React, { useState } from "react"

const initialState = {
    name: "User",
    cookie: "None",
    auth_token: "None",
    logged_in: false
};

export const Context = React.createContext();

const Store = ({ children }) => {
    const [state, setState] = useState(initialState)

    return (
        <Context.Provider value={[state, setState]}>{children}</Context.Provider>
    );
};

export default Store;