import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'; // Corrected import

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className='flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3'>
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? 'text' : 'password'}
        placeholder={placeholder || 'Password'}
        className='w-full bg-transparent outline-none py-3'
      />

      {/* Conditionally render the eye icon */}
      {isShowPassword ? (
        <FaRegEyeSlash
          size={22}
          className='text-primary cursor-pointer'
          onClick={toggleShowPassword}
        />
      ) : (
        <FaRegEye
          size={22}
          className='text-primary cursor-pointer'
          onClick={toggleShowPassword}
        />
      )}
    </div>
  );
};

export default PasswordInput;