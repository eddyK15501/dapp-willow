import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navigation from './components/Navigation';
import Search from './components/Search';

// Contract ABI
import realEstateABI from '../abi/RealEstate.json';
import escrowABI from '../abi/Escrow.json';

// Config
import config from '../config.json';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  const loadBlockchainData = async () => {
    if (window.ethereum) {
      // Set provider
      const getProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(getProvider);

      // Get network metadata
      const network = await getProvider.getNetwork();

      // Deployed contract addresses from config.json
      const realEstateAddress = config[network.chainId].realEstate.address;
      const escrowAddress = config[network.chainId].escrow.address;

      // Create new contract object instances with the contract address, ABI, and provider
      const realEstate = new ethers.Contract(
        realEstateAddress,
        realEstateABI,
        getProvider
      );
      const totalSupply = await realEstate.totalSupply();

      // const escrow = new ethers.Contract(escrowAddress, escrowABI, getProvider);
    }
  };

  const handleChangeAccounts = () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async () => {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        // const accountOne = ethers.utils?.getAddress(accounts[0]);
        setAccount(accounts[0]);
      });
    }
  };

  useEffect(() => {
    loadBlockchainData();
    handleChangeAccounts();
  }, []);

  return (
    <>
      <Navigation account={account} setAccount={setAccount} />
      <Search />
      <div className='cards__section'>
        <h3>Trending Homes</h3>
        <p style={{ color: '#808080', fontSize: '0.85rem' }}>
          Properties currently being viewed at the moment
        </p>
        <div className='cards'>
          <div className='card'>
            <div className='card__image'>
              <img src='' alt='Home' />
            </div>
            <div className='card__info'>
              <h4>200 ETH</h4>
              <p style={{ fontWeight: '400', marginTop: '1px' }}>
                <strong>1</strong> bds <span>|</span>
                <strong> 2</strong> ba <span>|</span>
                <strong> 3</strong> sqft <span>|</span> House for sale
              </p>
              <p style={{ fontSize: '0.85rem' }}>
                987 Oak Drive, Sunnydale, Faketown
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
