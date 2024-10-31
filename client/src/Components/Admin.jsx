import React , { useState } from 'react'
import ShowSearch from './ShowSearch';
import ShowAll from './ShowAll';

export default function Admin() {
  const [showSearch, setShowSearch] = useState(true);
  const handleShowSearch = () => {
    setShowSearch(true);
  };

  const handleShowAll = () => {
    setShowSearch(false);
  };

  return (
    <div className="container">
    <h1 className=" text-warning text-center my-4">Shobha</h1>
    <div className="d-flex justify-content-center mb-3">
      <button
        className="btn btn-primary mx-2"
        onClick={handleShowSearch}
        disabled={showSearch}
      >
        Search An Item
      </button>
      <button
        className="btn btn-warning mx-2"
        onClick={handleShowAll}
        disabled={!showSearch}
      >
        All Stock
      </button>
    </div>
    {showSearch ? <ShowSearch /> : <ShowAll />}
  </div>
  )
}
