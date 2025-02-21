import React from 'react'
import Navbar from '../../components/Navbar/Navbar';
import { Link } from 'react-router-dom'
import PasswordInput from '../../components/Input/PasswordInput';
import { useState } from 'react';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';	


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if(!validateEmail(email)) {
            setError('Invalid email');
            return;
        }
        if(!password) {
            setError('Password is required');
            return;
        }
        setError("")
        // call api
        try {
            const response = await axiosInstance.post('/login', {
                email: email,
                password: password,
            });
            if(response.data && response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
                navigate('/dashboard');

            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
              setError(error.response.data.message);
            } else {
              setError('Something went wrong. Please try again later.');
            }
          }



    }
  return <>
    <Navbar/>
    <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
            <form onSubmit={handleLogin}>
                <h4 className='text-2xl mb-7'>Login</h4>
                <input type="text" placeholder='Email' className='input-box' 
                value={email} onChange={(e) => setEmail(e.target.value)} />
                <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
                {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}

                <button type='submit' className='btn-primary'>
                    Login
                </button>
                <p className='text-sm text-center mt-4'>
                    Not registered? <Link to='/signup' className='font-medium text-primary underline'>Sign up</Link>
                </p>
            </form>
        </div>
    </div>
  </>
    
  
}

export default Login;