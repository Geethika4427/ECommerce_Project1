import axios from 'axios';

export const getCartItems = async () => {
    const token = localStorage.getItem('authToken'); // Retrieve the token from local storage or another secure place
    try {
        const response = await axios.get('http://localhost:8080/api/cart-items', {
            headers: {
                'Authorization': `Bearer ${token}`, // Use the Bearer token for authorization
            }
        });
        console.log('API Response:', response.data); // Log the response data to see what is being returned
        return response.data;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    }
};

