import React, { useState } from 'react';

export default function EditProductCard({ pname, bname, cname, price, quantity, pimage, pid, updateProduct,removeProduct }) {
    const validPrice = typeof price === 'object' ? price.$numberDecimal : price;
    const validQuantity = typeof quantity === 'object' ? quantity.$numberDecimal : quantity;
    const [showOverlay, setShowOverlay] = useState(false);
    const [newPrice, setNewPrice] = useState(validPrice);
    const [newQuantity, setNewQuantity] = useState(validQuantity);
    const [loading, setLoading] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const handleEditClick = () => setShowOverlay(true);

    const handleCloseOverlay = () => {
        setShowOverlay(false);
        setNewPrice(validPrice);
        setNewQuantity(validQuantity);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updateData = {
            pid: String(pid),
            quantity: newQuantity,
            price: newPrice,
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
                updateProduct({ id: pid, price: newPrice, quantity: newQuantity });
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

        try {
            const response = await fetch('https://shobha-stock.onrender.com/api/deleteproduct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(deleteData),
            });

            if (response.ok) {
                alert('Product deleted successfully!');
                // You might want to call a function here to remove the product from the parent component
                removeProduct(pid);
                handleCloseOverlay();
            } else {
                alert('Failed to delete the product.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while deleting the product.');
        }
    };

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
                    <p className="card-text text-align-center my-0 " style={{textAlign:"center"}}>₹{validPrice}</p>
                    <p className="card-text text-align-center mb-3" style={{textAlign:"center"}}>Available-{validQuantity} Pcs</p>
                    <button className="btn btn-danger" onClick={handleEditClick}>
                        Edit
                    </button>
                </div>
            </div>

            {showOverlay && (
                <div style={overlayStyle}>
                    <div style={formContainerStyle}>
                        <button style={closeButtonStyle} onClick={handleCloseOverlay}>X</button>
                        <h3>Edit {pname}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={newQuantity}
                                    onChange={(e) => setNewQuantity(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Price</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                    required
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
                                <button className="btn btn-danger mx-2" onClick={handleDelete}>
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
};

const formContainerStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    width: '400px',
    position: 'relative',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
};

const closeButtonStyle = {
    position: 'absolute',
    top: '10px',
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
