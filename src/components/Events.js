
import React, { useContext, useEffect } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import Avatar from "@material-ui/core/Avatar";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Context } from "../Store";
import "../styles/events.css"
import axios from "../configs/axios"
import Divider from '@material-ui/core/Divider';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import { firebaseAuth } from "../configs/firebase";
import SettingsIcon from '@material-ui/icons/Settings';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import FilterNoneIcon from '@material-ui/icons/FilterNone';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
        position: "absolute"
    },
    parent: {
        position: "relative",
        width: "100%",
        height: 200,
        backgroundColor: "white",
        zIndex: 0,
    }
}));

const BlueCheckbox = withStyles({
    root: {
        color: "#100615",
        '&$checked': {
            color: "#100615",
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

function Events() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [state, setState] = useContext(Context);
    const [events, setEvents] = React.useState([]);
    const [slug, setSlug] = React.useState();

    useEffect(() => {
        axios.get('/auth/user-events', {
            headers: {
                'Authorization': `Bearer ` + firebaseAuth.currentUser.za
            }
        }).then(res => {
            if (res.data.received) {
                setEvents(res.data.events);
                setSlug(res.data.admin_slug)
            }
        })
    }, [])

    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };
    return (
        <div>
            <Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className={classes.parent}>
                <div className="searchheader">
                    <div className="avatarside">
                        <Avatar src={localStorage.getItem("photo_url")}></Avatar>
                        <div style={{ margin: "15px" }}>
                            <h1 className="headername2">{localStorage.getItem("name")}<br /><span className="calendlink"><a target="blank" href={window.location.origin + "/" + slug} style={{ textDecoration: "none", color: "#100615" }}>{"https://" + window.location.hostname + "/" + slug}</a></span></h1>
                        </div>
                    </div>

                    <button className="addbtn">Add Event</button>
                </div>
                <div className="divider" >
                    <Divider />
                </div>
                <div className="">
                    <Grid container spacing={4} sm={10} style={{ margin: "auto", textAlign: "left" }}>
                        {events.map(event => {
                            return (
                                <Grid item xs={4}>
                                    <div className="indevent" style={{ borderTop: `7px solid ${event.color}` }} >
                                        <div style={{ padding: "10px 15px 0px 15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <FormControlLabel
                                                control={<BlueCheckbox checked={false} name="sunday" />}
                                            />
                                            <div>
                                                <SettingsIcon style={{ color: "#464746", fontSize: "20px" }} />
                                                <DragIndicatorIcon style={{ color: "#464746", fontSize: "20px", marginLeft: "5px" }} />
                                            </div>
                                        </div>
                                        <div style={{ padding: "0px 15px 15px 15px" }}>
                                            <h1 className="headercard">{event.title}</h1>
                                            <h1 className="subheadercard">{event.length_text + ",One-on-one meeting"}</h1>
                                            <button className="viewbtn">View Page</button>
                                        </div>
                                        <Divider />
                                        <div style={{ padding: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <FilterNoneIcon style={{ color: "#100615", marginRight: "5px", fontSize: "15px" }} />
                                                <p className="copytext">Copy Link</p>
                                            </div>
                                            <button className="sharebtn">Share</button>
                                        </div>
                                    </div>
                                </Grid>
                            )
                        })}
                    </Grid>
                </div>

            </div>
        </div>
    )
}

export default Events
