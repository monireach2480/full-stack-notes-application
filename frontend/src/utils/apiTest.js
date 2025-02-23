import axiosInstance from './axiosInstance';

const testSignup = async () => {
    try {
        const payload = {
            fullName: 'Test User',
            email: 'test3@example.com', // Use a new email to avoid duplicates
            password: 'password123',
        };
        console.log('Attempting Signup with:', payload);
        const response = await axiosInstance.post('/create-account', payload);
        console.log('Signup Success:', response.data);
        localStorage.setItem('token', response.data.accessToken);
    } catch (error) {
        console.error('Signup Failed:', error.response?.data || error.message);
    }
};

const testLogin = async () => {
    try {
        const payload = {
            email: 'test3@example.com',
            password: 'password123',
        };
        console.log('Attempting Login with:', payload);
        const response = await axiosInstance.post('/login', payload);
        console.log('Login Success:', response.data);
        localStorage.setItem('token', response.data.accessToken);
    } catch (error) {
        console.error('Login Failed:', error.response?.data || error.message);
    }
};

// Run tests
testSignup().then(() => setTimeout(testLogin, 1000)); // Delay login to ensure signup completes