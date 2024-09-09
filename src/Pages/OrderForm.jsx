import { useState } from 'react';
import CartItems from '../../components/CartItems';
import axios from 'axios';

const OrderForm = () => {
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
  });

  const [cartTotal, setCartTotal] = useState(0); // State to manage the cart total
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message

    const { name, email, contact, address } = orderDetails;
    const amount = cartTotal; // Ensure this is in paise

    console.log(`Calculated Total: ₹${cartTotal}`);
    console.log(`Amount in paise: ${amount}`);

    const token = localStorage.getItem('authToken');
    if (!token) {
      setErrorMessage('Authentication token is missing.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/create-order', {
        amount,
        email,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { razorpayOrderId } = response.data;

      const options = {
        key: 'rzp_test_d0XmwTpLEWyJxs', // Replace with your Razorpay key ID
        amount: amount,
        currency: 'INR',
        name: 'Your Company Name',
        description: 'Test Transaction',
        order_id: razorpayOrderId,
        handler: (response) => {
          console.log(response);
          alert('Payment Successful');
        },
        prefill: {
          name: name,
          email: email,
          contact: contact,
        },
        notes: {
          address: address,
        },
        theme: {
          color: '#F37254',
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Error creating order:', error);
      setErrorMessage('Failed to initiate payment. Please try again.');
    }
  };

  return (
    <div className="order-form-container">
      <h1>Order Form</h1>

      {/* Render CartItems within the OrderForm */}
      <CartItems setCartTotal={setCartTotal} />

      {/* Display cart total */}
      <div className="cart-summary">
        <h2>Cart Total: ₹{cartTotal / 100}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={orderDetails.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={orderDetails.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact">Contact:</label>
          <input
            type="text"
            id="contact"
            name="contact"
            value=            {orderDetails.contact}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            name="address"
            value={orderDetails.address}
            onChange={handleInputChange}
            required
          />
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit">Submit Order</button>
      </form>
    </div>
  );
};

export default OrderForm;

