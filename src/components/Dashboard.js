import React from 'react'
import Appbarmini from "./Appbarmini"
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AddIcon from '@material-ui/icons/Add';
import Box from '@material-ui/core/Box';
import Events from "../components/Events"
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import "../styles/dashboard.css"
import DateRangeIcon from '@material-ui/icons/DateRange';
import { useHistory } from "react-router-dom";
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';

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
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: "red"
    },
    customTabRoot: {
        color: "#1B1A1A",
        backgroundColor: "white",
    },
    customTabIndicator: {
        backgroundColor: "#006BFF"
    }
}));



function Dashboard() {
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
            history.push("/u/nav/dashboard/events/create")
        } else {

        }
    }

    return (
        <div>
            <Appbarmini />
            <div className="mainhead">
                <div className="tabsdiv">
                    <p className="header">Dashboard</p>
                    <button className="createbtn" onClick={handleClick}> <AddIcon />Create Event</button>
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
                        <MenuItem onClick={() => { handleNav("event") }} value="event">
                            <DateRangeIcon style={{ marginRight: "15px", fontSize: "30px", color: "#494849" }} />
                            <div style={{ alignItems: "center" }}>
                                <h1 className="dropdownitemone">Event Template</h1>
                                <h1 className="dropdownitemtwo">Create a new event template</h1>
                            </div>
                        </MenuItem>
                        <MenuItem onClick={() => { handleNav("one") }} value="one">
                            <ConfirmationNumberIcon style={{ marginRight: "15px", fontSize: "30px", color: "#494849" }} />
                            <div style={{ alignItems: "center" }}>
                                <h1 className="dropdownitemone">One Time Event</h1>
                                <h1 className="dropdownitemtwo">Create a single use link</h1>
                            </div>
                        </MenuItem>
                    </Menu>
                </div>
                <div>
                    <Tabs value={value} onChange={handleChange} aria-label="Nav" classes={{
                        root: classes.customTabRoot,
                        indicator: classes.customTabIndicator
                    }} style={{ width: "fit-content" }}>
                        <Tab label="Card Types" {...a11yProps(0)} classes={{ root: classes.tab }} style={{ textTransform: "none" }} />
                        <Tab label="Scheduled Events" {...a11yProps(1)} style={{ textTransform: "none" }} />
                        <Tab label="Triggers" {...a11yProps(2)} style={{ textTransform: "none" }} />
                    </Tabs>
                </div>
            </div>
            <TabPanel value={value} index={0} style={{ padding: "0px" }}>
                <Events />
            </TabPanel>
            <TabPanel value={value} index={1}>
                Item Two
      </TabPanel>
            <TabPanel value={value} index={2}>
                Item Three
      </TabPanel>
        </div>
    )
}

export default Dashboard
