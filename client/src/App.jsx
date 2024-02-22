import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navigation from './components/Navigation';

import RealEstate from '../abi/RealEstate.json';
import Escrow from '../abi/Escrow.json';
import config from '../config.json';

function App() {
  const [account, setAccount] = useState(null);

  const loadData = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Navigation account={account} setAccount={setAccount} />
      <div className='cards__section'>
        <h3>Welcome to Willow!</h3>
      </div>
    </>
  )
}

export default App
