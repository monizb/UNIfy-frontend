import React, { useEffect, useState } from "react";
import { ColorRing } from "react-loader-spinner";
import useArcanaAuth from "../useArcanaAuth";
import "../styles/appbar.css";
import Logo from "./Logo";

function Main() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [account, setAccount] = useState("");

  const {
    initializeAuth,
    loggedIn,
    getAccounts,
    login,
    loginWithLink,
    logout,
    initialized,
  } = useArcanaAuth();

  const initialize = async () => {
    await initializeAuth();
  };

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    document.body.style.backgroundImage =
      "linear-gradient(90deg, #fdf4ea, #ffe8fa, #def3fe)";
    if (initialized) {
      if (loggedIn) {
        localStorage.setItem("arcana-auth", "true");
        window.location.href = "u/nav/onboarding";
      } else {
        setLoading(false);
      }
    }
    const loadDetails = async () => {
      if (initialized) {
        if (loggedIn) {
          const acc = await getAccounts();
          setAccount(acc[0]);
          setLoading(false);
          localStorage.setItem("arcana-auth", acc[0]);
          //call login api from backend and set auth token and then navigate to dashboard
          window.location.href = "u/nav/onboarding";
        } else {
          setLoading(false);
        }
      }
    };
    loadDetails();
  }, [initialized, loggedIn]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <div className="login-main">
      <Logo />
      <div className="login-box-main">
        {loading ? (
          <div className="loading">
            <ColorRing
              visible={true}
              height="100"
              width="80"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={["#000000"]}
            />
          </div>
        ) : !loading && loggedIn ? (
          <div>
            <h2 className="sub-heading">Logged In</h2>
            <h3>Welcome {account}</h3>
            <h3>you're logged in successfully.</h3>
            <button className="big-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="box">
            <h2 className="sub-heading">🔑 Select a login</h2>
            <div className="options">
              <button className="google" onClick={() => login("google")}>
                Google Login
              </button>
              <button className="twitch" onClick={() => login("twitch")}>
                Twitch Login
              </button>
              <button className="discord" onClick={() => login("discord")}>
                Discord Login
              </button>
              <button className="twitter" onClick={() => login("twitter")}>
                Twitter Login
              </button>
            </div>
            <div className="form" style={{ display: "flex" }}>
              <input
                value={email}
                type="text"
                placeholder="Enter email"
                onChange={handleEmailChange}
                className="email-box"
              />
              <button className="linkbtn" onClick={() => loginWithLink(email)}>
                Login with link
              </button>
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "center",
          marginTop: 15,
        }}
      >
        <p className="tip-style">Authentication powered by</p>
        <img
          style={{ height: 30 }}
          src="https://uploads-ssl.webflow.com/63aa7f8ce3b3be42ed4f4a3f/63cf80dcb09c327756ddb620_Black%20Logo-Transparent%20Backgroung-Horizontal.png"
        />
      </div>
    </div>
  );
}

export default Main;
