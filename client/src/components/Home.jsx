/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import closeIcon from '../assets/close.svg';

const Home = ({ home, provider, account, escrow, toggleHome }) => {
  const [buyerApproval, setBuyerApproval] = useState(false);
  const [sellerApproval, setSellerApproval] = useState(false);
  const [lenderApproval, setLenderApproval] = useState(false);
  const [isInspected, setIsInspected] = useState(false);

  const [owner, setOwner] = useState(null);

  const [buyer, setBuyer] = useState(null);
  const [seller, setSeller] = useState(null);
  const [lender, setLender] = useState(null);
  const [inspector, setInspector] = useState(null);

  const fetchDetails = async () => {
    try {
      // ===== Buyer =====
      const buyerAddress = await escrow.buyer(home.id);
      setBuyer(buyerAddress);
      // console.log(`Address of the buyer of this property: ${buyerAddress}`);

      const checkBuyer = await escrow.approval(home.id, buyerAddress);
      setBuyerApproval(checkBuyer);
      // console.log(`Has the buyer approved the sale of this property? ${checkBuyer}`);

      // ===== Seller =====
      const sellerAddress = await escrow.seller();
      setSeller(sellerAddress);
      // console.log(`Address of the seller of this property: ${sellerAddress}`);

      const checkSeller = await escrow.approval(home.id, sellerAddress);
      setSellerApproval(checkSeller);
      // console.log(`Has the seller approved the sale of this property? ${checkSeller}`);

      // ===== Lender =====
      const lenderAddress = await escrow.lender();
      setLender(lenderAddress);
      // console.log(`Address of the lender: ${lenderAddress}`);

      const checkLender = await escrow.approval(home.id, lenderAddress);
      setLenderApproval(checkLender);
      // console.log(`Has the lender approved the sale of this property? ${checkLender}`);

      // ===== Inspector =====
      const inspectorAddress = await escrow.inspector();
      setInspector(inspectorAddress);
      // console.log(`Address of the inspector, inspecting this property: ${inspectorAddress}`);

      const checkInspection = await escrow.inspectionPassed(home.id);
      setIsInspected(checkInspection);
      // console.log(`Has the inspector approved the inspection of this property? ${checkInspection}`);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOwner = async () => {
    if (await escrow.isListed(home.id)) return;
    const owner = await escrow.buyer(home.id);
    setOwner(owner);
  };

  useEffect(() => {
    fetchDetails();
    fetchOwner();
  }, [sellerApproval]);

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

          {owner ? (
            <div className='home__owned'>
              Owned By {`${owner.slice(0, 7)}...${owner.slice(37, 42)}`}
            </div>
          ) : (
            <div>
              {console.log('Account:', account)}
              {console.log('Lender:', lender)}
              {console.log('Inspector:', inspector)}
              {console.log('Seller:', seller)}
              {account === lender ? (
                <button className='home__buy'>Approve & Lend</button>
              ) : account === inspector ? (
                <button className='home__buy'>Approve Inspection</button>
              ) : account === seller ? (
                <button className='home__buy'>Approve & Sell</button>
              ) : account === null ? (
                <button className='home__buy disabled'>Buy Now</button>
              ) : (
                <button className='home__buy'>Buy Now</button>
              )}

              <button className='home__contact' style={{ marginTop: '0' }}>
                Contact Agent
              </button>
            </div>
          )}

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
