import React, { useState, useEffect } from "react";
import Appbarmini from "./Appbarmini";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import PublicIcon from "@material-ui/icons/Public";
import Divider from "@material-ui/core/Divider";
import { firebaseAuth } from "../configs/firebase";
import Checkbox from "@material-ui/core/Checkbox";
import axios from "../configs/axios";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormGroup from "@material-ui/core/FormGroup";
import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import zoom from "../images/zoom.png";
import skype from "../images/skype.png";
import teams from "../images/teams2.png";
import cisco from "../images/cisco.png";
import person from "../images/person2.png";
import call from "../images/call.png";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import TimeRange from "react-time-range";
import moment from "moment";
import goto from "../images/goto.png";
import { CirclePicker } from "react-color";
import hangout from "../images/hangout.png";
import pencil from "../images/pencil2.png";
import meet from "../images/meet.svg";
import InputLabel from "@material-ui/core/InputLabel";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import "../styles/daterangepicker.css";
import "../styles/editor.css";
import TimezoneSelect from "react-timezone-select";
import { Backdrop, CircularProgress } from "@material-ui/core";
// import axios from "../configs/axios";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const BlueRadio = withStyles({
  root: {
    color: "#100615",
    "&$checked": {
      color: "#100615",
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const BlueCheckbox = withStyles({
  root: {
    color: "#100615",
    "&$checked": {
      color: "#100615",
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

function CreateEvent() {
  const history = useHistory();
  const [on, setOn] = useState(true);
  const [location, setLocation] = useState();
  const [slug, setSlug] = React.useState();
  const [custom, setCustom] = useState(false);
  const [available, setAvailable] = useState();
  const [description, setDescription] = useState();
  const [c_description, setCDescription] = useState();
  const [ecolor, setColor] = useState("#2396F3");
  const [link, setLink] = useState();
  const [stage, setStage] = useState(1);
  const [event, setEvent] = useState({
    sessionName: "",
    sessionDesc: "",
    duration: 0,
    fee: 0,
    date: "",
    startTime: "",
    wallet: ""
  });
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    select: {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#D1D0D1",
      },
      "& .MuiSelect-select": {
        display: "flex",
        alignItems: "center",
        padding: "15px",
      },
      "& .MuiSelect-select:focus": {
        borderColor: "#D1D0D1",
        backgroundColor: "white",
      },
    },
    customBadge: {
      backgroundColor: `${ecolor}`,
    },
  }));

  const classes = useStyles();

  // useEffect(() => {
  //   axios
  //     .get("/auth/user-events", {
  //       headers: {
  //         Authorization: `Bearer ` + firebaseAuth.currentUser.za,
  //       },
  //     })
  //     .then((res) => {
  //       if (res.data.received) {
  //         setSlug(res.data.admin_slug);
  //       }
  //     });
  // }, []);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [ceditorState, setCEditorState] = useState(EditorState.createEmpty());
  const [loading, setLoading] = useState(false);
  const onEditorStateChange = (editorState) => {
    return setEditorState(editorState);
  };

  const onCEditorStateChange = (ceditorState) => {
    return setCEditorState(ceditorState);
  };

  function handlelocationchange(name, event) {
    setLocation(event.target.value);
    if (event.target.value === "custom") {
      setCustom(true);
    } else {
      setCustom(false);
    }
    handleFormchange(name, event);
  }

  function nextStage() {
    console.log(event);
    if (event.location === "") {
      handleClick({ vertical: "bottom", horizontal: "center", open: true });
    } else {
      if (event.location === "custom") {
        if (
          event.name !== "" &&
          link !== undefined &&
          c_description !== undefined
        ) {
          setStage(2);
          window.scrollTo(0, 0);
        } else {
          handleClick({ vertical: "bottom", horizontal: "center", open: true });
        }
      } else {
        if (event.name !== "" && link !== undefined) {
          setStage(2);
          window.scrollTo(0, 0);
        } else {
          handleClick({ vertical: "bottom", horizontal: "center", open: true });
        }
      }
    }
  }

  async function createSession () {
    if (event.sessionName === "" || event.sessionDesc === "" || event.duration === "" || event.fee === "" || event.wallet === "") {
      handleClick({ vertical: "bottom", horizontal: "center", open: true });
    } else {
      setLoading(true);
      var token = localStorage.getItem("arcana-token");
      event.date = new Date(event.date)
      event.fee = parseFloat(event.fee)
      event.duration = parseInt(event.duration)
    await axios
      .post(
        "/session/create",
        event,
        {
          headers: {
            Authorization: `Bearer ` + token,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        alert("Session created successfully");
        window.location.replace("/u/nav/dashboard");
      }).catch((err) => {
        setLoading(false);
        alert("Something went wrong, please try again");
      });
    }
  }

  function handleFormchange(name, e) {
    event[name] = e.target.value.trim();
  }

  function handlecolorchange(color, event) {
    const hex = color.hex;
    setColor(hex);
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const [radio, setRadio] = React.useState("days");
  const [selectedTimezone, setSelectedTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [range, setRange] = useState([new Date(), new Date()]);
  const [days, setDays] = useState(60);
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

  const [duration, setDuration] = useState({
    duration: 15,
    type: "minutes",
  });
  const [slots, setSlots] = useState({
    sunday: {
      start: "2021-06-05T02:30:00.887Z",
      end: "2021-06-05T14:30:00.983Z",
    },
  });

  const handleDaysChange = (event) => {
    setDays(event.target.value);
  };

  const handleRadioValueChange = (event) => {
    setRadio(event.target.value);
  };

  const handleDurationMetricChange = (event) => {
    setDuration({ type: event.target.value });
  };

  const handleDurationChange = (event) => {
    setDuration({ duration: event.target.value, type: duration.type });
  };

  return (
    <div>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Appbarmini />
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          Please fill in all the fields marked with *
        </Alert>
      </Snackbar>
      <div
        style={{
          padding: "35px 200px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          style={{ backgroundColor: "#EEF5FF", padding: "10px" }}
          onClick={() => {
            history.push("/u/nav/dashboard");
          }}
        >
          {" "}
          <ArrowBackIcon style={{ color: "#100615", fontSize: "25px" }} />
        </Button>
        <h1 className="headercard">Add New Session</h1>
        {/* <FormControlLabel
                    control={<IOSSwitch checked={on} onChange={handleStatus} name="switchon" />}
                    label={on ? "Event: ON" : "Event: OFF"}
                /> */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <PublicIcon
            style={{ color: "#484848", marginRight: "10px", fontSize: "25px" }}
          />
          <p className="timezone">
            {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </p>
        </div>
      </div>
      {stage === 1 ? (
        <div>
          {/* <Divider /> */}
          <div style={{ padding: "35px 160px" }}>
            <div
              style={{
                boxShadow: "inset 0 0 0 1px #666a73",
                border: `2px solid ${ecolor}`,
                borderRadius: "3px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 40px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Badge
                    classes={{ badge: classes.customBadge }}
                    overlap="circle"
                    badgeContent="   "
                    style={{ marginRight: "25px" }}
                  ></Badge>

                  <p className="headercard">Session Details</p>
                </div>
              </div>
              <Divider />
              <div style={{ padding: "20px 40px" }}>
                <div>
                  <p className="headername2" style={{ fontSize: "15px" }}>
                    Session Name *
                  </p>
                  <input
                    type="text"
                    style={{
                      padding: "14px",
                      width: "51.5%",
                      borderRadius: "10px",
                      border: "1px solid #D1D0D1",
                    }}
                    className="headercard"
                    onChange={(e) => {
                      handleFormchange("sessionName", e);
                    }}
                  ></input>
                </div>
                <div>
                  <p className="headername2" style={{ fontSize: "15px" }}>
                    Sesison Description *
                  </p>
                  <input
                    type="text"
                    style={{
                      padding: "14px",
                      width: "51.5%",
                      borderRadius: "10px",
                      border: "1px solid #D1D0D1",
                    }}
                    className="headercard"
                    onChange={(e) => {
                      handleFormchange("sessionDesc", e);
                    }}
                  ></input>
                </div>
                <div>
                  <p className="headername2" style={{ fontSize: "15px" }}>
                    Sesison Date *
                  </p>
                  <input
                    type="date"
                    style={{
                      padding: "14px",
                      width: "51.5%",
                      borderRadius: "10px",
                      border: "1px solid #D1D0D1",
                    }}
                    className="headercard"
                    onChange={(e) => {
                      handleFormchange("date", e);
                    }}
                  ></input>
                </div>
                <div>
                  <p className="headername2" style={{ fontSize: "15px" }}>
                    Sesison Start Time *
                  </p>
                  <input
                    type="time"
                    style={{
                      padding: "14px",
                      width: "51.5%",
                      borderRadius: "10px",
                      border: "1px solid #D1D0D1",
                    }}
                    className="headercard"
                    onChange={(e) => {
                      handleFormchange("startTime", e);
                    }}
                  ></input>
                </div>
                <div>
                  <p className="headername2" style={{ fontSize: "15px" }}>
                    Session Duration (In Minutes) *
                  </p>
                  <input
                    type="number"
                    max={270}
                    style={{
                      padding: "14px",
                      width: "51.5%",
                      borderRadius: "10px",
                      border: "1px solid #D1D0D1",
                    }}
                    className="headercard"
                    onChange={(e) => {
                      handleFormchange("duration", e);
                    }}
                  ></input>
                </div>
                <div>
                  <p className="headername2" style={{ fontSize: "15px" }}>
                    Session Fees/ Attendee (In ETH) *
                  </p>
                  <input
                    type="number"
                    max={270}
                    style={{
                      padding: "14px",
                      width: "51.5%",
                      borderRadius: "10px",
                      border: "1px solid #D1D0D1",
                    }}
                    className="headercard"
                    onChange={(e) => {
                      handleFormchange("fee", e);
                    }}
                    step="any"
                  ></input>
                </div>
                <div>
                  <p className="headername2" style={{ fontSize: "15px" }}>
                    Wallet you want to receive the payments in *
                  </p>
                  <input
                    type="text"
                    max={270}
                    style={{
                      padding: "14px",
                      width: "51.5%",
                      borderRadius: "10px",
                      border: "1px solid #D1D0D1",
                    }}
                    className="headercard"
                    onChange={(e) => {
                      handleFormchange("wallet", e);
                    }}
                  ></input>
                </div>
              </div>
              <Divider />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 40px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                </div>
                <button className="sharebtn" onClick={createSession}>
                  Submit & Create
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {stage === 2 ? (
        <div>
          {/* <Divider /> */}
          <div style={{ padding: "35px 160px" }}>
            <div
              style={{
                boxShadow: "inset 0 0 0 1px #666a73",
                border: `2px solid ${ecolor}`,
                borderRadius: "3px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 40px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Badge
                    classes={{ badge: classes.customBadge }}
                    overlap="circle"
                    badgeContent="   "
                    style={{ marginRight: "25px" }}
                  ></Badge>

                  <p className="headercard">Step 2: Calendar Settings</p>
                </div>
                <button className="sharebtn" onClick={nextStage}>
                  Next
                </button>
              </div>
              <Divider />
              <div style={{ display: "flex" }}>
                <div style={{ padding: "10px 40px" }}>
                  <p className="headername2" style={{ fontSize: "15px" }}>
                    When can your clients book this meeting till?
                  </p>
                  <RadioGroup
                    aria-label="quiz"
                    name="quiz"
                    value={radio}
                    onChange={handleRadioValueChange}
                    style={{ marginTop: "25px" }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <BlueRadio value="days" />
                      <input
                        type="text"
                        style={{
                          padding: "14px",
                          width: "5%",
                          borderRadius: "10px",
                          border: "1px solid #D1D0D1",
                          marginRight: "12px",
                        }}
                        className="headercard"
                        value={days}
                        onChange={handleDaysChange}
                      ></input>{" "}
                      <p className="timezone" style={{ fontSize: "16px" }}>
                        calendar days into the future
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "15px",
                      }}
                    >
                      <BlueRadio value="range" />
                      <p className="timezone" style={{ fontSize: "16px" }}>
                        A specific date range
                      </p>
                      <DateRangePicker
                        minDate={new Date()}
                        rangeDivider="to"
                        onChange={setRange}
                        value={range}
                        showNeighboringMonth={false}
                      />{" "}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "15px",
                      }}
                    >
                      <BlueRadio value="infinite" />
                      <p className="timezone" style={{ fontSize: "16px" }}>
                        No specified range, anytime in the future
                      </p>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <Divider />
              <div style={{ padding: "10px 40px", width: "100%" }}>
                <p className="headername2" style={{ fontSize: "15px" }}>
                  Slot/Meeting Duration
                </p>

                <div
                  style={{
                    marginTop: "30px",
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <input
                    type="text"
                    style={{
                      padding: "14px",
                      width: "5%",
                      borderRadius: "10px",
                      border: "1px solid #D1D0D1",
                      marginRight: "12px",
                    }}
                    className="headercard"
                    value={duration.duration}
                    onChange={handleDurationChange}
                  ></input>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                    style={{ width: "25%", height: "50%" }}
                  >
                    {/* <InputLabel id="demo-simple-select-outlined-label">Location</InputLabel> */}
                    <Select
                      id="demo-simple-select-outlined"
                      value={duration.type}
                      // onChange={handleFromChange}
                      className={classes.select}
                      MenuProps={{
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left",
                        },
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "left",
                        },
                        menuStyle: {
                          border: "1px solid black",
                          borderRadius: "5%",
                          backgroundColor: "lightgrey",
                        },
                        getContentAnchorEl: null,
                      }}
                      onChange={(e) => handleDurationMetricChange(e)}
                    >
                      <MenuItem value={"minutes"}>
                        <div
                          style={{ padding: "0px 10px" }}
                          className="meetingname"
                        >
                          Minutes
                        </div>
                      </MenuItem>
                      <MenuItem value={"hours"}>
                        <div
                          style={{ padding: "0px 10px" }}
                          className="meetingname"
                        >
                          Hours
                        </div>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <Divider />
              <div style={{ padding: "10px 40px", width: "100%" }}>
                <p className="headername2" style={{ fontSize: "15px" }}>
                  Set Daywise Availability
                </p>
                <div
                  style={{
                    marginTop: "30px",
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      border: "1px solid #dadada",
                      borderRadius: "10px",
                      width: "85%",
                    }}
                  >
                    <div style={{ width: "40%", padding: "20px 30px" }}>
                      <p
                        className="timezone"
                        style={{ fontSize: "16px", paddingBottom: "15px" }}
                      >
                        TIME ZONE
                      </p>
                      <TimezoneSelect
                        value={selectedTimezone}
                        onChange={setSelectedTimezone}
                      />
                    </div>
                    <Divider />
                    {/* <div style={{ padding: "10px 30px", }}>
                                        <p className="headername2" style={{ fontSize: "15px" }}>Daywise Availability Hours</p>
                                        <div style={{ display: "flex", alignItems: "center", width: "32%", justifyContent: "space-between" }}>
                                            <p className="headername2" style={{ fontSize: "15px" }}>SUN</p>
                                            <TimeRange startLabel="" endLabel="-" sameIsValid={false} showErrors={false} onStartTimeChange={(e) => console.log(e)} value={slots.sunday.start} />
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", width: "32%", justifyContent: "space-between" }}>
                                            <p className="headername2" style={{ fontSize: "15px" }}>MON</p>
                                            <TimeRange startLabel="" endLabel="-" sameIsValid={false} showErrors={false} />
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", width: "32%", justifyContent: "space-between" }}>
                                            <p className="headername2" style={{ fontSize: "15px" }}>TUE</p>
                                            <TimeRange startLabel="" endLabel="-" sameIsValid={false} showErrors={false} />
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", width: "32%", justifyContent: "space-between" }}>
                                            <p className="headername2" style={{ fontSize: "15px" }}>WED</p>
                                            <TimeRange startLabel="" endLabel="-" sameIsValid={false} showErrors={false} />
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", width: "32%", justifyContent: "space-between" }}>
                                            <p className="headername2" style={{ fontSize: "15px" }}>THU</p>
                                            <TimeRange startLabel="" endLabel="-" sameIsValid={false} showErrors={false} />
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", width: "32%", justifyContent: "space-between" }}>
                                            <p className="headername2" style={{ fontSize: "15px" }}>FRI</p>
                                            <TimeRange startLabel="" endLabel="-" sameIsValid={false} showErrors={false} />
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", width: "32%", justifyContent: "space-between" }}>
                                            <p className="headername2" style={{ fontSize: "15px" }}>SAT</p>
                                            <TimeRange startLabel="" endLabel="-" sameIsValid={false} showErrors={false} />
                                        </div>

                                    </div> */}
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
                      {/* <p style={{ color: "#464646", margin: "25px" }}>{Intl.DateTimeFormat().resolvedOptions().timeZone + " " + new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/)[1]}</p> */}
                    </div>
                  </div>
                </div>
              </div>

              <Divider />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 40px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p className="headercard">Next: Done And Publish</p>
                </div>
                <button className="sharebtn" onClick={nextStage}>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default CreateEvent;
