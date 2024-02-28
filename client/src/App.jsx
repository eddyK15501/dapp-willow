/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navigation from './components/Navigation';
import Search from './components/Search';
import Card from './components/Card';

// Contract ABI
import realEstateABI from '../abi/RealEstate.json';
import escrowABI from '../abi/Escrow.json';

// Config
import config from '../config.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [escrow, setEscrow] = useState(null);
  const [homes, setHomes] = useState([]);

  // window.ethereum destructed
  const { ethereum } = window;

  const loadContractData = async () => {
    if (ethereum) {
      // Set provider
      const getProvider = new ethers.BrowserProvider(ethereum);
      setProvider(getProvider);

      // Get network metadata
      const network = await getProvider.getNetwork();

      // Create new contract object instances
      const realEstateContract = new ethers.Contract(
        config[network.chainId].realEstate.address,
        realEstateABI,
        getProvider
      );

      const escrowContract = new ethers.Contract(
        config[network.chainId].escrow.address,
        escrowABI,
        getProvider
      );
      setEscrow(escrowContract);

      const totalSupply = await realEstateContract.totalSupply();
      let ipfsData = [];

      // Get token URI and fetch() IPFS metadata
      for (let i = 1; i <= totalSupply; i++) {
        const uri = await realEstateContract.tokenURI(i);
        const response = await fetch(uri);
        const metadata = await response.json();
        ipfsData.push(metadata);
      }
      setHomes(ipfsData);

      ethereum.on('chainChanged', () => {
        window.location.reload();
      })

      ethereum.on('accountsChanged', async () => {
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        });
        // const accountOne = ethers.utils?.getAddress(accounts[0]);
        setAccount(accounts[0]);
      });
    }
  };

  useEffect(() => {
    loadContractData();
  }, []);

  return (
    <>
      <Navigation account={account} setAccount={setAccount} />
      <Search />
      <Card
        homes={homes}
        provider={provider}
        account={account}
        escrow={escrow}
      />
    </>
  );
}

export default App;
