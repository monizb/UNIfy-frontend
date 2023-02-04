import React, { useContext, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { Context } from "../Store"
import { firebaseAuth } from "../configs/firebase"
import { useSelector } from "react-redux";
import { isLoaded, isEmpty } from 'react-redux-firebase'

const ProtectedRoute = ({
    component: Component,
    ...rest
}) => {
    const auth = useSelector(state => state.firebase.auth);
    const [state, setState] = useContext(Context);
    const [loggedin, setLogin] = React.useState(false);
    useEffect(() => {
        firebaseAuth.onAuthStateChanged(user => {
            if (user) {
                setLogin(true);
            }
        })
    })
    return (
        <Route
            {...rest}
            render={props => {
                if (!isEmpty(auth)) {
                    return <Component {...props} />;
                } else {
                    return (
                        <Redirect
                            to={{
                                pathname: "/",
                                state: {
                                    from: props.location
                                }
                            }}
                        />
                    );
                }
            }}
        />
    );
};

export default ProtectedRoute
