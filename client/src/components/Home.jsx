/* eslint-disable no-unused-vars */
import React from 'react';
import closeIcon from '../assets/close.svg';

const Home = ({ home, provider, account, escrow, toggleHome }) => {
  return (
    <div className='home'>
      <div className='home__details'>
        <div className='home__image'>
          <img src={home.image} alt='Home Image' />
        </div>
        <div className='home__overview'>
          <h1 style={{ fontWeight: '600', marginBottom: '1rem' }}>
            {home.name}
          </h1>
          <p style={{ fontWeight: '400', marginTop: '1px' }}>
            <strong>{home.attributes[2].value}</strong> bds <span>|</span>
            <strong> {home.attributes[3].value}</strong> ba <span>|</span>
            <strong> {home.attributes[4].value}</strong> sqft
          </p>
          <p>{home.address}</p>
          <h2 style={{ fontWeight: '600', marginTop: '1rem' }}>
            {home.attributes[0].value} ETH
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <button className='home__buy' style={{ marginBottom: '15px' }}>
              Buy Now
            </button>
            <button className='home__contact' style={{ marginTop: '0' }}>
              Contact Agent
            </button>
          </div>
          <hr />
          <h2>Overview</h2>
          <p>{home.description}</p>
          <hr />
          <h2>Facts and features</h2>
          <ul style={{ marginBottom: '4rem' }}>
            {home.attributes.map((att, index) => (
              <li key={index}>
                {att.trait_type} : {att.value}
              </li>
            ))}
          </ul>
        </div>
        <button onClick={toggleHome} className='home__close'>
          <img src={closeIcon} alt='Close Icon' />
        </button>
      </div>
    </div>
  );
};

export default Home;
