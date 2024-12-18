import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home'; 
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar'; 
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import ProductCard from './components/ProductCard'; 
import CommentSection from './components/CommentSection'; // Import CommentSection

function App() {

  const [username, setUsername] = useState('');

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Login and Signup pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />

        {/* Home page where the list of products will be displayed */}
        <Route path="/home" element={<Home />} />

        {/* Cart and Checkout pages */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Product page with integrated Comment Section */}
        <Route 
          path="/product/:id" 
          element={
            <>
              <ProductCard />
              <CommentSection /> {/* Add Comment Section below ProductCard */}
            </>
          } 
        /> 
      </Routes>
    </Router>
  );
}

export default App;
