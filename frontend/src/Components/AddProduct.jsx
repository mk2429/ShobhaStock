import React, { useEffect, useState } from 'react';

export default function AddProduct() {
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [productName, setProductName] = useState('');
    const [allProductNames, setAllProductNames] = useState([]);
    const [availableProductNames, setAvailableProductNames] = useState([]);
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [logo, setLogo] = useState('');
    const [dop, setDop] = useState('');
    const [vendor, setVendor] = useState('');
    const [mrp, setMrp] = useState('');
    const [isLoading, setIsLoading] = useState(false); // New state for loading

    useEffect(() => {
        fetch('https://shobha-stock.onrender.com/api/getbrands')
            .then(response => response.json())
            .then(data => setBrands(data))
            .catch(error => console.error('Error fetching brands:', error));

        fetch('https://shobha-stock.onrender.com/api/getcategories')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Error fetching categories:', error));

        fetch('https://shobha-stock.onrender.com/api/getproductnames')
            .then(response => response.json())
            .then(data => setAllProductNames(data))
            .catch(error => console.error('Error fetching product names:', error));
    }, []);

    const handleProductNameChange = (e) => {
        const name = e.target.value;
        setProductName(name);

        if (name) {
            const filteredNames = allProductNames.filter((product) =>
                product.toLowerCase().includes(name.toLowerCase())
            );
            setAvailableProductNames(filteredNames);
        } else {
            setAvailableProductNames([]);
        }
    };

    const handleProductNameSelect = (name) => {
        setProductName(name);
        setAvailableProductNames([]); // Hide the suggestions
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading
        const requestBody = {
            pname: productName,
            bname: selectedBrand ? selectedBrand.bname : '',
            cname: selectedCategory ? selectedCategory.cname : '',
            price: parseFloat(price),
            quantity: parseInt(quantity),
            logo: logo || undefined,
            dop: dop || undefined,
            vendor: vendor || undefined,
            mrp: parseFloat(mrp) || undefined,
        };

        fetch('https://shobha-stock.onrender.com/api/addproduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message || 'Adding response is not received');

                // Reset all fields
                setProductName('');
                setSelectedBrand(null);
                setSelectedCategory(null);
                setPrice('');
                setQuantity('');
                setLogo('');
                setDop('');
                setVendor('');
                setMrp('');
                setAvailableProductNames([]);
            })
            .catch(error => {
                console.error('Error adding product:', error);
                alert('Error adding product');
            })
            .finally(() => {
                setIsLoading(false); // Stop loading
            });
    };

    return (
        <div className='container mt-5'>
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit} className='border p-4 rounded'>
                {/* Brand Dropdown */}
                <div className="mb-3">
                    <label htmlFor="brandSelect" className="form-label">Brand</label>
                    <select
                        id="brandSelect"
                        className="form-select"
                        onChange={(e) => setSelectedBrand(brands.find(brand => brand.bname === e.target.value))}
                        value={selectedBrand ? selectedBrand.bname : ''}
                    >
                        <option value="">Select Brand</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.bname}>
                                {brand.bname}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Category Dropdown */}
                <div className="mb-3">
                    <label htmlFor="categorySelect" className="form-label">Category</label>
                    <select
                        id="categorySelect"
                        className="form-select"
                        onChange={(e) => setSelectedCategory(categories.find(category => category.cname === e.target.value))}
                        value={selectedCategory ? selectedCategory.cname : ''}
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.cname}>
                                {category.cname}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Product Name Input */}
                <div className="mb-3">
                    <label htmlFor="productName" className="form-label">Product Name</label>
                    <input
                        type="text"
                        id="productName"
                        className="form-control"
                        value={productName}
                        onChange={handleProductNameChange}
                    />
                    {availableProductNames.length > 0 && (
                        <ul className="list-group bg-warning">
                            {availableProductNames.map((name, index) => (
                                <li
                                    key={index}
                                    className="list-group-item"
                                    onClick={() => handleProductNameSelect(name)} // Use the updated function
                                >
                                    {name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Price Input */}
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input
                        type="number"
                        id="price"
                        className="form-control"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>

                {/* Quantity Input */}
                <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">Quantity</label>
                    <input
                        type="number"
                        id="quantity"
                        className="form-control"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </div>

                {/* Logo Input (Optional) */}
                <div className="mb-3">
                    <label htmlFor="logo" className="form-label">Logo URL (Optional)</label>
                    <input
                        type="text"
                        id="logo"
                        className="form-control"
                        value={logo}
                        onChange={(e) => setLogo(e.target.value)}
                    />
                </div>

                {/* Date of Purchase Input (Optional) */}
                <div className="mb-3">
                    <label htmlFor="dop" className="form-label">Date of Purchase (Optional)</label>
                    <input
                        type="date"
                        id="dop"
                        className="form-control"
                        value={dop}
                        onChange={(e) => setDop(e.target.value)}
                    />
                </div>

                {/* Vendor Input (Optional) */}
                <div className="mb-3">
                    <label htmlFor="vendor" className="form-label">Vendor (Optional)</label>
                    <input
                        type="text"
                        id="vendor"
                        className="form-control"
                        value={vendor}
                        onChange={(e) => setVendor(e.target.value)}
                    />
                </div>

                {/* MRP Input (Optional) */}
                <div className="mb-3">
                    <label htmlFor="mrp" className="form-label">MRP (Optional)</label>
                    <input
                        type="number"
                        id="mrp"
                        className="form-control"
                        value={mrp}
                        onChange={(e) => setMrp(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Add Product'}
                </button>
            </form>
        </div>
    );
}
