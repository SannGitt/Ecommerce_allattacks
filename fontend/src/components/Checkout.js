import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Checkout = () => {
  const location = useLocation();
  const [totalPrice] = useState(location.state.totalPrice);
  const [walletBalance, setWalletBalance] = useState(0);
  const navigate = useNavigate();

  // Fetch user details and wallet balance from local storage (assuming user is authenticated)
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setWalletBalance(userData.walletBalance);
    }
  }, []);

  // Handle checkout process
  const handleCheckout = () => {
    if (walletBalance >= totalPrice) {
      fetch("http://localhost:4200/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: JSON.parse(localStorage.getItem("userData")).name,
          totalAmount: totalPrice,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Update wallet balance in localStorage
          const updatedUser = { ...JSON.parse(localStorage.getItem("userData")), walletBalance: data.remainingBalance };
          localStorage.setItem("userData", JSON.stringify(updatedUser));

          // Redirect to homepage after successful checkout
          alert("Checkout successful! Remaining Balance: ₹" + data.remainingBalance);
          navigate("/home"); // Redirect to homepage
        })
        .catch((err) => {
          alert("Checkout failed. Try again.");
        });
    } else {
      alert("Insufficient wallet balance.");
      navigate("/home");
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      <p>Total Price: ₹{totalPrice}</p>
      <p>Wallet Balance: ₹{walletBalance}</p>
      <button onClick={handleCheckout}>Proceed</button>
    </div>
  );
};

export default Checkout;


