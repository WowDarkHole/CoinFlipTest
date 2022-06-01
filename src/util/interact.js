require("dotenv").config();
const alchemyKey = 'https://arb-rinkeby.g.alchemy.com/v2/hP4vNJfIe6WzaG6lsm05h3YxyAImRQVt'; //process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require("../contract-abi.json");
const contractAddress = "0x18B7DFF2a1EC88790D129719232FC07e50FC29A5";

export const helloWorldContract = new web3.eth.Contract(
  contractABI,
  contractAddress
);

const guessContractABI = require("../guess-contract-abi.json");
const guesscontractAddress = "0xDD545F70435C1Db8E9bEe2F64f01Aeb255c23BE2";

export const guessContract = new web3.eth.Contract(
  guessContractABI,
  guesscontractAddress
);

export const loadCurrentConsecutiveWins = async() => {
  const consecutiveWins = await helloWorldContract.methods.consecutiveWins().call();
  console.log(consecutiveWins);
  return consecutiveWins;
};

export const getBlockNumber = async() => {
  const blockNumber = await web3.eth.getBlockNumber();
  return blockNumber;
}

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Choose your side in the text-field above.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Choose a side in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const updateFlip = async (address, message) => {
  //input error handling
  if (!window.ethereum || address === null) {
    return {
      status:
        "💡 Connect your Metamask wallet to update the message on the blockchain.",
    };
  }

  if (message.trim() === "") {
    return {
      status: "❌ Your message cannot be an empty string.",
    };
  }

  const flipSide = parseInt(message) >= 1 ? true : false;
  console.log(flipSide);

  //set up transaction parameters
  const transactionParameters = {
    to: contractAddress,  // Required except during contract publications.
    from: address,        // must match user's active address.
    data: helloWorldContract.methods.flip(flipSide).encodeABI(),
  };

  //sign the transaction
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      status: (
        <span>
          ✅{" "}
          <a target="_blank" href={`https://testnet.arbiscan.io/tx/${txHash}`}>
            View the status of your transaction on Etherscan!
          </a>
          <br />
          ℹ️ Once the transaction is verified by the network, the message will
          be updated automatically.
        </span>
      ),
    };

    
  } 
  catch (error) {
    return {
      status: "😥 " + error.message,
    };
  }
};

export const forceFlip = async (address, message) => {
  //input error handling
  if (!window.ethereum || address === null) {
    return {
      status:
        "💡 Connect your Metamask wallet to update the message on the blockchain.",
    };
  }

  if (message.trim() === "") {
    return {
      status: "❌ Your message cannot be an empty string.",
    };
  }

  //set up transaction parameters
  const transactionParameters = {
    to: contractAddress,  // Required except during contract publications.
    from: address,        // must match user's active address.
    data: guessContract.methods.coinFlipGuess(contractAddress).encodeABI(),
  };

  //sign the transaction
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      status: (
        <span>
          ✅{" "}
          <a target="_blank" href={`https://testnet.arbiscan.io/tx/${txHash}`}>
            View the status of your transaction on Etherscan!
          </a>
          <br />
          ℹ️ Once the transaction is verified by the network, the message will
          be updated automatically.
        </span>
      ),
    };

    
  } 
  catch (error) {
    return {
      status: "😥 " + error.message,
    };
  }
};

export const guessFlip = async (address, message) => {
  let ret = -1;
  try {
    const guessSide = await guessContract.methods.makeGuess().call();
    console.log(guessSide);
    ret = guessSide === true? 1 : 0;
  } 
  catch (error) {
    console.log(error);
  }
  return ret;
};