import {React, useEffect, useRef, useState } from 'react'
import Appbarmini from "./Appbarmini";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AddIcon from "@material-ui/icons/Add";
import Box from "@material-ui/core/Box";
import Events from "../components/Events";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import "../styles/dashboard.css";
import DateRangeIcon from "@material-ui/icons/DateRange";
import { useHistory } from "react-router-dom";
import ConfirmationNumberIcon from "@material-ui/icons/ConfirmationNumber";
import { Client } from '@livepeer/webrtmp-sdk'
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import {
    Button,
    Form,
    FormGroup,
    FormControl,
    Spinner,
    Card
  } from "react-bootstrap";

let account;
let provider;
let signer;
let chainId;
let sf;
let superSigner;
let streamStarted = false;


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
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "red",
  },
  customTabRoot: {
    color: "#1B1A1A",
    backgroundColor: "white",
  },
  customTabIndicator: {
    backgroundColor: "#100615",
  },
}));

function VideoStream() {
  const inputEl = useRef(null)
  const videoEl = useRef(null)
  const stream = useRef(null)
  useEffect(() => {
        ;(async () => {
        videoEl.current.volume = 0

        stream.current = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        })

        videoEl.current.srcObject = stream.current
        videoEl.current.play()
        })()
  })

    const onButtonClick = async () => {
        const streamKey = inputEl.current.value

        if (!stream.current) {
            alert('Video stream was not started.')
        }

        if (!streamKey) {
            alert('Invalid streamKey.')
            return
        }

        const client = new Client()

        const session = client.cast(stream.current, streamKey)

        session.on('open', () => {
            console.log('Stream started.')
            alert('Stream started; visit Livepeer Dashboard.')
        })

        session.on('close', () => {
            console.log('Stream stopped.')
        })

        session.on('error', (err) => {
            console.log('Stream error.', err.message)
        })
    }

  return (
    <div>
        <input
        className="App-input"
        ref={inputEl}
        type="text"
        placeholder="streamKey"
        />
        <video className="App-video" ref={videoEl} />
        <button className="App-button" onClick={onButtonClick}>
            Start
        </button>
    </div>
  );
}

function SuperFluid(createNewFlow, deleteExistingFlow) {
    const [recipient, setRecipient] = useState("");
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [flowRate, setFlowRate] = useState("");
    const [flowRateDisplay, setFlowRateDisplay] = useState("");
    const [currentAccount, setCurrentAccount] = useState("");
  
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
      } else {
        console.log("No authorized account found");
      }
    };
  
    useEffect(() => {
      checkIfWalletIsConnected();
    }, []);
  
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
  
    function CreateButton({ isLoading, children, ...props }) {
      return (
        <Button variant="success" className="button" {...props}>
          {isButtonLoading ? <Spinner animation="border" /> : children}
        </Button>
      );
    }
  
    const handleRecipientChange = (e) => {
      setRecipient(() => ([e.target.name] = e.target.value));
    };
  
    const handleFlowRateChange = (e) => {
      setFlowRate(() => ([e.target.name] = e.target.value));
      let newFlowRateDisplay = calculateFlowRate(e.target.value);
      setFlowRateDisplay(newFlowRateDisplay.toString());
    };
  
    return (
      <div>
        <h2>Create a Flow</h2>
        {currentAccount === "" ? (
          <button id="connectWallet" className="button" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <Card className="connectedWallet">
            {`${currentAccount.substring(0, 4)}...${currentAccount.substring(
              38
            )}`}
          </Card>
        )}
        <Form>
          <FormGroup className="mb-3">
            <FormControl
              name="recipient"
              value={recipient}
              onChange={handleRecipientChange}
              placeholder="Enter recipient address"
            ></FormControl>
          </FormGroup>
          <FormGroup className="mb-3">
            <FormControl
              name="flowRate"
              value={flowRate}
              onChange={handleFlowRateChange}
              placeholder="Enter a flowRate in wei/second"
            ></FormControl>
          </FormGroup>
          <CreateButton
            onClick={() => {
              setIsButtonLoading(true);
              createNewFlow(recipient, flowRate);
              setTimeout(() => {
                setIsButtonLoading(false);
              }, 1000);
            }}
          >
            Click to Create Your Stream
          </CreateButton>
          <br></br>
          <CreateButton className="mt-1"
            onClick={() => {
              setIsButtonLoading(true);
              deleteExistingFlow(recipient);
              setTimeout(() => {
                setIsButtonLoading(false);
              }, 1000);
            }}
          >
            Click to Delete Your Stream
          </CreateButton>
        </Form>
  
        <div className="description">
          <p>
            Go to the CreateFlow.js component and look at the <b>createFlow() </b>
            function to see under the hood
          </p>
          <div className="calculation">
            <p>Your flow will be equal to:</p>
            <p>
              <b>${flowRateDisplay !== " " ? flowRateDisplay : 0}</b> DAIx/month
            </p>
          </div>
        </div>
      </div>
    );
}

function Stream() {
    let [transactionSteamStarted, setTransactionStream] = useState(false)
    //create flow for superfluid
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
        const daix = await sf.loadSuperToken("fDAIx");
    
        console.log(daix);
    
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
        <div>
        <Appbarmini />
            <div className="creator-spotlight" style={{marginTop: 10}}>
                <VideoStream/>
                <SuperFluid createNewFlow={createNewFlow} deleteExistingFlow={deleteExistingFlow}/>
            </div>
        </div>    
    )
}

export default Stream;
