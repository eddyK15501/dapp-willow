import React from 'react';

const Navigation = ({ account, setAccount }) => {
  const connectHandler = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    setAccount(accounts[0]);
  };

  return (
    <nav>
      <ul className='nav__links'>
        <li>
          <a href='#'>Buy</a>
        </li>
        <li>
          <a href='#'>Rent</a>
        </li>
        <li>
          <a href='#'>Sell</a>
        </li>
      </ul>
      <div className='nav__brand'>
        <img src='' alt='' />
        <h1>Willow</h1>
      </div>
      <button type='button' className='nav__connect'>
        0x0...
      </button>
    </nav>
  );
};

export default Navigation;
