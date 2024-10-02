//import logo from './logo.svg';
import {useEffect, useState} from "react";
import { ethers } from "ethers";
import { BrowserProvider } from "ethers"; // ethers.js v6 requires this for browser-based providers
import Doc from "./artifacts/contracts/Doc.sol/Doc.json";

import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";


//import { BrowserProvider } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';


import './App.css';

function App() {
  const [account, setAccount ]=useState('');
  const [contract, setContract]= useState(null);
  const [provider, setProvider]=useState (null);
  const [modalOpen, setModalOpen]=useState (false);

 useEffect (()=>{
    //const provider = new ethers.providers.Web3Provider(window.ethereum);
    const provider = new BrowserProvider(window.ethereum);
    //const provider = window.ethereum ? new ethers.BrowserProvider(window.ethereum) : null;

    const wallet = async()=>{

                         // Request access to accounts
      if(provider){
 

        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChange", () => {
          window.location.reload();
        })
        await provider.send("eth_requestAccounts",[]);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        // console.log("Address:", address);
        // console.log("Signer:", signer);     //se
        setAccount(address);
        const contractAddress  = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

        const contract = new ethers.Contract(
          contractAddress,
          Doc.abi,
          signer
      );

      //console.log(contract);
      setContract(contract);
      setProvider(provider);
      }else{
        alert("Metamask is not installed")
      }
    };
    provider && wallet();
  },[]);
  return (

    <>
      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
      )}
      
    

    <div className="App">
      <h1 style ={{color: "Blue"}}>Nonso Ede</h1>
      <div class = "bg"></div>
      <div class = "bg bg2"></div>
      <div class = "bg bg3"></div>

      <p style = {{color: "white"}}>
        Account : {account ? account : "Not connected"}
      </p>
      <FileUpload account= {account} contract={contract}  />
      <Display account= {account} contract={contract} />
    


    </div>

    </>
  );
}

export default App;




