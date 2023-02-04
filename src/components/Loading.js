import React from 'react'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import "../styles/front.css"
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
        backgroundColor: "white",
        opacity: 0
    },
}));

function Loading() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    return (
        <div>
            <Backdrop className={classes.backdrop} open={open}>
                <CircularProgress color="#006BFF" style={{ color: "#006BFF" }} />
            </Backdrop>
        </div>
    )
}

export default Loading
