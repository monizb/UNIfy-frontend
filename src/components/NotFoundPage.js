import React, { useEffect } from 'react'
import { useHistory } from "react-router-dom";
import error from "../images/404.png"
import "../styles/front.css"

function NotFoundPage() {
    const history = useHistory();
    useEffect(() => {
        document.title = "UNIfy: 404 "
    }, []);
    return (
        <div style={{ margin: "auto", width: "fit-content", justifyContent: "center", textAlign: "center" }}>
            <p className="logo">UNIfy</p>

            <img src={error} style={{ width: "auto", height: "150px", marginTop: "20px" }} />
            <p className="errheader">Whoops! We could not find this one</p>
            <p className="para">Please check the link you have entered or return back home below</p>
            <button className="errbutton" onClick={() => history.push("/")}>Back Home</button>
        </div>
    )
}

export default NotFoundPage