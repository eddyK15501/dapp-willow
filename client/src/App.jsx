import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Navigation from './components/Navigation';

// import RealEstate from '../abi/RealEstate.json';
// import Escrow from '../abi/Escrow.json';
// import config from '../config.json';
import Search from './components/Search';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  const loadBlockchainData = async () => {
    const getProvider = new ethers.BrowserProvider(window.ethereum);
    setProvider(getProvider);

    const network = await getProvider.getNetwork();
    console.log(network);

    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      // const accountOne = ethers.utils?.getAddress(accounts[0]);
      setAccount(accounts[0]);
    });
  };

  useEffect(() => {
    loadBlockchainData();
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
          <div className="card">
            <div className="card__image">
              <img src="" alt="Home" />
            </div>
            <div className="card__info">
              <h4>200 ETH</h4>
              <p style={{ fontWeight: '400', marginTop: '1px' }}>
                <strong>1</strong> bds <span>|</span>
                <strong>{" "}2</strong> ba <span>|</span>
                <strong>{" "}3</strong> sqft <span>|</span>
                {" "}House for sale
              </p>
              <p style={{ fontSize: '0.85rem' }}>987 Oak Drive, Sunnydale, Faketown</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
