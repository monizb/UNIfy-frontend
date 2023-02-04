import React from 'react'
import blastoff from "../images/blastoff.png"
import achieve from "../images/achieve.png"
import mail from "../images/mail.png"
import gcal from "../images/gcal.png"
import sms from "../images/sms.png"
import zoom from "../images/zoom.png"
import slack from "../images/slack.png"
import paypal from "../images/paypal.jpeg"
import "../styles/front.css"
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(1.5),
        display: "flex",
        alignItems: "center",
        textAlign: 'center',
        margin: "auto",
        color: theme.palette.text.secondary,
    },
}));

export default function Frontpage() {
    const classes = useStyles();
    return (
        <div>
            <div style={{ display: "flex", }}>
                <div style={{ padding: "50px" }}>
                    <h1 style={{ marginLeft: "50px", marginBottom: "30px", fontSize: "80px", fontWeight: 5000 }} className="tag">Give wings <br /> to your <br /> <span className="textemp">business</span> </h1>
                    <p className="para">With UNIfy, easily schedule meetings, run integrations, manage tasks, collaborate with your team and leave all the heavy lifting on us</p>
                    <button class="button"><span>Sign Up </span></button>
                </div >
                <img src={blastoff} style={{ width: "auto", height: "800px", marginLeft: "50px", padding: 0 }} />
            </div >
            <div style={{ display: "flex", backgroundColor: "#4d97ff" }}>
                <div style={{ padding: "50px" }}>
                    <h1 style={{ marginLeft: "50px", marginBottom: "30px", fontSize: "80px", fontWeight: 5000 }} className="tag2">Achieve more <br /> with less <br /> </h1>
                    <p className="para2">Focus on what's important to you. Run automated integrations, streamline processes, simplify schedulings </p>
                    <Grid container spacing={3} style={{ marginLeft: "50px", marginTop: "50px" }}>
                        <Grid item xs={5}>
                            <Paper className={classes.paper}><img src={mail} style={{ width: "auto", height: "30px" }} /> <p style={{ color: "black", marginLeft: "20px", fontWeight: 600 }}>Automatic Email Triggers</p></Paper>
                        </Grid>
                        <Grid item xs={5}>
                            <Paper className={classes.paper}><img src={gcal} style={{ width: "auto", height: "37px" }} /> <p style={{ color: "black", marginLeft: "20px", fontWeight: 600 }}>Calendar Integrations</p></Paper>
                        </Grid>
                        <Grid item xs={5}>
                            <Paper className={classes.paper}><img src={sms} style={{ width: "auto", height: "37px" }} /> <p style={{ color: "black", marginLeft: "20px", fontWeight: 600 }}>Text-based Notifications</p></Paper>
                        </Grid>
                        <Grid item xs={5}>
                            <Paper className={classes.paper}><img src={zoom} style={{ width: "auto", height: "40px" }} /> <p style={{ color: "black", marginLeft: "20px", fontWeight: 600 }}>Auto Link Generation</p></Paper>
                        </Grid>
                        <Grid item xs={5}>
                            <Paper className={classes.paper}><img src={slack} style={{ width: "auto", height: "37px" }} /> <p style={{ color: "black", marginLeft: "20px", fontWeight: 600 }}>Slack Channel Notifications</p></Paper>
                        </Grid>
                        <Grid item xs={5}>
                            <Paper className={classes.paper}><img src={paypal} style={{ width: "auto", height: "37px" }} /> <p style={{ color: "black", marginLeft: "20px", fontWeight: 600 }}>Easily Accept Payments</p></Paper>
                        </Grid>
                    </Grid>
                </div >
                <img src={achieve} style={{ width: "auto", height: "800px", marginRight: "50px", padding: 0, marginTop: "30px", marginLeft: "20px" }} />
            </div >
            {/* <div>
                <Timeline align="alternate">
                    <TimelineItem>
                        <TimelineOppositeContent>
                            <Typography variant="body2" color="textSecondary">
                                9:30 am
          </Typography>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <Paper className={classes.paper}><img src={mail} style={{ width: "auto", height: "30px" }} /> <p style={{ color: "black", marginLeft: "20px", fontWeight: 600 }}>Automatic Email Triggers</p></Paper>
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Paper elevation={3} className={classes.paper}>
                                <Typography variant="h6" component="h1">
                                    Eat
            </Typography>
                                <Typography>Because you need strength</Typography>
                            </Paper>
                        </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineOppositeContent>
                            <Typography variant="body2" color="textSecondary">
                                10:00 am
          </Typography>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot color="primary">
                                <Paper className={classes.paper}><img src={mail} style={{ width: "auto", height: "30px" }} /> <p style={{ color: "black", marginLeft: "20px", fontWeight: 600 }}>Automatic Email Triggers</p></Paper>
                            </TimelineDot>
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Paper elevation={3} className={classes.paper}>
                                <Typography variant="h6" component="h1">
                                    Code
            </Typography>
                                <Typography>Because it&apos;s awesome!</Typography>
                            </Paper>
                        </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot color="primary" variant="outlined">
                                <Paper className={classes.paper}><img src={mail} style={{ width: "auto", height: "30px" }} /> <p style={{ color: "black", marginLeft: "20px", fontWeight: 600 }}>Automatic Email Triggers</p></Paper>
                            </TimelineDot>
                            <TimelineConnector className={classes.secondaryTail} />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Paper elevation={3} className={classes.paper}>
                                <Typography variant="h6" component="h1">
                                    Sleep
            </Typography>
                                <Typography>Because you need rest</Typography>
                            </Paper>
                        </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineSeparator>
                            <TimelineDot color="secondary">
                                <Paper className={classes.paper}><img src={mail} style={{ width: "auto", height: "30px" }} /> <p style={{ color: "black", marginLeft: "20px", fontWeight: 600 }}>Automatic Email Triggers</p></Paper>
                            </TimelineDot>
                        </TimelineSeparator>
                        <TimelineContent>
                            <Paper elevation={3} className={classes.paper}>
                                <Typography variant="h6" component="h1">
                                    Repeat
            </Typography>
                                <Typography>Because this is the life you love!</Typography>
                            </Paper>
                        </TimelineContent>
                    </TimelineItem>
                </Timeline>

            </div> */}
        </div>
    )
}
