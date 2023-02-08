import React, { useContext, useEffect, useState } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Context } from "../Store";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Logomini from "./Logomini";
import Logo from "./Logo";
import { Redirect } from "react-router-dom";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import useArcanaAuth from "../useArcanaAuth";

const font = "'Pattaya', sans-serif";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  appbar: {
    backgroundColor: "white",
    padding: 0,
    boxShadow: "none",
    paddingRight: "30px",
    paddingLeft: "30px",
    borderBottom: "2px solid #F2F2F2",
  },
  title: {
    display: "none",
    font: font,
    color: "#100615",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
    fontWeight: 700,
    marginRight: 15,
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "50%",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  drawer: {
    padding: 100,
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  sheader: {
    backgroundColor: "#E5E8EB",
    padding: 10,
    textAlign: "center",
  },
}));

function Appbar() {
  const history = useHistory();
  const [state, setState] = useContext(Context);
  const classes = useStyles();

  const {
    logout,
  } = useArcanaAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };


  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setState({
          logged_in: true,
          user: firebase.auth().currentUser,
          token: firebase.auth().currentUser.getIdToken(),
        });
      }
    });
  }, []);

  const handleLogin = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        var token = result.credential.accessToken;
        var user = result.user;
        setState({
          token: token,
          logged_in: true,
          user: user,
          uid: user.uid,
          name: user.displayName,
          photo_url: user.photoURL,
        });
        if (result.additionalUserInfo.isNewUser) {
          <Redirect to="/somewhere/else" />;
        }
      });
  };
  

  return (
    <div className={classes.grow}>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Logo size={40} />
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {state.logged_in ? (
              <div>
                {/* <Button variant="contained" style={{ color: "white", borderColor: "white", backgroundColor: "#100615", marginRight: 10, fontWeight: 700, paddingLeft: "24px", paddingRight: "24px", borderRadius: 1000, textTransform: "none", height: "35px", boxShadow: "none" }}>
                                    My Account
      </Button> */}
                {/* <IconButton
                  aria-label="show 4 new mails"
                  color="inherit"
                  onClick={logout}
                >
                  <Avatar
                    alt="Remy Sharp"
                    src={firebase.auth().currentUser.photoURL}
                  />
                </IconButton> */}
              </div>
            ) : (
              <div>
                <Button
                  variant="contained"
                  style={{
                    color: "white",
                    borderColor: "white",
                    backgroundColor: "#100615",
                    marginRight: 10,
                    fontWeight: 700,
                    paddingLeft: "24px",
                    paddingRight: "24px",
                    borderRadius: 1000,
                    textTransform: "none",
                    height: "35px",
                    boxShadow: "none",
                  }}
                  onClick={handleLogin}
                >
                  Become A Creator
                </Button>
                <Button
                  variant="contained"
                  style={{
                    color: "white",
                    borderColor: "white",
                    backgroundColor: "#100615",
                    marginRight: 10,
                    fontWeight: 700,
                    paddingLeft: "24px",
                    paddingRight: "24px",
                    borderRadius: 1000,
                    textTransform: "none",
                    height: "35px",
                    boxShadow: "none",
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Appbar;
