import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard'; // Ensure this path is correct

export default function ShowSearch() {
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState({ bname: "All Brands", logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKQSPw1y7xS9sruQyTYEOjSdRYLeiDMKip7g&s' });
    const [selectedCategory, setSelectedCategory] = useState({ cname: "All Categories", logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKQSPw1y7xS9sruQyTYEOjSdRYLeiDMKip7g&s' });
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false); // New state variable

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
        setLoading(true);
        const requestBody = {
            bname: selectedBrand.bname,
            cname: selectedCategory.cname
        };

        fetch('https://shobha-stock.onrender.com/getproducts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setProducts(data);
                setSearchPerformed(true); // Set search performed to true
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
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
                            <div className="d-flex align-items-center">
                                <img
                                    src={selectedBrand.logo}
                                    alt={`${selectedBrand.bname} logo`}
                                    style={{ width: "80px", height: "60px", marginRight: "10px" }}
                                />
                                {selectedBrand.bname}
                            </div>
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="brandDropdown">
                            {/* "All" Option */}
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
                            <div className="d-flex align-items-center">
                                <img
                                    src={selectedCategory.logo}
                                    alt={`${selectedCategory.cname} logo`}
                                    style={{ width: "80px", height: "60px", marginRight: "10px" }}
                                />
                                {selectedCategory.cname}
                            </div>
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="categoryDropdown">
                            {/* "All" Option */}
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
                {searchPerformed && products.length === 0 ? ( // Check if a search has been performed and no products found
                    <div className='alert alert-info' style={{ textAlign: 'center', width: '100%' }}>
                        No Products Available
                    </div>
                ) : (
                    products.map(product => (
                        <div key={product._id} className='m-2'>
                            <ProductCard
                                pname={product.pname}
                                cname={product.cname}
                                bname={product.bname}
                                pimage={product.logo}
                                price={product.price?.$numberDecimal || product.price}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
