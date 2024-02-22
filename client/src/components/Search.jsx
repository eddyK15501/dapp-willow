import React from 'react';

const Search = () => {
  return (
    <section>
      <h2 className='header__title'>Search it. Explore it. Buy it.</h2>
      <input
        type='text'
        className='header__search'
        placeholder='Enter a city, address, or ZIP code'
      />
    </section>
  );
};

export default Search;
