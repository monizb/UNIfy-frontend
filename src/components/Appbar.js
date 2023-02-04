import React, { useContext, useEffect } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Context } from "../Store"
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import axios from "../configs/axios"
import Logo from "./Logo"
import firebase from "firebase"
import { useHistory } from "react-router-dom";
import { firebaseAuth } from '../configs/firebase'

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
        paddingLeft: "30px"
    },
    title: {
        display: 'none',
        font: font,
        color: "#006BFF",
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
        fontWeight: 700,
        marginRight: 15
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: '50%',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    drawer: {
        padding: 100
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    sheader: {
        backgroundColor: "#E5E8EB",
        padding: 10,
        textAlign: "center"
    }
}));

function Appbar() {
    const history = useHistory();
    const [state, setState] = useContext(Context);
    const classes = useStyles();

    useEffect(() => {
        firebaseAuth.onAuthStateChanged(function (user) {
            if (user) {
                setState({
                    logged_in: true,
                    user: firebaseAuth.currentUser,
                    token: firebaseAuth.currentUser.getIdToken()
                })
            }
        })

    }, []);

    async function redirect() {
        firebaseAuth.onAuthStateChanged((user) => {
            if (user) {
                axios.get('/auth/get-stage', {
                    headers: {
                        'Authorization': `Bearer ` + firebaseAuth.currentUser.za
                    }
                }).then(data => {
                    if (data.data.onboarded === false) {
                        history.push("/u/nav/Onboarding")
                    } else if (data.data.onboarded === true) {
                        history.push("/u/nav/Dashboard");
                    }

                })
            }
        })

    }

    const logout = () => {
        firebaseAuth.signOut();
        setState({ ...state, logged_in: false });
        history.push("/")

    }

    async function handleLogin() {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        firebaseAuth.signInWithPopup(provider).then(function (result) {
            var token = result.credential.accessToken;
            var user = result.user;
            console.log(user);
            setState({
                token: token,
                logged_in: true,
                user: user,
                uid: user.uid,
                name: user.displayName,
                photo_url: user.photoURL
            })
            localStorage.setItem("photo_url", user.photoURL);
            localStorage.setItem("name", user.displayName);
            axios.get('/auth/get-stage', {
                headers: {
                    'Authorization': `Bearer ` + user.za
                }
            }).then(data => {
                if (data.data.onboarded === false) {
                    history.push("/u/nav/Onboarding");
                } else if (data.data.onboarded === true) {
                    history.push("/u/nav/Dashboard");
                }

            })
        });

    }

    return (
        <div className={classes.grow}>
            <AppBar position="static" className={classes.appbar}>
                <Toolbar>
                    <Logo />
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        {state.logged_in ?
                            <div>
                                <Button variant="contained" style={{ color: "white", borderColor: "white", backgroundColor: "#006BFF", marginRight: 10, fontWeight: 700, paddingLeft: "24px", paddingRight: "24px", borderRadius: 1000, textTransform: "none", height: "48px", boxShadow: "none" }} onClick={redirect}>
                                    My Account
      </Button>
                                <IconButton aria-label="show 4 new mails" color="inherit" onClick={logout}>
                                    <Avatar alt="Remy Sharp" src={firebaseAuth.currentUser.photoURL} />
                                </IconButton>
                            </div>
                            :
                            <div>
                                <Button variant="contained" style={{ color: "white", borderColor: "white", backgroundColor: "#006BFF", marginRight: 10, fontWeight: 700, paddingLeft: "24px", paddingRight: "24px", borderRadius: 1000, textTransform: "none", height: "48px", boxShadow: "none" }} onClick={handleLogin}>
                                    Login
      </Button>
                            </div>
                        }

                    </div>
                </Toolbar>
            </AppBar >
        </div >
    );
}

export default Appbar