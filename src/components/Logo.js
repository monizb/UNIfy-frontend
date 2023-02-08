import React from 'react'
import "../styles/logo.css"

export default function Logo(props) {
    return (
        <div>
            <h1 className="logo-main" style={{fontSize: props.size || 60}}>UNIfy</h1>
        </div>
    )
}

