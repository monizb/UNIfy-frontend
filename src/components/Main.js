import React, { useEffect, useState } from "react";
import { ColorRing } from "react-loader-spinner";
import useArcanaAuth from "../useArcanaAuth";
import "../styles/appbar.css";
import Logo from "./Logo";
import axios from "../configs/axios";

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

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleLogin = async (email) => {
    if (!validateEmail(email)) {
      alert("Please enter a valid email address");
    } else {
      await loginWithLink(email);
    }
  };

  const handleLogout = async (email) => {
    localStorage.removeItem("arcana-auth");
    localStorage.removeItem("arcana-token");
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
        // window.location.href = "u/nav/dashboard";
      } else {
        localStorage.removeItem("arcana-auth");
      }
    }
    const loadDetails = async () => {
      if (initialized) {
        if (loggedIn) {
          const acc = await getAccounts();
          setAccount(acc[0]);
          //call login api from backend and set auth token and then navigate to dashboard
          localStorage.setItem("arcana-auth", acc[0]);
          await axios.post("/auth/status", {uuid: acc[0]}).then(async (res) => {
            if (res.data.data.success && !res.data.data.username) {
              await axios.post("/auth/login", {uuid: acc[0], email: email}).then((res) => {
                localStorage.setItem("arcana-token", res.data.data.accessToken);
                setLoading(false);
                window.location.href = "u/nav/onboarding";
              });
            } else if (!res.data.data.success) {
              await axios.post("/auth/register", {uuid: acc[0], email: email}).then(async (res) => {
                await axios.post("/auth/login", {uuid: acc[0], email: email}).then((res) => {
                  localStorage.setItem("arcana-token", res.data.data.accessToken);
                  setLoading(false);
                  window.location.href = "u/nav/onboarding";
                });
              })
            } else {
              await axios.post("/auth/login", {uuid: acc[0], email: email}).then((res) => {
                localStorage.setItem("arcana-token", res.data.data.accessToken);
                setLoading(false);
                window.location.href = "u/nav/dashboard";
              });
            }
          }).catch(async (err) => {
            setLoading(false);
            alert("Something went wrong. Please try again later.");
            await handleLogout();
          });
        } else {
          localStorage.removeItem("arcana-auth");
          localStorage.removeItem("arcana-token");
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
        ) : loggedIn ? (
          <div className="box">
            <button className="logout" onClick={() => handleLogout()}> Logout </button>
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
                type="email"
                placeholder="Enter email"
                onChange={handleEmailChange}
                className="email-box"
              />
              <button type="submit" className="linkbtn" onClick={() => handleLogin(email)}>
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
