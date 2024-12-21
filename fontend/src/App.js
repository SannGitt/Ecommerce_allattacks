import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import ProductCard from './components/ProductCard';
import CommentSection from './components/CommentSection';
import ChangePassword from './components/ChangePassword';
import ProtectedPage from './components/ProtectedPage'; // Import ProtectedPage

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
        <Route path="/change-password" element={<ChangePassword />} />

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

        {/* Protected Page */}
        <Route path="/ProtectedPage" element={<ProtectedPage />} />
      </Routes>
    </Router>
  );
}

export default App;
