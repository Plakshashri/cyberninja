import React, { useState } from 'react';
import { useNavigate } from 'react-router';
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Login successful!');
        // You might want to redirect the user here
        navigate('/matches')
      } else {
        setMessage(data.message || 'Login failed.');
      }
    } catch (error) {
      setMessage('An error occurred during login.');
    }
  };

  return (
    <div className='max-w-[50vmax] m-auto mt-30 shadow-xl/20 p-10 rounded-[50%]'>
      <h2 style={{ fontFamily: "Dancing Script, cursive" }} className='text-center text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500'>Login</h2>
      {message && <p>{message}</p>}
      <form className='flex flex-col items-center justify-center gap-15' onSubmit={handleSubmit}>
        <div  className='mt-5'>
          <label style={{ fontFamily: "Dancing Script, cursive" }}  className='text-3xl bg-clip-text text-transparent bg-gradient-to-r from-[#F89C74] to-[#f66539]' htmlFor="username">Username:</label>
          <input className='border-2 border-black px-5 rounded-[10px]' type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label style={{ fontFamily: "Dancing Script, cursive" }}  className='text-3xl bg-clip-text text-transparent bg-gradient-to-r from-[#F89C74] to-[#f66539]' htmlFor="password">Password:</label>
          <input className='border-2 border-black px-5 rounded-[10px]' type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className='bg-[#f66539] mt-[20px] px-10 py-2 rounded-4xl hover:border-white
        hover:bg-black hover:text-white cursor-pointer transition-all duration-500 ease-in-out' type="submit">Login</button>
      </form>
    </div>
  );
}
export default Login;
