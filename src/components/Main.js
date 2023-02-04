import React, { useContext, useEffect } from 'react';
import { Context } from "../Store"
import Frontpage from "./Frontpage"
import Appbar from "./Appbar"

function Main() {
    const [state, setState] = useContext(Context);
    useEffect(() => {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }, []);
    return (
        <div>
            <Appbar />
            <Frontpage />
        </div>
    );
}

export default Main