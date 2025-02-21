import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar';
import PasswordInput from '../../components/Input/PasswordInput';
import { useState } from 'react';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';


const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');
    
    const navigate = useNavigate();

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!name) {
            setError('Name is required');
            return;
        }
        if (!validateEmail(email)) {
            setError('Invalid email');
            return;
        }
        if (!password) {
            setError('Password is required');
            return;
        }

        try {
            const response = await axiosInstance.post('/create-account', {
                fullName: name,
                email: email,
                password: password,
            });
    
            // First check if we have a successful response
            if (response.data && !response.data.error) {
                // Store token immediately if it exists
                if (response.data.accessToken) {
                    localStorage.setItem('token', response.data.accessToken);
                }
                
                setSuccess('Account created successfully');
                resetForm();
                
                // Navigate immediately
                navigate('/dashboard');
            } else {
                // Handle error from successful API call but with error in response
                setError(response.data.message || 'Signup failed. Please try again.');
            }
        } catch (error) {
            // ... error handling remains the same ...
        }
    }

    return (
        <>
        <Navbar/>
        <div className='flex items-center justify-center mt-28'>
            <div className='w-96 border rounded bg-white px-7 py-10'>
                <form onSubmit={handleSignUp}>
                    <h4 className='text-2xl mb-7'>SignUp</h4>
                    <input 
                        type="text" 
                        placeholder='Name' 
                        className='input-box' 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />

                    <input 
                        type="text" 
                        placeholder='Email' 
                        className='input-box'
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />

                    <PasswordInput 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    
                    {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
                    {success && <p className='text-green-500 text-sm mt-2'>{success}</p>}
                    
                    <button type='submit' className='btn-primary'>
                        SignUp
                    </button>
                    <p className='text-sm text-center mt-4'>
                        Already registered? <Link to='/login' className='font-medium text-primary underline'>Login</Link>
                    </p>
                </form>
            </div>
        </div>
        </>
    )
};

export default SignUp