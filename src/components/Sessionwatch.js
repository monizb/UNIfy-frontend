import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { ethers } from "ethers";
import "../styles/calendar.css";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import { Framework } from "@superfluid-finance/sdk-core";
import axios from "../configs/axios";
import { useParams } from "react-router-dom";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import "../styles/logo.css";
import { Client } from "@livepeer/webrtmp-sdk";
import jwt from "jwt-decode";
import ReactHlsPlayer from "react-hls-player";
let account;
let provider;
let signer;
let chainId;
let sf;
let superSigner;
let daix;

const Video = (props) => {
  const videoNode = useRef(null);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (videoNode.current) {
      const _player = videojs(videoNode.current, props);
      setPlayer(_player);
      return () => {
        if (player !== null) {
          player.dispose();
        }
      };
    }
  }, []);

  useEffect(() => {}, []);

  return (
    <div data-vjs-player style={{ height: "10%" }}>
      <video ref={videoNode} className="video-js"></video>
    </div>
  );
};

export default function Sessionwatch() {
  const { sessionid } = useParams();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState({});
  const [started, setStarted] = useState(false);
  const [user, setUser] = React.useState({
    email: "",
    image: "",
    userName: "",
    _id: "",
  });

  useEffect(() => {
    let user = jwt(localStorage.getItem("arcana-token"));
    setUser(user);
  }, []);

  useEffect(async () => {
    var token = localStorage.getItem("arcana-token");
    await axios
      .get("/session/" + sessionid, {
        headers: {
          Authorization: `Bearer ` + token,
        },
      })
      .then((res) => {
        setLoading(false);
        setEvent(res.data.data);
        checkIfWalletIsConnected(res.data.data);
        setRecipient(res.data.data.wallet);
      })
      .catch((err) => {
        setLoading(false);
        alert("Something went wrong, please try again");
      });
  }, []);

  const play = {
    fill: true,
    fluid: true,
    autoplay: true,
    controls: true,
    preload: "metadata",
    sources: [
      {
        src: "https://livepeercdn.studio/hls/d6cdopduj20m7amg/index.m3u8",
        type: "application/x-mpegURL",
      },
    ],
  };
  const [recipient, setRecipient] = useState("")
  const [flowRateDisplay, setFlowRateDisplay] = useState(0);
  const [currentAccount, setCurrentAccount] = useState("");
  const [isMoneyStreaming, setTransactionStream] = useState(false);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      account = currentAccount;
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    console.log("runs");
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    const chain = await window.ethereum.request({ method: "eth_chainId" });
    let chainId = chain;
    console.log("chain ID:", chain);
    console.log("global Chain Id:", chainId);
    if (accounts.length !== 0) {
      account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
      console.log(event)
      setFlowRateDisplay(4);
      console.log(event.fee);
      createNewFlow("0xe478C4CA051f64074Ae8dDbFEAB8B9a013f9A0CB", parseInt(4));
    } else {
      console.log("No authorized account found");
    }
  };

  function calculateWeiPerSecond(eth, timeInMinutes) {
    // Convert eth to DAIx
    const daiX = eth * 10 ** 18;
    const weiPerDai = 0.000000000002592;
    const daiPerMinute = (daiX / timeInMinutes);
    const daiPerSecond = (daiPerMinute / 60);
    const weiPerSecond = parseInt(daiPerSecond / weiPerDai);
    return weiPerSecond;
  }

  async function createNewFlow(recipient, flowRate) {
    console.log(flowRate)
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    signer = provider.getSigner();

    chainId = await window.ethereum.request({ method: "eth_chainId" });
    sf = await Framework.create({
      chainId: Number(chainId),
      provider: provider,
    });

    superSigner = sf.createSigner({ signer: signer });
    console.log(superSigner.getTransactionCount());
    console.log("signer");
    console.log(signer);
    console.log(await superSigner.getAddress());
    daix = await sf.loadSuperToken("fDAIx");

    try {
      const createFlowOperation = daix.createFlow({
        sender: await superSigner.getAddress(),
        receiver: recipient,
        flowRate: flowRate,
        // userData?: string
      });

      console.log(createFlowOperation);
      console.log("Creating your stream...");

      const result = await createFlowOperation.exec(superSigner);
      console.log(result);

      console.log(
        `Congrats - you've just created a money stream!
    `
      );
      setTransactionStream(true);
    } catch (error) {
      console.log(error);
      console.error(error);
    }
  }
  async function deleteExistingFlow(recipient) {
    console.log(signer);
    console.log(await superSigner.getAddress());
    const daix = await sf.loadSuperToken("fDAIx");

    console.log(daix);

    try {
      const deleteFlowOperation = daix.deleteFlow({
        sender: await signer.getAddress(),
        receiver: recipient,
        // userData?: string
      });

      console.log(deleteFlowOperation);
      console.log("Deleting your stream...");

      const result = await deleteFlowOperation.exec(superSigner);
      console.log(result);

      console.log(
        `Congrats - you've just updated a money stream!
      `
      );
      setTransactionStream(false);
    } catch (error) {
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      );
      console.error(error);
    }
  }

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
  }));

  const classes = useStyles();

  return (
    <div style={{ position: "relative", height: "80%" }}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div
        style={{
          display: "flex",
          width: "100%",
          margin: "auto",
          padding: "0px",
          backgroundColor: "#100615",
          justifyContent: "center",
          height: "40vh",
        }}
      >
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            verticalAlign: "middle",
          }}
        >
          <FlashOnIcon
            style={{ color: "orange", fontSize: "25PX", marginTop: "30px" }}
          />
          <p className="powered">
            by <span className="poweredlogo">UNIfy</span>
          </p>
        </div>
      </div>
      <div
        style={{
          margin: "auto",
          width: "80%",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          marginTop: "90px",
          marginBottom: "50px",
          height: "fit-content",
          padding: 15,
        }}
        className="maincal"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1>{event.sessionName}</h1>
            <p>{event.sessionDesc}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={event.user?.image || ""}
              className="creator-image"
              style={{ height: 70, width: 70 }}
            />
            <p>{event.user?.userName}</p>
          </div>
          <p className="session-desc">
            {event?.date && new Date(event.date).toDateString()}{" "}
            {event.startTime}
          </p>
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
        <p className="tip-style">Livestream powered by</p>
        <img
          style={{ height: 30 }}
          src="https://northzone.com/wp-content/uploads/2020/03/livepeer-web.png"
        />
      </div>
        <ReactHlsPlayer
          src={
            "https://livepeercdn.studio/hls/" +
            event?.streamDetails?.playbackId +
            "/index.m3u8"
          }
          autoPlay={false}
          controls={true}
          width="100%"
          height="auto"
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
            <p>
          <b>Connected Wallet:</b> {currentAccount}
        </p>
        <p>
          <b>Flow Rate: </b>Wei/second: {flowRateDisplay}
        </p>
          <div style={{ width: "500px" }}>
            <div style={{ background: "white", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <img
                alt={event.user?.userName}
                src={event.user?.image || ""}
                className="creator-image"
                style={{ height: 70, width: 70 }}
                />
                {isMoneyStreaming && (
                  <img
                    src="https://app.superfluid.finance/gifs/stream-loop.gif"
                    alt="transfer"
                    className="creator-image"
                    style={{ height: 70, width: 70 }}
                  />
                )}
              
              <img
                alt={user?.userName}
                src={user?.image || ""}
                className="creator-image"
                style={{ height: 70, width: 70 }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "20px",
                }}
              >
                {isMoneyStreaming && (
                  <button
                    onClick={() => {
                      deleteExistingFlow(recipient);
                    }}
                  >
                    Stop
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
