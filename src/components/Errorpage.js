import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom";
import error from "../images/error.png"
import "../styles/front.css"

function Errorpage() {
    const history = useHistory();
    useEffect(() => {
        document.title = "UNIfy: 404 "
    }, []);
    return (
        <div style={{ margin: "auto", width: "fit-content", justifyContent: "center", textAlign: "center" }}>
            <p className="logo">UNIfy</p>

            <img src={error} style={{ width: "auto", height: "150px", marginTop: "20px" }} />
            <p className="errheader">Whoops! We could not find this one</p>
            <p className="para">You need to be authenticated to perform this action, use the below button to go back home </p>
            <button className="errbutton" onClick={() => history.push("/")}>Back Home</button>
        </div>
    )
}

export default Errorpage