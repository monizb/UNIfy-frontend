import React, { useState, useEffect, useContext } from "react";
import Appbarmini from "./Appbarmini";
import Card from "@material-ui/core/Card";
import calendar from "../images/calendar.png";
import time from "../images/time.png";
import TextField from "@material-ui/core/TextField";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import axios from "../configs/axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import { firebaseAuth } from "../configs/firebase";
import Divider from "@material-ui/core/Divider";
import Backdrop from "@material-ui/core/Backdrop";
import { Context } from "../Store";
import Checkbox from "@material-ui/core/Checkbox";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FormGroup from "@material-ui/core/FormGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useWindowSize } from "react-use";
import { useHistory } from "react-router-dom";
import Confetti from "react-confetti";
import "../styles/front.css";
import { average } from 'color.js'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  select: {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#100615",
    },
  },
}));

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
    width: "20%",
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#1a90ff",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))(LinearProgress);

const BlueCheckbox = withStyles({
  root: {
    color: "#100615",
    "&$checked": {
      color: "#100615",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export default function Onboarding() {
  const [stage, setStage] = useState(0);
  const [state, setState] = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [screen, setScreen] = useState(1);
  const history = useHistory();
  useEffect(() => {
    async function getStage() {
      setLoading(true);
      firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
          console.log(state);
          axios
            .get("/auth/get-stage", {
              headers: {
                Authorization: `Bearer ` + firebaseAuth.currentUser.za,
              },
            })
            .then((data) => {
              if (data.data.onboarded === false) {
                setLoading(false);
                setStage(data.data.stage);
                if (data.data.username !== undefined) {
                  setUsername(data.data.username);
                }
              } else if (data.data.onboarded === true) {
                history.push("/u/nav/Dashboard");
              }
            });
        }
      });
    }
    // getStage();
  }, []);
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [available, setAvailable] = useState();

  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");

  const [day, setDay] = React.useState({
    sunday: false,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
  });

  const handleDayChange = (event) => {
    setDay({ ...day, [event.target.name]: event.target.checked });
  };

  const { sunday, monday, tuesday, wednesday, thursday, friday, saturday } =
    day;
  const error =
    [sunday, monday, tuesday, wednesday, thursday, friday, saturday].filter(
      (v) => v
    ).length === 0;

  const handleFromChange = (event) => {
    setFrom(event.target.value);
  };

  const handleToChange = (event) => {
    setTo(event.target.value);
  };

  async function handleChange(e) {
    var token = await firebaseAuth.currentUser.getIdToken();
    axios
      .get("/auth/check-username-validity?username=" + e, {
        headers: {
          Authorization: `Bearer ` + token,
        },
      })
      .then((res) => {
        if (!res.data.available) {
          setAvailable(true);
        } else {
          setAvailable(false);
          setUsername(res.data.username);
        }
      });
  }

  Object.filter = (obj, predicate) =>
    Object.keys(obj)
      .filter((key) => predicate(obj[key]))
      .reduce((res, key) => ((res[key] = obj[key]), res), {});

  async function completeOnboarding() {
    setLoading(true);
    var token = await firebaseAuth.currentUser.getIdToken();
    axios
      .post(
        "/auth/set-user",
        {
          username: username,
          timezone:
            Intl.DateTimeFormat().resolvedOptions().timeZone +
            " " +
            new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/)[1],
        },
        {
          headers: {
            Authorization: `Bearer ` + token,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          setStage(2);
        }
      });
  }

  async function setAvailability() {
    setLoading(true);
    var token = await firebaseAuth.currentUser.getIdToken();
    var filtered = Object.filter(day, (score) => score === true);
    axios
      .post(
        "/auth/set-user-availability",
        {
          days: Object.keys(filtered),
          from: from,
          to: to,
        },
        {
          headers: {
            Authorization: `Bearer ` + token,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        if (res.data.updated) {
          setStage(3);
        }
      });
  }

  const { width, height } = useWindowSize();

  return (
    <div>
      <Appbarmini />
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {screen === 1 ? (
        <div className="creator-spotlight">
          <h2>✨ Creator Spotlight</h2>
          <p>
            Welcome to UNIfy, discover great content creators below or become
            one yourself!
          </p>
          <div className="creators-list">
            <div
              className="creator-card"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
              }}
            >
              <img
                src={"https://unifychain.co/assets/images/artwork/25.jpg"}
                alt="creator"
                className="creator-image"
              />
              <h3>Creator 1</h3>
              <p>Creator 1's description</p>
            </div>
            <div
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
            </div>
            <div
              className="creator-card"
              style={{
                backgroundImage: "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)"
              }}
            >
              <img
                src={"https://www.arabnews.com/sites/default/files/styles/n_670_395/public/2021/09/09/2802471-1141576147.jpg?itok=iBUxiaoP"}
                alt="creator"
                className="creator-image"
              />
              <h3>Creator 3</h3>
              <p>Creator 3's description</p>
            </div>
            <div
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
            </div>
            <div
              className="creator-card"
              style={{
                backgroundImage: "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)"
              }}
            >
              <img
                src={"https://www.arabnews.com/sites/default/files/styles/n_670_395/public/2021/09/09/2802471-1141576147.jpg?itok=iBUxiaoP"}
                alt="creator"
                className="creator-image"
              />
              <h3>Creator 3</h3>
              <p>Creator 3's description</p>
            </div>
            <div
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
            </div>
            <div
              className="creator-card"
              style={{
                backgroundImage: "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)"
              }}
            >
              <img
                src={"https://www.arabnews.com/sites/default/files/styles/n_670_395/public/2021/09/09/2802471-1141576147.jpg?itok=iBUxiaoP"}
                alt="creator"
                className="creator-image"
              />
              <h3>Creator 3</h3>
              <p>Creator 3's description</p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: stage === 1 ? null : "none" }}>
            <Card
              style={{
                width: "fit-content",
                margin: "auto",
                marginTop: "30px",
                boxShadow: "none",
                border: "1.5px solid #DADADA",
                padding: "0px",
              }}
            >
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "25px",
                  }}
                >
                  <div>
                    <h1
                      style={{
                        fontSize: "20px",
                        fontWeight: 550,
                        color: "#1A1A1A",
                      }}
                      className="tag"
                    >
                      Welcome to Califix!
                    </h1>
                    <p style={{ width: "500px", color: "#464646" }}>
                      Its now time for you to choose a personalized link for
                      your calendar so that its easy for everyone to find it,
                      this name is usually your organization or your own name
                    </p>
                  </div>
                  <img
                    src={calendar}
                    style={{
                      width: "auto",
                      height: "150px",
                      marginLeft: "70px",
                    }}
                  />
                </div>
                <hr style={{ borderTop: "1.5px solid #DADADA" }} />
                <div
                  style={{
                    alignItems: "center",
                    paddingTop: "20px",
                    paddingLeft: "30px",
                    paddingRight: "30px",
                    paddingBottom: "10px",
                  }}
                >
                  <h1
                    style={{
                      fontSize: "20px",
                      fontWeight: 550,
                      color: "#1A1A1A",
                    }}
                    className="tag"
                  >
                    Select your link
                  </h1>
                  <p style={{ color: "#464646" }}>
                    Choose an url which is easy to remember so that you can
                    easily share it with others
                  </p>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      error={available}
                      id="outlined-basic"
                      label={
                        "https://" +
                        window.location.hostname +
                        "/your-unique-name"
                      }
                      variant="outlined"
                      style={{
                        width: "100%",
                        marginTop: "20px",
                        borderRadius: "0px",
                      }}
                      onChange={(e) => handleChange(e.target.value)}
                    />
                  </div>
                  {available === false ? (
                    <p style={{ color: "#00AF00" }}>
                      &#9989; This name is available
                    </p>
                  ) : available === true ? (
                    <p style={{ color: "#F44335" }}>
                      &#10060; This name is not available
                    </p>
                  ) : null}
                  <p style={{ color: "#464646" }}>
                    {Intl.DateTimeFormat().resolvedOptions().timeZone +
                      " " +
                      new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/)[1]}
                  </p>
                </div>
              </CardContent>
              {/* <CardActions>
                    <Button size="small">Learn More</Button>
                </CardActions> */}
            </Card>
            <div
              style={{
                width: "50%",
                margin: "auto",
                boxShadow: "none",
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
                alignItems: "center",
              }}
            >
              <BorderLinearProgress variant="determinate" value={33} />
              <button
                style={{
                  backgroundColor: "#100615",
                  border: "none",
                  borderRadius: "1000px",
                  color: "white",
                  fontWeight: "500",
                  padding: "13px 20px",
                  cursor: "pointer",
                }}
                class="continue"
                disabled={available === undefined || available}
                onClick={completeOnboarding}
              >
                Next: Set Availability
              </button>
            </div>
          </div>
          <div style={{ display: stage === 2 ? null : "none" }}>
            <Card
              style={{
                width: "fit-content",
                margin: "auto",
                marginTop: "30px",
                boxShadow: "none",
                border: "1.5px solid #DADADA",
                padding: "0px",
              }}
            >
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "25px",
                  }}
                >
                  <div>
                    <h1
                      style={{
                        fontSize: "20px",
                        fontWeight: 550,
                        color: "#1A1A1A",
                      }}
                      className="tag"
                    >
                      Set your availability
                    </h1>
                    <p style={{ width: "500px", color: "#464646" }}>
                      Now, tell us the times during which your are typically
                      available to accept a meeting/booking. Don't worry your
                      choice is not permanent, you can change these settings
                      anytime from your calendar settings
                    </p>
                  </div>
                  <img
                    src={time}
                    style={{
                      width: "auto",
                      height: "130px",
                      marginLeft: "70px",
                    }}
                  />
                </div>
                <hr style={{ borderTop: "1.5px solid #DADADA" }} />
                <div>
                  <div
                    style={{
                      display: "flex",
                      margin: "auto",
                      alignItems: "center",
                      paddingTop: "20px",
                      paddingLeft: "30px",
                      paddingRight: "30px",
                      paddingBottom: "10px",
                    }}
                  >
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                      style={{ width: "45%", height: "50%" }}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        From
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={from}
                        onChange={handleFromChange}
                        label="Age"
                        className={classes.select}
                      >
                        <MenuItem value={"00:00"}>12:00 a.m</MenuItem>
                        <MenuItem value={"01:00"}>1:00 a.m</MenuItem>
                        <MenuItem value={"02:00"}>2:00 a.m</MenuItem>
                        <MenuItem value={"03:00"}>3:00 a.m</MenuItem>
                        <MenuItem value={"04:00"}>4:00 a.m</MenuItem>
                        <MenuItem value={"05:00"}>5:00 a.m</MenuItem>
                        <MenuItem value={"06:00"}>6:00 a.m</MenuItem>
                        <MenuItem value={"07:00"}>7:00 a.m</MenuItem>
                        <MenuItem value={"08:00"}>8:00 a.m</MenuItem>
                        <MenuItem value={"09:00"}>9:00 a.m</MenuItem>
                        <MenuItem value={"10:00"}>10:00 a.m</MenuItem>
                        <MenuItem value={"11:00"}>11:00 a.m</MenuItem>
                        <MenuItem value={"12:00"}>12:00 p.m</MenuItem>
                        <MenuItem value={"13:00"}>1:00 p.m</MenuItem>
                        <MenuItem value={"14:00"}>2:00 p.m</MenuItem>
                        <MenuItem value={"15:00"}>3:00 p.m</MenuItem>
                        <MenuItem value={"16:00"}>4:00 p.m</MenuItem>
                        <MenuItem value={"17:00"}>5:00 p.m</MenuItem>
                        <MenuItem value={"18:00"}>6:00 p.m</MenuItem>
                        <MenuItem value={"19:00"}>7:00 p.m</MenuItem>
                        <MenuItem value={"20:00"}>8:00 p.m</MenuItem>
                        <MenuItem value={"21:00"}>9:00 p.m</MenuItem>
                        <MenuItem value={"22:00"}>10:00 p.m</MenuItem>
                        <MenuItem value={"23:00"}>11:00 p.m</MenuItem>
                      </Select>
                    </FormControl>
                    <p
                      style={{
                        fontSize: "25px",
                        margin: "15px",
                        color: "grey",
                      }}
                    >
                      -
                    </p>
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                      style={{ width: "45%", height: "50%" }}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        To
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={to}
                        onChange={handleToChange}
                        label="Age"
                        className={classes.select}
                      >
                        <MenuItem value={"00:00"}>12:00 a.m</MenuItem>
                        <MenuItem value={"01:00"}>1:00 a.m</MenuItem>
                        <MenuItem value={"02:00"}>2:00 a.m</MenuItem>
                        <MenuItem value={"03:00"}>3:00 a.m</MenuItem>
                        <MenuItem value={"04:00"}>4:00 a.m</MenuItem>
                        <MenuItem value={"05:00"}>5:00 a.m</MenuItem>
                        <MenuItem value={"06:00"}>6:00 a.m</MenuItem>
                        <MenuItem value={"07:00"}>7:00 a.m</MenuItem>
                        <MenuItem value={"08:00"}>8:00 a.m</MenuItem>
                        <MenuItem value={"09:00"}>9:00 a.m</MenuItem>
                        <MenuItem value={"10:00"}>10:00 a.m</MenuItem>
                        <MenuItem value={"11:00"}>11:00 a.m</MenuItem>
                        <MenuItem value={"12:00"}>12:00 p.m</MenuItem>
                        <MenuItem value={"13:00"}>1:00 p.m</MenuItem>
                        <MenuItem value={"14:00"}>2:00 p.m</MenuItem>
                        <MenuItem value={"15:00"}>3:00 p.m</MenuItem>
                        <MenuItem value={"16:00"}>4:00 p.m</MenuItem>
                        <MenuItem value={"17:00"}>5:00 p.m</MenuItem>
                        <MenuItem value={"18:00"}>6:00 p.m</MenuItem>
                        <MenuItem value={"19:00"}>7:00 p.m</MenuItem>
                        <MenuItem value={"20:00"}>8:00 p.m</MenuItem>
                        <MenuItem value={"21:00"}>9:00 p.m</MenuItem>
                        <MenuItem value={"22:00"}>10:00 p.m</MenuItem>
                        <MenuItem value={"23:00"}>11:00 p.m</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl required error={error}>
                      <FormGroup
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          border: "1.5px solid #DADADA",
                          padding: "0px",
                          justifyContent: "space-between",
                          margin: "25px",
                          borderRadius: "10px",
                        }}
                      >
                        <FormControlLabel
                          control={
                            <BlueCheckbox
                              checked={sunday}
                              onChange={handleDayChange}
                              name="sunday"
                            />
                          }
                          label="Sunday"
                          labelPlacement="bottom"
                        />
                        <Divider orientation="vertical" flexItem />
                        <FormControlLabel
                          control={
                            <BlueCheckbox
                              checked={monday}
                              onChange={handleDayChange}
                              name="monday"
                            />
                          }
                          label="Monday"
                          labelPlacement="bottom"
                        />
                        <Divider orientation="vertical" flexItem />
                        <FormControlLabel
                          control={
                            <BlueCheckbox
                              checked={tuesday}
                              onChange={handleDayChange}
                              name="tuesday"
                            />
                          }
                          label="Tuesday"
                          labelPlacement="bottom"
                        />
                        <Divider orientation="vertical" flexItem />
                        <FormControlLabel
                          control={
                            <BlueCheckbox
                              checked={wednesday}
                              onChange={handleDayChange}
                              name="wednesday"
                            />
                          }
                          label="Wednesday"
                          labelPlacement="bottom"
                        />
                        <Divider orientation="vertical" flexItem />
                        <FormControlLabel
                          control={
                            <BlueCheckbox
                              checked={thursday}
                              onChange={handleDayChange}
                              name="thursday"
                            />
                          }
                          label="Thursday"
                          labelPlacement="bottom"
                        />
                        <Divider orientation="vertical" flexItem />
                        <FormControlLabel
                          control={
                            <BlueCheckbox
                              checked={friday}
                              onChange={handleDayChange}
                              name="friday"
                            />
                          }
                          label="Friday"
                          labelPlacement="bottom"
                        />
                        <Divider orientation="vertical" flexItem />
                        <FormControlLabel
                          control={
                            <BlueCheckbox
                              checked={saturday}
                              onChange={handleDayChange}
                              name="saturday"
                            />
                          }
                          label="Saturday"
                          labelPlacement="bottom"
                        />
                      </FormGroup>
                      <FormHelperText
                        style={{
                          marginLeft: "25px",
                          display: error ? null : "none",
                        }}
                      >
                        Hmm.Please select atleast one day
                      </FormHelperText>
                    </FormControl>
                    <p style={{ color: "#464646", margin: "25px" }}>
                      {Intl.DateTimeFormat().resolvedOptions().timeZone +
                        " " +
                        new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/)[1]}
                    </p>
                  </div>
                </div>
              </CardContent>
              {/* <CardActions>
                    <Button size="small">Learn More</Button>
                </CardActions> */}
            </Card>
            <div
              style={{
                width: "50%",
                margin: "auto",
                boxShadow: "none",
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
                alignItems: "center",
              }}
            >
              <BorderLinearProgress variant="determinate" value={66} />
              <button
                style={{
                  backgroundColor: "#100615",
                  border: "none",
                  borderRadius: "1000px",
                  color: "white",
                  fontWeight: "500",
                  padding: "13px 20px",
                  cursor: "pointer",
                }}
                class="continue"
                onClick={setAvailability}
              >
                Finish
              </button>
            </div>
          </div>
          <div style={{ display: stage === 3 ? null : "none" }}>
            <Confetti
              width={width}
              height={height}
              numberOfPieces={100}
              recycle={false}
              run={stage == 3}
            />
            <Card
              style={{
                width: "fit-content",
                margin: "auto",
                marginTop: "30px",
                boxShadow: "none",
                border: "1.5px solid #DADADA",
                padding: "0px",
              }}
            >
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "25px",
                  }}
                >
                  <div>
                    <h1
                      style={{
                        fontSize: "20px",
                        fontWeight: 550,
                        color: "#1A1A1A",
                      }}
                      className="tag"
                    >
                      Congratulations!!
                    </h1>
                    <p style={{ width: "500px", color: "#464646" }}>
                      You have successfully created your very own personalized
                      calendar link! Now you can easily share this calendar with
                      others and let those bookings roll in!
                    </p>
                  </div>
                  <img
                    src={calendar}
                    style={{
                      width: "auto",
                      height: "150px",
                      marginLeft: "70px",
                    }}
                  />
                </div>
                <hr style={{ borderTop: "1.5px solid #DADADA" }} />
                <div
                  style={{
                    alignItems: "center",
                    paddingTop: "20px",
                    paddingLeft: "30px",
                    paddingRight: "30px",
                    paddingBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#F2F2F2",
                      padding: "5px 25px",
                      borderRadius: "10px",
                      textAlign: "center",
                      fontWeight: "600",
                    }}
                  >
                    <p style={{ color: "#100615" }}>
                      {"https://" + window.location.hostname + "/" + username}
                    </p>
                  </div>
                  <p style={{ color: "#464646" }}>
                    {Intl.DateTimeFormat().resolvedOptions().timeZone +
                      " " +
                      new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/)[1]}
                  </p>
                </div>
              </CardContent>
              {/* <CardActions>
                    <Button size="small">Learn More</Button>
                </CardActions> */}
            </Card>
            <div
              style={{
                width: "50%",
                margin: "auto",
                boxShadow: "none",
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
                alignItems: "center",
              }}
            >
              <BorderLinearProgress variant="determinate" value={100} />
              <button
                style={{
                  backgroundColor: "#100615",
                  border: "none",
                  borderRadius: "1000px",
                  color: "white",
                  fontWeight: "500",
                  padding: "13px 20px",
                  cursor: "pointer",
                }}
                class="continue"
                onClick={() => history.push("/u/nav/Dashboard")}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
