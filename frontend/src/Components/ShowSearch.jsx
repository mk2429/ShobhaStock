import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard'; // Ensure this path is correct

export default function ShowSearch() {
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState({ bname: "All Brands", logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKQSPw1y7xS9sruQyTYEOjSdRYLeiDMKip7g&s' });
    const [selectedCategory, setSelectedCategory] = useState({ cname: "All Categories", logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKQSPw1y7xS9sruQyTYEOjSdRYLeiDMKip7g&s' });
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch brands and categories from the API
        fetch('https://shobha-stock.onrender.com/api/getbrands')
            .then(response => response.json())
            .then(data => setBrands(data))
            .catch(error => console.error('Error fetching brands:', error));

        fetch('https://shobha-stock.onrender.com/api/getcategories')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    const handleSearch = () => {
        setLoading(true);
        const requestBody = {
            bname: selectedBrand.bname,
            cname: selectedCategory.cname,
        };

        fetch('https://shobha-stock.onrender.com/api/getproducts', {
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
                setSearchPerformed(true);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
    };

    // Filter products based on the search term, selected brand, and category
    const filteredProducts = products.filter(product => {
        const combinedString = `${product.pname} ${product.bname} ${product.cname}`.toLowerCase();
        const searchWords = searchTerm.toLowerCase().split(' ');

        // Check if the selected brand and category match the product
        const isBrandMatch = selectedBrand.bname === "All Brands" || product.bname.toLowerCase() === selectedBrand.bname.toLowerCase();
        const isCategoryMatch = selectedCategory.cname === "All Categories" || product.cname.toLowerCase() === selectedCategory.cname.toLowerCase();
        
        // Check if all search words are included in the combined string
        const isSearchMatch = searchWords.every(word => combinedString.includes(word));

        // Return products that match the brand, category, and search term
        return isBrandMatch && isCategoryMatch && isSearchMatch;
    });

    // Function to handle brand selection
    const handleBrandSelect = (brand) => {
        setSelectedBrand(brand);
        setSearchTerm(''); // Reset search term
    };

    // Function to handle category selection
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setSearchTerm(''); // Reset search term
    };

    return (
        <div className='w-100 d-flex justify-content-center align-items-center flex-column'>
            <div className='d-flex justify-content-center align-items-center flex-column w-100'>
                {/* Search Box */}
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search by product name, brand or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

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
                        <div className="dropdown-menu p-2" aria-labelledby="brandDropdown">
                            <div className="d-flex flex-wrap">
                                <div
                                    onClick={() => handleBrandSelect({ bname: "All Brands", logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKQSPw1y7xS9sruQyTYEOjSdRYLeiDMKip7g&s' })}
                                    className="dropdown-item"
                                    style={{ cursor: 'pointer', flex: '1 1 30%', minWidth: '150px' }}
                                >
                                    All Brands
                                </div>
                                {brands.map(brand => (
                                    <div
                                        key={brand.id}
                                        onClick={() => handleBrandSelect(brand)}
                                        className="dropdown-item d-flex align-items-center"
                                        style={{ cursor: 'pointer', flex: '1 1 30%', minWidth: '150px' }}
                                    >
                                        <img
                                            src={brand.logo}
                                            alt={`${brand.bname} logo`}
                                            style={{ width: "40px", height: "30px", marginRight: "10px" }}
                                        />
                                        {brand.bname}
                                    </div>
                                ))}
                            </div>
                        </div>
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
                        <div className="dropdown-menu p-2" aria-labelledby="categoryDropdown">
                            <div className="d-flex flex-wrap">
                                <div
                                    onClick={() => handleCategorySelect({ cname: "All Categories", logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKQSPw1y7xS9sruQyTYEOjSdRYLeiDMKip7g&s' })}
                                    className="dropdown-item"
                                    style={{ cursor: 'pointer', flex: '1 1 30%', minWidth: '150px' }}
                                >
                                    All Categories
                                </div>
                                {categories.map(category => (
                                    <div
                                        key={category.id}
                                        onClick={() => handleCategorySelect(category)}
                                        className="dropdown-item d-flex align-items-center"
                                        style={{ cursor: 'pointer', flex: '1 1 30%', minWidth: '150px', border: "2px solid black" }}
                                    >
                                        <img
                                            src={category.logo}
                                            alt={`${category.cname} logo`}
                                            style={{ width: "40px", height: "30px", marginRight: "10px" }}
                                        />
                                        {category.cname}
                                    </div>
                                ))}
                            </div>
                        </div>
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
                {searchPerformed && filteredProducts.length === 0 ? (
                    <div className='alert alert-info' style={{ textAlign: 'center', width: '100%' }}>
                        No Products Available
                    </div>
                ) : (
                    filteredProducts.map(product => (
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
