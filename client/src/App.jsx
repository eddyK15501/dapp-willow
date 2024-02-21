import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import RealEstate from '../abi/RealEstate.json';
import Escrow from '../abi/Escrow.json';

import config from '../config.json';

function App() {
  const loadData = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    console.log(provider);
  }

  useEffect(() => {
    loadData()
  }, []);

  return (
    <div>
      <div className='cards__section'>
        <h3>Welcome to Willow!</h3>
      </div>
    </div>
  )
}

export default App
