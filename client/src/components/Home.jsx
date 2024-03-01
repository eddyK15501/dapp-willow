/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import closeIcon from '../assets/close.svg';

const Home = ({ home, provider, account, escrow, toggleHome }) => {
  const [isBought, setIsBought] = useState(false);
  const [isSold, setIsSold] = useState(false);
  const [isLent, setIsLent] = useState(false);
  const [isInspected, setIsInspected] = useState(false);

  const [buyerApproval, setBuyerApproval] = useState(false);
  const [sellerApproval, setSellerApproval] = useState(false);
  const [lenderApproval, setLenderApproval] = useState(false);
  const [inspectionApproval, setInspectionApproval] = useState(false);

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

      const checkBuyer = await escrow.approval(home.id, buyerAddress);
      setBuyerApproval(checkBuyer);

      // ===== Seller =====
      const sellerAddress = await escrow.seller();
      setSeller(sellerAddress);

      const checkSeller = await escrow.approval(home.id, sellerAddress);
      setSellerApproval(checkSeller);

      // ===== Lender =====
      const lenderAddress = await escrow.lender();
      setLender(lenderAddress);

      const checkLender = await escrow.approval(home.id, lenderAddress);
      setLenderApproval(checkLender);

      // ===== Inspector =====
      const inspectorAddress = await escrow.inspector();
      setInspector(inspectorAddress);

      const checkInspection = await escrow.inspectionPassed(home.id);
      setInspectionApproval(checkInspection);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOwner = async () => {
    if (await escrow.isListed(home.id)) return;
    const owner = await escrow.buyer(home.id);
    setOwner(owner);
  };

  const handleBuyProp = async () => {
    // Deposit downpay as the buyer, and approve the sale
    const signer = await provider.getSigner();
    const escrowAmount = await escrow.escrowAmount(home.id);

    let transaction = await escrow.connect(signer).depositDownpay(home.id, { value: escrowAmount });
    await transaction.wait();

    transaction = await escrow.connect(signer).approveSale(home.id);
    await transaction.wait();

    setIsBought(true);
  }

  const handleSellProp = async () => {}

  const handleLend = async () => {}

  const handleInspection = async () => {
    // Pass the inspection of the property, as the inspector
    const signer = await provider.getSigner();

    const transaction = await escrow.connect(signer).updateInspectionStatus(home.id, true);
    await transaction.wait();

    setIsInspected(true);
  }

  useEffect(() => {
    fetchDetails();
    fetchOwner();
  }, [buyerApproval, sellerApproval, lenderApproval, inspectionApproval]);

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
              {account === seller ? (
                <button className='home__buy' onClick={handleSellProp} disabled={isSold}>Approve & Sell</button>
                ) : account === lender ? (
                  <button className='home__buy' onClick={handleLend} disabled={isLent}>Approve & Lend</button>
                  ) : account === inspector ? (
                    <button className='home__buy' onClick={handleInspection} disabled={isInspected}>Approve Inspection</button>
              ) : account === null ? (
                <button className='home__buy disabled'>Buy Now</button>
              ) : (
                <button className='home__buy' onClick={handleBuyProp} disabled={isBought}>Buy Now</button>
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
