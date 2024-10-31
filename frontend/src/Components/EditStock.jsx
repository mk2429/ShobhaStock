import React, { useEffect, useState } from 'react';
import EditProductCard from './EditProductCard';

export default function EditStock() {
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);

    useEffect(() => {
        // Fetch brands from the API
        fetch('https://shobha-stock.onrender.com/getbrands')
            .then(response => response.json())
            .then(data => setBrands(data))
            .catch(error => console.error('Error fetching brands:', error));

        // Fetch categories from the API
        fetch('https://shobha-stock.onrender.com/getcategories')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    const handleSearch = () => {
        if (!selectedBrand && !selectedCategory) {
            alert("Please select a brand and a category.");
            return;
        }

        setLoading(true);
        const requestBody = {
            bname: selectedBrand && selectedBrand.bname ? selectedBrand.bname : "All",
            cname: selectedCategory && selectedCategory.cname ? selectedCategory.cname : "All"
        };

        fetch('https://shobha-stock.onrender.com/getproducts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                setProducts(data);
                setSearchPerformed(true);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
    };

    // Update product in the list
    const updateProduct = (updatedProduct) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product
            )
        );
    };

    return (
        <div className='w-100 d-flex justify-content-center align-items-center flex-column'>
            <div className='d-flex justify-content-center align-items-center flex-column w-100'>
                {/* Custom Dropdown for Brands */}
                <div className='d-flex justify-content-center align-items-center mb-3 w-100 mx-1'>
                    <div className="dropdown w-100" style={{ position: 'relative' }}>
                        <button
                            className="w-100 btn btn-light dropdown-toggle"
                            type="button"
                            id="brandDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            {selectedBrand ? (
                                <div className="d-flex align-items-center">
                                    <img
                                        src={selectedBrand.logo}
                                        alt={`${selectedBrand.bname} logo`}
                                        style={{ width: "80px", height: "60px", marginRight: "10px" }}
                                    />
                                    {selectedBrand.bname}
                                </div>
                            ) : (
                                "Select Brand"
                            )}
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="brandDropdown">
                            <li onClick={() => setSelectedBrand({ bname: "All Brands", logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKQSPw1y7xS9sruQyTYEOjSdRYLeiDMKip7g&s' })} className="dropdown-item" style={{ cursor: 'pointer' }}>
                                All Brands
                            </li>
                            {brands.map((brand) => (
                                <li
                                    key={brand.id}
                                    onClick={() => setSelectedBrand(brand)}
                                    className="dropdown-item d-flex align-items-center"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img
                                        src={brand.logo}
                                        alt={`${brand.bname} logo`}
                                        style={{ width: "80px", height: "60px", marginRight: "10px" }}
                                    />
                                    {brand.bname}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Custom Dropdown for Categories */}
                <div className='d-flex justify-content-center align-items-center mb-3 w-100 mx-1'>
                    <div className="dropdown w-100" style={{ position: 'relative' }}>
                        <button
                            className="w-100 btn btn-light dropdown-toggle"
                            type="button"
                            id="categoryDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            {selectedCategory ? (
                                <div className="d-flex align-items-center">
                                    <img
                                        src={selectedCategory.logo}
                                        alt={`${selectedCategory.cname} logo`}
                                        style={{ width: "80px", height: "60px", marginRight: "10px" }}
                                    />
                                    {selectedCategory.cname}
                                </div>
                            ) : (
                                "Select Category"
                            )}
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="categoryDropdown">
                            <li onClick={() => setSelectedCategory({ cname: "All Categories", logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKQSPw1y7xS9sruQyTYEOjSdRYLeiDMKip7g&s' })} className="dropdown-item" style={{ cursor: 'pointer' }}>
                                All Categories
                            </li>
                            {categories.map((category) => (
                                <li
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category)}
                                    className="dropdown-item d-flex align-items-center"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img
                                        src={category.logo}
                                        alt={`${category.cname} logo`}
                                        style={{ width: "80px", height: "60px", marginRight: "10px" }}
                                    />
                                    {category.cname}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <button className='btn btn-dark my-2' onClick={handleSearch} disabled={loading}>
                {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                    <span className="material-symbols-outlined">search</span>
                )}
                {loading ? " Loading..." : " Search"}
            </button>

            {/* Display Products */}
            <div className='d-flex flex-wrap justify-content-center'>
                {searchPerformed && products.length === 0 ? (
                    <div className='alert alert-info' style={{ textAlign: 'center', width: '100%' }}>
                        No Products Available
                    </div>
                ) : (
                    products.map(product => (
                        <div key={product._id} className='m-2'>
                            <EditProductCard
                                pname={product.pname}
                                cname={product.cname}
                                bname={product.bname}
                                pimage={product.logo}
                                price={product.price}
                                pid={product.id}
                                quantity={product.quantity}
                                updateProduct={updateProduct} // Pass updateProduct to EditProductCard
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
