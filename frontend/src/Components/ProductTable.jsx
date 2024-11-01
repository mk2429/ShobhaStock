import React, { useEffect, useState } from 'react';

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://shobha-stock.onrender.com/api/getproducts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bname: 'All Brands',
            cname: 'All Categories',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        console.log('Fetched Products:', data); // Log fetched data

        // Convert price and quantity fields if they are objects
        const convertedProducts = data.map(product => ({
          ...product,
          price: typeof product.price === 'object' ? product.price.$numberDecimal : product.price,
          quantity: typeof product.quantity === 'object' ? product.quantity.$numberDecimal : product.quantity,
        }));

        // Sort the products first by bname, then by pname
        const sortedProducts = convertedProducts.sort((a, b) => {
          if (a.bname < b.bname) return -1;
          if (a.bname > b.bname) return 1;
          if (a.pname < b.pname) return -1;
          if (a.pname > b.pname) return 1;
          return 0;
        });

        setProducts(sortedProducts);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-danger text-center mt-4">Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Product List</h2>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>PNAME</th>
            <th>QUANTITY</th>
            <th>PRICE</th>
            <th>BRAND</th>
            <th>CATEGORY</th>
            <th>VENDOR</th>
            <th>DOP</th>

          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.pname}</td>
              <td>{product.quantity}</td>
              <td>₹{product.price}</td>
              <td>{product.bname}</td>
              <td>{product.cname}</td>
              <td>{product.vendor}</td>
              <td>{product.dop}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
