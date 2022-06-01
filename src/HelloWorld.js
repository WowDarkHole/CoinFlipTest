import React from "react";
import { useEffect, useState } from "react";
import {
  connectWallet,
  getBlockNumber,
  updateFlip,
  forceFlip,
  guessFlip,
  loadCurrentConsecutiveWins,
} from "./util/interact.js";

import alchemylogo from "./alchemylogo.svg";

const HelloWorld = () => {
  //state variables
  const [expectedSide, setExpectedSide] = useState("0");
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [consecutiveWins, setConsecutiveWins] = useState(""); //default message
  const [mySide, setMySide] = useState("1");

  //called only once
  useEffect(async () => {
    const consWins = await loadCurrentConsecutiveWins();
    setConsecutiveWins(consWins);

    // addSmartContractListener();

    // const { address, status } = await getCurrentWalletConnected();

    // setWallet(address);
    // setStatus(status);

    // addWalletListener();

  }, []);

  function addSmartContractListener() {
    // helloWorldContract.events.UpdatedMessages({}, (error, data) => {
    //   if (error) {
    //     setStatus("😥 " + error.message);
    //   } else {
    //     setMessage(data.returnValues[1]);
    //     setNewMessage("");
    //     setStatus("🎉 Your message has been updated!");
    //   }
    // });
  }

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Choose your side in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onUpdateFlip = async () => {
    const { status } = await updateFlip(walletAddress, mySide);
    setStatus(status);
  };

  const onForceFlip = async () => {
    const { status } = await forceFlip(walletAddress, mySide);
    setStatus(status);
  }

  const onUpdateConsecutiveWins = async() => {
    const consWins = await loadCurrentConsecutiveWins();
    setConsecutiveWins(consWins);
  }

  const onGuessFlip = async() => {
    const blockNumber = await getBlockNumber();
    console.log('The latest block number is: ' + blockNumber);

    const expSide = await guessFlip(walletAddress, mySide);
    setExpectedSide(expSide);
  }

  //the UI of our component
  return (
    <div id="container">
      <img id="logo" src={alchemylogo}></img>
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
      <div style={{display: "flex", clear: "both"}}>
          <div className="action-panel">
            <h2 style={{paddingTop: "50px"}}>Expected Side: </h2>
            <p>{expectedSide}</p>
            <button id="peek" onClick={onGuessFlip}>
                Guess
            </button>
          </div>
          <div className="action-panel">
            <h2 style={{paddingTop: "50px"}}>My Side: </h2>
              <input
                type="text"
                placeholder="Front: 1, Back: 0"
                onChange={(e) => setMySide(e.target.value)}
                value={mySide}
              />
              <button id="publish" onClick={onUpdateFlip}>
                Flip
              </button>
          </div>
      </div>

      {/* <hr style={{marginTop: "20px"}}/>
      <button id="update_force_flip" onClick={onForceFlip}>
        Force Flip
      </button> */}

      <hr style={{marginTop: "20px"}}/>
      <h2 style={{ paddingTop: "50px" }}>ConsecutiveWin: <span>{consecutiveWins} </span> </h2>
      <button id="update_consecutivewins" onClick={onUpdateConsecutiveWins}>
        Update ConsecutiveWin
      </button>
      
      <hr style={{marginTop: "20px"}}/>
      <div>
        <p id="status">{status}</p>
      </div>

    </div>
  );
};

export default HelloWorld;
