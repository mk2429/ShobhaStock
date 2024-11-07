import React, { useState,useEffect } from 'react';

export default function EditProductCard({
  pname,
  bname,
  cname,
  price,
  baseprice,
  tax,
  extracharges,
  quantity,
  pimage,
  pid,
  updateProduct,
  removeProduct
}) {
  const validPrice = typeof price === 'object' ? price.$numberDecimal : price;
  const validQuantity = typeof quantity === 'object' ? quantity.$numberDecimal : quantity;
  const [showOverlay, setShowOverlay] = useState(false);
  const [newPname, setNewPname] = useState(pname);
  const [newPrice, setNewPrice] = useState(validPrice);
  const [newQuantity, setNewQuantity] = useState(validQuantity);
  const [newBasePrice, setNewBasePrice] = useState(baseprice);
  const [newTax, setNewTax] = useState(tax);
  const [newExtraCharges, setNewExtraCharges] = useState(extracharges);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [deleteClicked, setDeleteClicked] = useState(false);


  const calculateShownPrice = () => {
    const ac=calculateActualPrice();
    const sp=ac*1.02;
    return parseFloat(sp.toFixed(2));;
  };
  


  // Calculate the actual price
  const calculateActualPrice = () => {
    const basePrice = parseFloat(newBasePrice) || 0;
    const tax = parseFloat(newTax) || 0;
    const extraCharges = parseFloat(newExtraCharges) || 0;
  
    const price = basePrice + (tax / 100) * basePrice + extraCharges;
    return parseFloat(price.toFixed(2)); // Round to 2 decimal places and convert back to a number
  };
  


  const handleEditClick = (field) => {
    alert("You are going to edit",field)
    setCanEdit(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
    setCanEdit(false);
    setNewBasePrice(baseprice);
    setNewTax(tax);
    setNewExtraCharges(extracharges);
    setNewPrice(validPrice);
    setNewQuantity(validQuantity);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPrice = calculateShownPrice();
    const updateData = {
      pid: String(pid),
      quantity: newQuantity,
      price: updatedPrice,
      pname:newPname,
      baseprice: newBasePrice,
      tax: newTax,
      extracharges: newExtraCharges
    };

    setLoading(true);

    try {
      const response = await fetch('https://shobha-stock.onrender.com/api/editproduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      const responseText = await response.text();

      if (response.ok) {
        alert('Product updated successfully!');
        updateProduct({
          id: pid,
          price: updatedPrice,
          quantity: newQuantity,
          pname:newPname,
          baseprice: newBasePrice,
          tax: newTax,
          extracharges: newExtraCharges

        });
        handleCloseOverlay();
      } else {
        alert(`Failed to update the product: ${responseText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the product.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => setShowDeleteConfirmation(true);

  const handleDelete = async () => {
    const deleteData = { pid: String(pid) };
    setDeleteClicked(true)

    try {
      const response = await fetch('https://shobha-stock.onrender.com/api/deleteproduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deleteData),
      });

      if (response.ok) {
        alert('Product deleted successfully!');
        removeProduct(pid);
        handleCloseOverlay();
        setDeleteClicked(false)
      } else {
        alert('Failed to delete the product.');
        setDeleteClicked(false)

      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while deleting the product.');
    }
  };
  useEffect(() => {
    if (showOverlay) {
      setNewPname(pname);
      setNewPrice(validPrice);
      setNewQuantity(validQuantity);
      setNewBasePrice(baseprice);
      setNewTax(tax);
      setNewExtraCharges(extracharges);
    }
  }, [showOverlay, pname, validPrice, validQuantity, baseprice, tax, extracharges]);

  return (
    <div style={{ position: 'relative', width: '160px' }}>
      <div className="card" style={cardStyle}>
        <img
          className="card-img-top"
          src={pimage}
          alt="Product"
          style={{ width: '160px', height: '100px', objectFit: 'contain' }}
        />
        <div className="card-body d-flex flex-column" style={{ flex: '1', height: '150px' }}>
          <p className="card-title text-align-center mb-2" style={titleStyle}>{pname}</p>
          <p className="card-text text-align-center my-0" style={{ textAlign: "center" }}>₹{validPrice}</p>
          <p className="card-text text-align-center mb-3" style={{ textAlign: "center" }}>Available-{validQuantity} Pcs</p>
          <button className="btn btn-danger" onClick={() => setShowOverlay(true)}>
            Edit
          </button>
        </div>
      </div>

      {showOverlay && (
        <div style={overlayStyle}>
          <div style={formContainerStyle}>
            <button style={closeButtonStyle} onClick={handleCloseOverlay}>X</button>
            <h3>Edit {pname}</h3>
            <h6 className='text-muted'>{bname} {cname}</h6>
            <form onSubmit={handleSubmit}>
            <div className="form-group">
            
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={newPname}
              onChange={(e) => setNewPname(e.target.value)}
              required
            />
          </div>
              <div className="form-group">
            
                <label>Quantity</label>
                <input
                     type="text" // Keeping as text to avoid input arrows
                     inputMode="numeric" // Opens numeric keypad on mobile, allows only numbers
                     pattern="\d*"
                  className="form-control"
                  value={newQuantity}
                  onChange={(e) => {
                    // Allow only numeric input
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) { // Regex allows only numbers
                        setNewQuantity(e.target.value);
                    }
                }}
                  required
                />
              </div>

              <div className="form-group">
                <label>Shown Price(+2%) </label>
                <input
                  type="number"
                  className="form-control"
                  value={calculateShownPrice()}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Actual Price (With Tax & charges) </label>
                <input
                  type="number"
                  className="form-control"
                  value={calculateActualPrice()}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Base Price(Without Tax)</label>
                <input
                   type="text" // Keeping as text to avoid input arrows
                   inputMode="numeric" // Opens numeric keypad on mobile, allows only numbers
                   pattern="\d*"
                      className="form-control"
                      value={newBasePrice}
                      onChange={(e) => {
                        // Allow only numeric input
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) { // Regex allows only numbers
                            setNewBasePrice(e.target.value);
                        }
                    }}
                    />
              </div>
              <div className="form-group">
                <label>Tax</label>
                <input
                type="text" // Keeping as text to avoid input arrows
                inputMode="numeric" // Opens numeric keypad on mobile, allows only numbers
                pattern="\d*"
                      
                      className="form-control"
                      value={newTax}
                      onChange={(e) => {
                        // Allow only numeric input
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) { // Regex allows only numbers
                            setNewTax(e.target.value);
                        }
                    }}
                    />
              </div>
              <div className="form-group">
                <label>Extra Charges</label>
                <input
                      type="text" // Keeping as text to avoid input arrows
                      inputMode="numeric" // Opens numeric keypad on mobile, allows only numbers
                      pattern="\d*"
                      className="form-control"
                      value={newExtraCharges}
                      onChange={(e) => {
                        // Allow only numeric input
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) { // Regex allows only numbers
                            setNewExtraCharges(e.target.value)
                        }
                    }}
                    />
              </div>

    

              <button type="submit" className="btn btn-success mt-3" disabled={loading}>
                {loading ? 'Loading...' : 'Submit'}
              </button>
              <button type="button" className="btn btn-danger mt-3 ml-2 mx-2" onClick={handleDeleteClick}>
                Delete
              </button>
            </form>

            {showDeleteConfirmation && (
              <div style={popupStyle}>
                <p>Are you sure you want to delete this product?</p>
                <button className="btn btn-danger mx-2" onClick={handleDelete} disabled={deleteClicked}>
                  Yes, Delete it
                </button>
                <button className="btn btn-secondary ml-2" onClick={() => setShowDeleteConfirmation(false)}>
                  No
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// // Styles
// const cardStyle = {
//   boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
//   transition: '0.3s',
//   borderRadius: '10px',
//   height: '290px',
//   display: 'flex',
//   flexDirection: 'column',
// };

// const overlayStyle = {
//   position: 'fixed',
//   top: 0,
//   left: 0,
//   width: '100%',
//   height: '100%',
//   backgroundColor: 'rgba(0, 0, 0, 0.7)',
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   zIndex: 1000,
// };

// const formContainerStyle = {
//   backgroundColor: 'white',
//   padding: '20px',
//   width: '400px',
//   borderRadius: '10px',
// };

// const closeButtonStyle = {
//   position: 'absolute',
//   top: '10px',
//   right: '10px',
//   backgroundColor: 'red',
//   color: 'white',
//   border: 'none',
//   fontSize: '18px',
// };

// const titleStyle = {
//   textAlign: 'center',
// };

// const popupStyle = {
//   position: 'absolute',
//   bottom: '10px',
//   left: '50%',
//   transform: 'translateX(-50%)',
//   backgroundColor: 'white',
//   padding: '10px',
//   borderRadius: '5px',
//   boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
// };
// Styles
const cardStyle = {
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
    transition: '0.3s',
    borderRadius: '10px',
    height: '290px',
    display: 'flex',
    flexDirection: 'column',
};

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    overflowY: 'auto',
};

const formContainerStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    width: '400px',
    position: 'relative',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
    overflowY: 'auto',
};

const closeButtonStyle = {
    position: 'absolute',
    top: '40px',
    right: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
};

const titleStyle = {
    textAlign: "center",
    fontSize: "0.9rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "normal",
    marginBottom: 'auto',
};

const popupStyle = {
    marginTop: '20px',
    textAlign: 'center',
};
