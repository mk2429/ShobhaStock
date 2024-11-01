import React, { useState } from 'react';
import ShowAll from './ShowAll';
import EditStock from './EditStock';
import AddProduct from './AddProduct';    // Import the AddProduct component
import AddCategory from './AddCategory';  // Import the AddCategory component
import AddBrand from './AddBrand';        // Import the AddBrand component
import AllSales from './AllSales';        // Import the AllSales component

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

  const handleAddCategory = () => {
    setView('addCategory');  // Update view to show AddCategory component
  };

  const handleAddBrand = () => {
    setView('addBrand');  // Update view to show AddBrand component
  };

  const handleAllSales = () => {
    setView('allSales');  // Update view to show AllSales component
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
        <button
          className="btn btn-info mx-2"
          onClick={handleAddCategory}
          disabled={view === 'addCategory'}
        >
          Add Category
        </button>
        <button
          className="btn btn-secondary mx-2"
          onClick={handleAddBrand}
          disabled={view === 'addBrand'}
        >
          Add Brand
        </button>
        <button
          className="btn btn-dark mx-2"
          onClick={handleAllSales}
          disabled={view === 'allSales'}
        >
          All Sales
        </button>
      </div>
      
      {/* Conditionally render the components based on selected view */}
      {view === 'edit' && <EditStock />}
      {view === 'all' && <ShowAll />}
      {view === 'add' && <AddProduct />}
      {view === 'addCategory' && <AddCategory />}
      {view === 'addBrand' && <AddBrand />}
      {view === 'allSales' && <AllSales />}  {/* Render AllSales component */}
    </div>
  );
}
