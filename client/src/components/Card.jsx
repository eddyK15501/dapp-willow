/* eslint-disable no-unused-vars */
import { useState } from 'react';
import Home from './Home';

const Card = ({ homes, provider, account, escrow }) => {
  const [home, setHome] = useState({});
  const [toggle, setToggle] = useState(false);

  const toggleHome = (prop) => {
    setHome(prop);
    setToggle(prevState => !prevState);
  };

  return (
    <>
      <div className='cards__section'>
        <h3>Trending Homes</h3>
        <p style={{ color: '#808080', fontSize: '0.85rem' }}>
          Properties currently being viewed at the moment
        </p>
        <div className='cards'>
          {homes.map((home) => {
            return (
              <div
                className='card'
                key={home.id}
                onClick={() => toggleHome(home)}
              >
                <div className='card__image'>
                  <img src={home.image} alt='Home' />
                </div>
                <div className='card__info'>
                  <h4>{home.attributes[0].value} ETH</h4>
                  <p style={{ fontWeight: '400', marginTop: '1px' }}>
                    <strong>{home.attributes[2].value}</strong> bds{' '}
                    <span>|</span>
                    <strong> {home.attributes[3].value}</strong> ba{' '}
                    <span>|</span>
                    <strong> {home.attributes[4].value}</strong> sqft{' '}
                    <span>|</span> House for sale
                  </p>
                  <p style={{ fontSize: '0.85rem' }}>{home.address}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {toggle && (
        <Home
          home={home}
          provider={provider}
          account={account}
          escrow={escrow}
          toggleHome={toggleHome}
        />
      )}
    </>
  );
};

export default Card;
