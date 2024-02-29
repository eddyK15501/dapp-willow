// eslint-disable-next-line no-unused-vars
import React from 'react';
import { ethers } from 'ethers';

const Navigation = ({ account, setAccount }) => {
  const connectHandler = async () => {
    if (!window.ethereum) {
      alert("Please connect your Metamask.");
    } else {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const account = ethers.utils?.getAddress(accounts[0]);
      setAccount(account);
    }
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
      {account ? (
        <button type='button' className='nav__connect'>
            {`${account.slice(0, 7)}...${account.slice(37, 42)}`}
        </button>
      ) : (
        <button type='button' className='nav__connect' onClick={connectHandler}>
            Connect
        </button>
      )}
    </nav>
  );
};

export default Navigation;
