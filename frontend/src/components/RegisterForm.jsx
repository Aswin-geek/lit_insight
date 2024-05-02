import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Button,
  Checkbox,
  Label,
  TextInput,
  Radio,
  Modal,
} from "flowbite-react";
import axiosInstance from "../API/axiosInstance";


function RegistrationForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [actual_otp, setActualOtp] = useState(0);
  const navigate = useNavigate();
  const go_login = () => {
    navigate("/login");
  };

  function onCloseModal() {
    setOpenModal(false);
    setOtp("");
    setActualOtp(0)
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance
      .post("check_email/", {email})
      .then((response) => {
        console.log(response)
        if (response.status===226) {
          setErrorMessage("User already exists");
        }if(response.status===202){
          console.log('hai')
          setOpenModal(true)
          axiosInstance.post("send_otp_email/",{email})
          .then((response) => {
            console.log(response)
            setActualOtp(response.data)
          })
          
        }
      })
      .catch((error) => console.error("Error:", error));
  
  };

  const handleVerify = (e) => {
    e.preventDefault();
    console.log('value',actual_otp)
    if (otp == actual_otp){
      axiosInstance.post("register/",{username, email, password, type})
      .then((response) => {
        if (response.status===201){
          go_login()
        }
        
      })
      .catch((error) => console.error("Error:", error));
    }else{
      setErrorMessage("Incorrect Otp")
    }
  };

  return (
    <>
      <div
        className="flex items-center h-screen justify-center w-full"
        style={{ backgroundColor: "#C3DDFD" }}
      >
        <form className="flex max-w-md flex-col gap-4 " onSubmit={handleSubmit}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="username" value="Username" />
            </div>
            <TextInput
              className="rounded-md border-gray-400"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(username) => setUsername(username.target.value)}
              required
            />
          </div>
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
              value={email}
              onChange={(email) => setEmail(email.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Radio
              id="united-state"
              name="type"
              value={type}
              onChange={(type) => setType("author")}
            />
            <Label htmlFor="united-state">Author</Label>
          </div>
          <div className="flex items-center gap-2">
            <Radio
              id="germany"
              name="type"
              value={type}
              onChange={(type) => setType("user")}
            />
            <Label htmlFor="germany">User</Label>
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
              value={password}
              onChange={(password) => setPassword(password.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
        <Label htmlFor="agree" className="flex">
          Existing User&nbsp;
          <Link to='/login/' className="text-cyan-600 hover:underline dark:text-cyan-500">
            Login
          </Link>
        </Label>
      </div>
          <Button type="submit">Register new account</Button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
        {/* <Button onClick={() => setOpenModal(true)}>Toggle modal</Button> */}
      </div>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <form onSubmit={handleVerify}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="otp" value="Enter OTP" />
              </div>
              <TextInput
                id="otp"
                placeholder="xxxx"
                value={otp}
                onChange={(otp) => setOtp(otp.target.value)}
                required
              />
            </div><br />
            <div className="w-full">
              <Button type="submit">Verify</Button>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default RegistrationForm;
