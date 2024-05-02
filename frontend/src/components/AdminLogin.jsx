import React, { useEffect, useState } from 'react';
import { Button, Label, TextInput } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../API/axiosInstance';

function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()
    
    useEffect(() => {
      const accessToken = localStorage.getItem("accessToken");
      const type = localStorage.getItem("type");
      if (JSON.parse(accessToken) && JSON.parse(type) == "is_admin") {
        navigate('/admin/')
      }
    },[])
    const handleSubmit = (e) => {
        e.preventDefault();
        axiosInstance
        .post("admin_login/", {email, password})
        .then(response => {
          console.log('hai',response)
          if (response.data) { // Check if data is present before accessing properties
            localStorage.setItem('refreshToken', JSON.stringify(response.data.refresh));
            localStorage.setItem('accessToken', JSON.stringify(response.data.access));
            localStorage.setItem('type', JSON.stringify(response.data.type));
              if (response.data.type=='is_admin') {
                navigate('/admin/')
              }
              else{
                setErrorMessage('Invalid Credentials');
              }
            } else {
              // Handle the case where data is not present (e.g., log error, display message)
              console.error('Error: Data is missing in the response.');
              
            }
          })
        
        .catch(error => { console.error('Error:', error); setErrorMessage('Invalid Credentials') });
    };
    
    return (
      <div className="flex items-center h-screen justify-center w-full" style={{ backgroundColor: '#C3DDFD' }}>
        
      <form className="flex max-w-md flex-col gap-4 " onSubmit={handleSubmit}>
      <div className='flex justify-center items-centers'><h1>Admin Login</h1></div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email2" value="Your email" />
        </div>
        <TextInput
          className="w-full rounded-md border-gray-400"
          id="email"
          type="email"
          placeholder="email"
          required
          value={email} onChange={email => setEmail(email.target.value)}
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password" value="password" />
        </div>
        <TextInput
          className="w-full rounded-md border-gray-400"
          id="password"
          type="password"
          placeholder="password"
          required
          value={password} onChange={password => setPassword(password.target.value)}
        />
      </div>
      <Button type="submit">Login</Button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </form>
    </div>
    )   
}

export default AdminLogin;
