import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';


//initialize a transaction context for app-wide context provision
export const TransactionContext = React.createContext();



//get the ethereum object form the ethereum window element provided by metamask
const { ethereum } = window;



//first retrieve contract so we can have access to our backend which has been deployed on the eth blockchain
const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
    
    return transactionContract; 
}








//now define the transaction provider and export it so it can be used to wrap the entire app for global access
export const TransactionProvider = ({ children }) => {
    //Declare useState variables
    const [currentAccount, setCurrentAccount] = useState('');
    const [formData, setFormData] = useState({addressTo:'', amount:'', keyword:'', message:''});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [transactionsLoading, setTransactionsLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);



    //function for retreiving all transactions from the ethereum blockchain
    const getAllTransactions = async () => {
        try {
          if (ethereum) {
            setTransactionsLoading(true)
            const transactionsContract = getEthereumContract();    
            const availableTransactions = await transactionsContract.getAllTransactions();
            console.log(availableTransactions)
            const structuredTransactions = availableTransactions.map((transaction) => ({
              addressTo: transaction.receiver,
              addressFrom: transaction.from,
              timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
              message: transaction.message,
              keyword: transaction.keyword,
              amount: parseInt(transaction.amount._hex) / (10 ** 18)
            }));
    
            console.log(structuredTransactions);
    
            setTransactions(structuredTransactions);
            setTransactionsLoading(false);
          } else {
            console.log("Please install The MetaMask Extention On Your Browser");
          }
        } catch (error) {
          console.log(error);
        }
      };







    //this function checks if there is an ethereum account connected to the app (to be used on every render)
    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum) return alert('Please Install MetaMask Browser Extention In Order To Use Our Services');

            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if(accounts.length){
                setCurrentAccount(accounts[0]);
                getAllTransactions();
            }else{
                console.log('no accounts found')
            }

        } catch(error) {
            console.log(error);
            throw new Error('no ethereum object found')
        }
        
    }





    const checkIfTransactionsExists = async () => {
        try {
          if (ethereum) {
            const transactionsContract = getEthereumContract();
            const currentTransactionCount = await transactionsContract.getTransactionCount();
            console.log(currentTransactionCount.toNumber());
            window.localStorage.setItem("transactionCount", currentTransactionCount);
          }
        } catch (error) {
          console.log(error);
    
          throw new Error("No ethereum object");
        }
      };





    //this function connect a users ethereum wallet to the app using metamask's ethereum-requestAccount feature
    const connectWallet = async () => {
        try {
            if(!ethereum) return alert('Please Install MetaMask Browser Extention In Order To Use Our Services');

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

            setCurrentAccount(accounts[0])
        }catch(error) {
            throw new Error('No ethereum object')
        }  
    }



    //simple function to handle form field changes
    const handleChange = async (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value })) 
    }



    //this function initiates all processing for sending crypto on the ethereum blockchain
    const sendTransaction = async () => {
        try {
            console.log('sendTransaction fired');
            setIsLoading(true)
            const {addressTo, amount, keyword, message} = formData;
            if(!ethereum) return alert('Please Install MetaMask Browser Extention In Order To Use Our Services');

            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount)

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', //21000 GWEI
                    value: parsedAmount._hex
                }]
            })

            const transactionHash  =  await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
            
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false)
            console.log(`Success - ${transactionHash.hash}`);

            const transactionCount = await transactionContract.getTransactionCount;
            console.log(transactionCount);
            setTransactionCount(transactionCount.toNumber());
            window.reload();
        } catch(error) {
            console.log(error)
        }
        //send transaction
    }


    
    
    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExists();
    }, [])


    const value = {
        connectWallet,
        currentAccount,
        formData,
        isLoading,
        setFormData, 
        handleChange,
        sendTransaction,
        transactionCount,
        transactions,
        transactionsLoading, 
        setTransactionsLoading
    }

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    )
}