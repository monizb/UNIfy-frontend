import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar';
import DayTimePicker from '@mooncake-dev/react-day-time-picker';
import Divider from '@material-ui/core/Divider';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import PublicIcon from '@material-ui/icons/Public';
import SettingsIcon from '@material-ui/icons/Settings';
import zoom from "../images/zoom.png"
import axios from "../configs/axios"
import { firebaseAuth } from "../configs/firebase";
import FlashOnIcon from '@material-ui/icons/FlashOn';
import '../styles/calendar.css';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles'
import TimelineDot from '@material-ui/lab/TimelineDot';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { useHistory } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

const theme = {
    primary: 'gold',
    secondary: 'slategrey',
    background: '#111', // This should match the container background
    buttons: {
        disabled: {
            color: '#333',
            background: '#f0f0f0'
        },
        confirm: {
            color: '#fff',
            background: 'slategrey',
            hover: {
                color: '',
                background: 'lightslategrey'
            }
        }
    },
    feedback: {
        success: {
            color: '#29aba4'
        },
        failed: {
            color: '#eb7260'
        }
    }
};


export default function Booking() {
    const classes = useStyles();
    const [value, onChange] = useState();
    const [admin, setAdmin] = useState(false)
    const [stage, setStage] = useState(1);
    const history = useHistory();
    const [events, setEvents] = React.useState([]);

    useEffect(() => {
        if (window.location.pathname.split("/")[2] !== undefined) {
            setStage(2);
        }
    }, [])

    useEffect(() => {
        firebaseAuth.onAuthStateChanged(user => {
            if (user) {
                setAdmin(true);
            }
        })
    })

    useEffect(() => {
        // async function getEvents() {
        //     var token = await firebaseAuth.currentUser.getIdToken();
        //     axios.get('/auth/user-events', {
        //         headers: {
        //             'Authorization': `Bearer ` + token
        //         }
        //     }).then(res => {
        //         if (res.data.received) {
        //             setEvents(res.data.events);
        //         }
        //     })
        // }

        // getEvents();

    }, [])

    return (
        <div>
            {stage === 1 ? <div style={{ margin: "auto", width: "100vh", position: "absolute", top: 0, left: 0, right: 0, bottom: 0, marginTop: "80px", marginBottom: "190px", height: "fit-content" }} className="mainpage">
                <div style={{ padding: "30px" }}>
                    <div style={{ margin: "auto", marginTop: "30px", width: "fit-content", alignItems: "center", justifyItems: "center", textAlign: "center", justifyContent: "center" }}>
                        <div style={{ width: "100%", textAlign: "center" }}>
                            <Avatar src="https://i.pinimg.com/280x280_RS/67/99/e1/6799e1b5122d4dfeb9acad3269828916.jpg" style={{ width: "70px", height: "70px", margin: "auto" }} />
                        </div>
                        <p className="name">{decodeURIComponent(window.location.pathname.split("/")[1])}</p>
                        <p className="para4" style={{ width: "60vh" }}>Welcome to my scheduling page, find an event you are looking for and choose your date and time on the next screen</p>
                    </div>
                    <Grid container spacing={3} style={{ marginTop: "20px", marginBottom: "10px" }}>
                        {events.map(event => {
                            return (
                                <Grid item xs={6}>
                                    <Card style={{ border: "1.5px solid #DADADA", borderRadius: "10px", padding: "15px", boxShadow: "none", borderTop: `5px solid ${event.color}` }}><p className="select" style={{ marginBottom: "25px" }}>{event.title}</p>
                                        <div style={{ width: "100%", float: "right" }}>
                                            <Button style={{ backgroundColor: "#EEF5FF", width: "100%" }} onClick={() => setStage(2)}><ArrowForwardIcon style={{ color: "#006BFF", fontSize: "25px" }} /></Button>
                                        </div>

                                    </Card>
                                </Grid>
                            )
                        })}

                        {/* <Grid item xs={6}>
                            <Card style={{ border: "1.5px solid #DADADA", borderRadius: "10px", padding: "15px", boxShadow: "none", borderTop: "5px solid #FF4F01" }}><p className="select" style={{ marginBottom: "25px" }}>30 min Product Demo</p>
                                <div style={{ width: "100%", float: "right" }}>
                                    <Button style={{ backgroundColor: "#EEF5FF", width: "100%" }} onClick={() => setStage(2)}><ArrowForwardIcon style={{ color: "#006BFF", fontSize: "25px" }} /></Button>
                                </div>
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <Card style={{ border: "1.5px solid #DADADA", borderRadius: "10px", padding: "15px", boxShadow: "none", borderTop: "5px solid #FA275F" }}><p className="select" style={{ marginBottom: "25px" }}>Technical Support</p>
                                <div style={{ width: "100%", float: "right" }}>
                                    <Button style={{ backgroundColor: "#EEF5FF", width: "100%" }} onClick={() => setStage(2)}><ArrowForwardIcon style={{ color: "#006BFF", fontSize: "25px" }} /></Button>
                                </div>
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <Card style={{ border: "1.5px solid #DADADA", borderRadius: "10px", padding: "15px", boxShadow: "none", borderTop: "5px solid #0299FF" }}><p className="select" style={{ marginBottom: "25px" }}>Customer Success Stories</p>
                                <div style={{ width: "100%", float: "right" }}>
                                    <Button style={{ backgroundColor: "#EEF5FF", width: "100%" }} onClick={() => setStage(2)}><ArrowForwardIcon style={{ color: "#006BFF", fontSize: "25px" }} /></Button>
                                </div>
                            </Card>
                        </Grid> */}
                        {/* <Grid item xs={6}>
                            <Card style={{ border: "1.5px solid #DADADA", borderRadius: "10px", padding: "15px", boxShadow: "none", borderTop: "5px solid #0299FF" }}><p className="select">Customer Success Stories</p>
                                <div style={{ width: "100%", float: "right" }}>
                                    <Button style={{ backgroundColor: "#EEF5FF", width: "100%" }} onClick={() => setStage(1)}><ArrowForwardIcon style={{ color: "#006BFF", fontSize: "25px" }} /></Button>
                                </div>
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <Card style={{ border: "1.5px solid #DADADA", borderRadius: "10px", padding: "15px", boxShadow: "none", borderTop: "5px solid #0299FF" }}><p className="select">Customer Success Stories</p>
                                <div style={{ width: "100%", float: "right" }}>
                                    <Button style={{ backgroundColor: "#EEF5FF", width: "100%" }} onClick={() => setStage(1)}><ArrowForwardIcon style={{ color: "#006BFF", fontSize: "25px" }} /></Button>
                                </div>
                            </Card>
                        </Grid> */}
                        {/* <Grid item xs={6}>
                            <Paper style={{ border: "1.5px solid #DADADA", borderRadius: "10px", padding: "15px", boxShadow: "none" }}>xs=6</Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper style={{ border: "1.5px solid #DADADA", borderRadius: "10px", padding: "15px", boxShadow: "none" }}>xs=6</Paper>
                        </Grid> */}
                    </Grid>

                </div>
            </div> : <div style={{ margin: "auto", display: "flex", width: "fit-content", position: "absolute", top: 0, left: 0, right: 0, bottom: 0, marginTop: "80px", marginBottom: "50px" }} className="maincal">


                <div style={{ padding: "30px", width: "50vh" }}>
                    <Button style={{ backgroundColor: "#EEF5FF" }} onClick={() => {
                        history.push("/" + window.location.pathname.split("/")[1])
                        setStage(1)
                    }} > <ArrowBackIcon style={{ color: "#006BFF", fontSize: "25px" }} /></Button>
                    <div style={{ marginTop: "30px" }}>
                        <Avatar src="https://i.pinimg.com/280x280_RS/67/99/e1/6799e1b5122d4dfeb9acad3269828916.jpg" style={{ width: "70px", height: "70px" }} />
                        <p className="para4">{decodeURIComponent(window.location.pathname.split("/")[1])}</p>
                        <p className="para3">15 minute demo</p>
                    </div>
                    <div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <WatchLaterIcon style={{ color: "#484848", marginRight: "10px" }} />
                            <p className="para4">15min</p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <img src={zoom} style={{ width: "auto", height: "24px", marginRight: "10px" }} />
                            <p className="para4">Zoom Meeting</p>
                        </div>
                        <div>
                            <p className="para4">During these 15 minutes we will take you over the basics of our product, show your around the features and clear all your questions.</p>
                        </div>
                        {admin ? <div style={{ display: "flex", alignItems: "center", marginTop: "0px" }}>
                            <SettingsIcon style={{ color: "#484848", marginRight: "10px", fontSize: "20px" }} />
                            <p className="timezone">Settings</p>
                        </div> : <CircularProgress style={{ width: "20px", height: "20px", marginTop: "5px" }} />}
                    </div>

                </div>
                <Divider orientation="vertical" flexItem />
                <div style={{ padding: "20px" }} className="rightblock">
                    <p className="select">Select Date And Time</p>
                    <div style={{ display: "flex", alignItems: "center", marginTop: "0px", marginBottom: "20px" }}>
                        <div style={{ display: "flex" }}>
                            <TimelineDot style={{ backgroundColor: "#76baff", boxShadow: "none", marginTop: "13px", marginRight: "5px" }} />
                            <p className="timezone">Slots Available</p>
                        </div>
                        <div style={{ display: "flex" }}>
                            <TimelineDot style={{ backgroundColor: "#006BFF", boxShadow: "none", marginTop: "13px", marginRight: "5px", marginLeft: "15px" }} />
                            <p className="timezone">Selected Day</p>
                        </div>
                    </div>
                    <Calendar
                        onChange={onChange}
                        value={value}
                        showNeighboringMonth={false}
                        selectRange={false}
                        minDate={new Date()}
                        tileDisabled={({ activeStartDate, date, view }) => date.getDay() === 0}
                    />
                    {/* <DayTimePicker timeSlotSizeMinutes={15} /> */}
                    <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
                        <PublicIcon style={{ color: "#484848", marginRight: "10px", fontSize: "20px" }} />
                        <p className="timezone">{Intl.DateTimeFormat().resolvedOptions().timeZone + " " + new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/)[1]}</p>
                    </div>


                </div>
            </div>}
            <div style={{ display: "flex", width: "100%", margin: "auto", padding: "0px", backgroundColor: "#006BFF", justifyContent: "center", height: "40vh" }}>
                <div style={{ justifyContent: "center", display: "flex", verticalAlign: "middle" }}>
                    <FlashOnIcon style={{ color: "orange", fontSize: "25PX", marginTop: "30px" }} />
                    <p className="powered">by <span className="poweredlogo" onClick={() => history.push("/")}>UNIfy</span></p>
                </div>
            </div>

        </div>
    )
}
