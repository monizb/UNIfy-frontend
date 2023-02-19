import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
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

  return (
    <div data-vjs-player style={{height: '10%'}}>
      <video ref={videoNode} className="video-js"></video>
    </div>
  );
};

export default function Session(props) {
  const play = {
    fill: true,
    fluid: true,
    autoplay: true,
    controls: true,
    preload: "metadata",
    sources: [
      {
        src: "https://livepeercdn.studio/hls/d6cdopduj20m7amg/index.m3u8",
        type: "application/x-mpegURL"
      }
    ]
  };

  const recipient = "0xe478C4CA051f64074Ae8dDbFEAB8B9a013f9A0CB";
  const [flowRateDisplay, setFlowRateDisplay] = useState("");
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
        method: "eth_requestAccounts"
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
      setFlowRateDisplay(calculateFlowRate(1));
    } else {
      console.log("No authorized account found");
    }
  };

  function calculateFlowRate(amount) {
    if (typeof Number(amount) !== "number" || isNaN(Number(amount)) === true) {
      alert("You can only calculate a flowRate based on a number");
      return;
    } else if (typeof Number(amount) === "number") {
      if (Number(amount) === 0) {
        return 0;
      }
      const amountInWei = ethers.BigNumber.from(amount);
      const monthlyAmount = ethers.utils.formatEther(amountInWei.toString());
      const calculatedFlowRate = monthlyAmount * 3600 * 24 * 30;
      return calculatedFlowRate;
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);


  async function createNewFlow(recipient, flowRate) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    signer = provider.getSigner();

    chainId = await window.ethereum.request({ method: "eth_chainId" });
    sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider
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
        flowRate: flowRate
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
    console.log(
        error
    );
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
        receiver: recipient
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
  

  return (
    <div style={{position: 'relative', height: '80%'}}>
      <Video {...play} />
      <p><b>Connected Wallet:</b> {currentAccount}</p>
      <p><b>Flow Rate: </b>DaiX {flowRateDisplay}</p>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
        <div style={{width: '500px'}}>
          <div style={{ background: "white", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <img src="https://via.placeholder.com/150x150" alt="Image 1" />
              {isMoneyStreaming &&
                <img src="https://app.superfluid.finance/gifs/stream-loop.gif" alt="Image 2" />
              }
              <img src="https://via.placeholder.com/150x150" alt="Image 3" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            {currentAccount == "" &&
              <button onClick={connectWallet}>Connect Wallet</button>        
            }
            {!isMoneyStreaming &&
              <button onClick={() => {
                createNewFlow(recipient,1);
              }}
              >Start</button>
            }
            {isMoneyStreaming &&
              <button onClick={() => {
                deleteExistingFlow(recipient,1);
              }}>Stop</button>
            }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
