import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Label, TextInput } from "flowbite-react";
import axiosInstance from '../API/axiosInstance';

function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
      const accessToken = localStorage.getItem("accessToken");
      const type = localStorage.getItem("type");
      if (JSON.parse(accessToken) && JSON.parse(type) == "author") {
        navigate('/author/')
      }
      else if(JSON.parse(accessToken) && JSON.parse(type) == "user") {
        navigate('/user/')
      }
    },[])

    const navigate = useNavigate()
    const go_home = () => {
        navigate('/user/')
      }
    const author_home = () => {
        navigate('/author/')
      }
    const handleSubmit = (e) => {
        e.preventDefault();
        axiosInstance
        .post("login/", {email, password})
        .then(response => {
            if (response.data.status == false){
              setErrorMessage("You are blocked by Admin")
            }
            else if (response.data) { // Check if data is present before accessing properties
              localStorage.setItem('refreshToken', JSON.stringify(response.data.refresh));
              localStorage.setItem('accessToken', JSON.stringify(response.data.access));
              localStorage.setItem('type', JSON.stringify(response.data.type))
              localStorage.setItem('id',JSON.stringify(response.data.id))
              if (response.data.type=='author') {
                author_home()
              }
              else if (response.data.type=='user'){
                go_home()
              }
              else{
                setErrorMessage('Invalid Credentials');
              }
            } else {
              // Handle the case where data is not present (e.g., log error, display message)
              console.error('Error: Data is missing in the response.');
              
            }
          })
        
        .catch(error => { console.log('no'); console.error('Error:', error);  setErrorMessage('Invalid Credentials'); });
    };
    
    return (
      <div className="flex items-center h-screen justify-center w-full color-#67e8f9" style={{ backgroundColor: '#C3DDFD' }}>
      <form className="flex max-w-md flex-col gap-4 " onSubmit={handleSubmit}>
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
          <Label htmlFor="password" value="Password" />
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
      <div className="flex items-center gap-2">
        <Label htmlFor="agree" className="flex">
          New User&nbsp;
          <Link to='/register' className="text-cyan-600 hover:underline dark:text-cyan-500">
            Register
          </Link>
        </Label>
      </div>
    </form>
    </div>
    )   
}

export default LoginForm;
