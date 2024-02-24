/* eslint-disable no-unused-vars */
import React from 'react'

const Card = () => {
  return (
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
  )
}

export default Card