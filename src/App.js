import './App.css';
import Main from "./components/Main"
import Onboarding from "./components/Onboarding"
import NotFoundPage from "./components/NotFoundPage"
import Errorpage from "./components/Errorpage";
import Dashboard from "./components/Dashboard"
import CreateEvent from "./components/CreateEvent"
import Booking from "./components/Booking";
import Loading from "./components/Loading";
import Test from './components/Test';
import { Route, Switch, Redirect } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Store from "./Store"
import Session from './components/Session';



const PrivateRoute = ({ component: Component, authenticated: authenticated, ...rest }) => (
  <Route {...rest} render=
    {props => !authenticated.initialized ?
      (<Errorpage />)
      :
      authenticated.authenticated ?
        <Component {...props} /> :
        <Loading/>
    }
  />
);

function App() {
  
  const [authentication, setAuthState] = useState({
    authenticated: localStorage.getItem("arcana-auth" ) ? true : false,
    initialized: localStorage.getItem("arcana-auth" ) ? true : false
  });

  return (
    <Store>
      <Switch>
        <Route path={"/"} component={(Main)} exact />
        <Route path="/:username" component={Booking} exact />
        <Route path="/:username/:event" component={Booking} exact />
        {/* <Route path="/my/hry/test" component={Test} exact />
        <Route path="/my/hry/testt" component={Session} exact /> */}
        <PrivateRoute component={(Dashboard)} authenticated={authentication} path={"/u/nav/dashboard"} exact />
        <PrivateRoute component={(Onboarding)} authenticated={authentication} path={"/u/nav/onboarding"} exact />
        <PrivateRoute component={(CreateEvent)} authenticated={authentication} path={"/u/nav/dashboard/events/create"} exact />
        <PrivateRoute component={(Session)} authenticated={authentication} path={"/sessions/:sessionid"} exact />
        <Route path="*" component={NotFoundPage} exact />
      </Switch>
    </Store>


  );
}

export default App;
