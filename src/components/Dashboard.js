import React, {useEffect} from "react";
import Appbarmini from "./Appbarmini";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AddIcon from "@material-ui/icons/Add";
import Box from "@material-ui/core/Box";
import Events from "../components/Events";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import "../styles/dashboard.css";
import DateRangeIcon from "@material-ui/icons/DateRange";
import { useHistory } from "react-router-dom";
import ConfirmationNumberIcon from "@material-ui/icons/ConfirmationNumber";
import axios from "../configs/axios";
import jwt from 'jwt-decode'
import { Button } from "@material-ui/core";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "red",
  },
  customTabRoot: {
    color: "#1B1A1A",
    backgroundColor: "white",
  },
  customTabIndicator: {
    backgroundColor: "#100615",
  },
}));

function Dashboard() {
  const [sessions, setSessions] = React.useState([]);
  const [user, setUser] = React.useState({
    email: "",
    image: "",
    userName: "",
    _id: ""
});
  useEffect(() => {
    var token = localStorage.getItem("arcana-token");
    axios
      .post(
        "/session/sessions",
        null,
        {
          headers: {
            Authorization: `Bearer ` + token,
          },
        }
      ).then((res) => {
      setSessions(res.data.data);
    });
  }, []);

  useEffect(() => {
    let user = jwt(localStorage.getItem("arcana-token"))
    setUser(user)
}, [])
  const history = useHistory();
  const [value, setValue] = React.useState(0);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNav = (ev) => {
    if (ev === "event") {
      history.push("/u/nav/dashboard/events/create");
    } else {
    }
  };

  return (
    <div>
      <Appbarmini />
      <div className="mainhead">
        <div className="tabsdiv">
          {/* <p className="header">Dashboard</p>
                    <button className="createbtn" onClick={handleClick}> <AddIcon />Create Event</button> */}
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            getContentAnchorEl={null}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <MenuItem
              onClick={() => {
                handleNav("event");
              }}
              value="event"
            >
              <DateRangeIcon
                style={{
                  marginRight: "15px",
                  fontSize: "30px",
                  color: "#494849",
                }}
              />
              <div style={{ alignItems: "center" }}>
                <h1 className="dropdownitemone">Event Template</h1>
                <h1 className="dropdownitemtwo">Create a new event template</h1>
              </div>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleNav("one");
              }}
              value="one"
            >
              <ConfirmationNumberIcon
                style={{
                  marginRight: "15px",
                  fontSize: "30px",
                  color: "#494849",
                }}
              />
              <div style={{ alignItems: "center" }}>
                <h1 className="dropdownitemone">One Time Event</h1>
                <h1 className="dropdownitemtwo">Create a single use link</h1>
              </div>
            </MenuItem>
          </Menu>
        </div>
        <div>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Nav"
            classes={{
              root: classes.customTabRoot,
              indicator: classes.customTabIndicator,
            }}
            style={{ width: "fit-content" }}
          >
            <Tab
              label="Explore Sessions"
              {...a11yProps(0)}
              classes={{ root: classes.tab }}
              style={{ textTransform: "none" }}
            />
            <Tab
              label="My Sessions"
              {...a11yProps(1)}
              style={{ textTransform: "none" }}
            />
            {/* <Tab label="Triggers" {...a11yProps(2)} style={{ textTransform: "none" }} /> */}
          </Tabs>
        </div>
      </div>
      <TabPanel value={value} index={0} style={{ padding: "0px" }}>
        <Events />
        <div className="creator-spotlight" style={{ marginTop: 10 }}>
          <div className="creators-list">
            {sessions.map((session) => {
              return (
                <div className="session-card" style={{margin: 15}}>
                  <div
                    className="creator-card-session"
                    style={{
                      backgroundImage:
                        "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
                    }}
                  >
                    <p className="session-desc">
                      "{session.sessionName}"
                    </p>
                    <p className="session-desc">
                      {session.sessionDesc}
                    </p>
                    <p className="session-desc">
                      Scheduled for {new Date(session.date).toDateString()} at {session.startTime}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: 10,
                        backgroundColor: "white",
                      }}
                      className="creator-frost"
                    >
                      <img
                        src={
                          session.user.image
                        }
                        alt="creator"
                        className="creator-image"
                        style={{ height: 70, width: 70 }}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          flex: 1,
                          alignItems: "center",
                        }}
                      >
                        <h3 style={{ marginLeft: 15 }}>{session.user.userName}</h3>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <h3 style={{ marginRight: 15 }}>{session.fee} ETH/DAIx</h3>
                          {session.user._id === user._id ? (
                            <Button
                            variant="contained"
                            style={{
                              backgroundColor: "#100615",
                              color: "white",
                              borderRadius: 10,
                              width: 100,
                              height: 40,
                            }}
                          >
                            Join
                          </Button>
                          ): (
                            <Button
                            variant="contained"
                            style={{
                              backgroundColor: "#100615",
                              color: "white",
                              borderRadius: 10,
                              width: 100,
                              height: 40,
                            }}
                          >
                            Start
                          </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="session-card">
              {/* <div
                className="creator-card-session"
                style={{
                  backgroundImage:
                    "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
                }}
              >
                <p className="session-desc">"Learn how to decentralize any platform and make money off it"</p>
                <div style={{ display: "flex", alignItems: "center", padding: 10, backgroundColor: "white" }} className="creator-frost">
                <img
                  src={"https://unifychain.co/assets/images/artwork/25.jpg"}
                  alt="creator"
                  className="creator-image"
                  style={{height: 70 , width: 70}}
                />
                <div style={{display: "flex", justifyContent: "space-between", flex: 1, alignItems: "center"}}>
                <h3 style={{marginLeft: 15}}>Creator 1</h3>
                <p>test</p>
                </div>
              </div>
              </div> */}
              
            </div>
            {/* <div
              className="creator-card"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
              }}
            >
              <img
                src={"https://unifychain.co/assets/images/artwork/27.jpg"}
                alt="creator"
                className="creator-image"
              />
              <h3>Creator 2</h3>
              <p>Creator 2's description</p>
            </div> */}
            {/* <div
              className="creator-card"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)",
              }}
            >
              <img
                src={
                  "https://www.arabnews.com/sites/default/files/styles/n_670_395/public/2021/09/09/2802471-1141576147.jpg?itok=iBUxiaoP"
                }
                alt="creator"
                className="creator-image"
              />
              <h3>Creator 3</h3>
              <p>Creator 3's description</p>
            </div> */}
            {/* <div
              className="creator-card"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
              }}
            >
              <img
                src={"https://unifychain.co/assets/images/artwork/27.jpg"}
                alt="creator"
                className="creator-image"
              />
              <h3>Creator 2</h3>
              <p>Creator 2's description</p>
            </div> */}
            {/* <div
              className="creator-card"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)",
              }}
            >
              <img
                src={
                  "https://www.arabnews.com/sites/default/files/styles/n_670_395/public/2021/09/09/2802471-1141576147.jpg?itok=iBUxiaoP"
                }
                alt="creator"
                className="creator-image"
              />
              <h3>Creator 3</h3>
              <p>Creator 3's description</p>
            </div> */}
            {/* <div
              className="creator-card"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
              }}
            >
              <img
                src={"https://unifychain.co/assets/images/artwork/27.jpg"}
                alt="creator"
                className="creator-image"
              />
              <h3>Creator 2</h3>
              <p>Creator 2's description</p>
            </div> */}
            {/* <div
              className="creator-card"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)",
              }}
            >
              <img
                src={
                  "https://www.arabnews.com/sites/default/files/styles/n_670_395/public/2021/09/09/2802471-1141576147.jpg?itok=iBUxiaoP"
                }
                alt="creator"
                className="creator-image"
              />
              <h3>Creator 3</h3>
              <p>Creator 3's description</p>
            </div> */}
          </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </div>
  );
}

export default Dashboard;
