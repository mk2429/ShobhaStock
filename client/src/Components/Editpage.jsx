import React, { useState } from 'react';
import ShowAll from './ShowAll';
import EditStock from './EditStock';
import AddProduct from './AddProduct';  // Import the new AddProduct component

export default function EditPage() {
  const [view, setView] = useState('edit');  // Track which view to display

  const handleShowSearch = () => {
    setView('edit');
  };

  const handleShowAll = () => {
    setView('all');
  };

  const handleAddProduct = () => {
    setView('add');  // Update view to show AddProduct component
  };

  return (
    <div className="container">
      <h1 className="text-danger text-center my-4">Shobha Inventory</h1>
      <div className="d-flex justify-content-center mb-3">
        <button
          className="btn btn-primary mx-2"
          onClick={handleShowSearch}
          disabled={view === 'edit'}
        >
          Edit An Item
        </button>
        <button
          className="btn btn-warning mx-2"
          onClick={handleShowAll}
          disabled={view === 'all'}
        >
          All Stock
        </button>
        <button
          className="btn btn-success mx-2"
          onClick={handleAddProduct}
          disabled={view === 'add'}
        >
          Add Product
        </button>
      </div>
      
      {/* Conditionally render the components based on selected view */}
      {view === 'edit' && <EditStock />}
      {view === 'all' && <ShowAll />}
      {view === 'add' && <AddProduct />}
    </div>
  );
}
