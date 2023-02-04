import './App.css';
import Main from "./components/Main"
import Onboarding from "./components/Onboarding"
import NotFoundPage from "./components/NotFoundPage"
import Errorpage from "./components/Errorpage";
import Dashboard from "./components/Dashboard"
import CreateEvent from "./components/CreateEvent"
import Booking from "./components/Booking";
import Loading from "./components/Loading";
import { Route, Switch, Redirect } from "react-router-dom";
import { firebaseAuth } from "./configs/firebase";
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Store from "./Store"



const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));



const PrivateRoute = ({ component: Component, authenticated: authenticated, ...rest }) => (
  <Route {...rest} render=
    {props => !authenticated.initialized ?
      (<Errorpage />)
      :
      authenticated.authenticated ?
        <Component {...props} /> :
        <Loading />
    }
  />
);

function App() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [authentication, setAuthState] = useState({
    authenticated: false,
    initialized: true
  });

  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  React.useEffect(() => firebaseAuth.onAuthStateChanged(user => {
    if (user) { //the user has been logged in
      setAuthState({
        authenticated: true, //the user is now authenticated
        initialized: true
      });
    } else { //the user has been logged out
      setAuthState({
        authenticated: false, //the user is no longer authenticated
        initialized: false
      });
    }

    console.log(authentication);
  }), [setAuthState]);

  return (
    <Store>
      <Switch>
        <Route path={"/"} component={(Main)} exact />
        <Route path="/:username" component={Booking} exact />
        <Route path="/:username/:event" component={Booking} exact />
        <PrivateRoute component={(Dashboard)} authenticated={authentication} path={"/u/nav/dashboard"} exact />
        <PrivateRoute component={(Onboarding)} authenticated={authentication} path={"/u/nav/onboarding"} exact />
        <PrivateRoute component={(CreateEvent)} authenticated={authentication} path={"/u/nav/dashboard/events/create"} exact />
        <Route path="*" component={NotFoundPage} exact />
      </Switch>
    </Store>


  );
}

export default App;
