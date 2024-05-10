import React, { useEffect, useState } from "react";
import { Card, Button, Label, Modal, TextInput } from "flowbite-react";
import axiosInstance from "../../API/axiosInstance";

const Profile = () => {
    const [openModal, setOpenModal] = useState(false);
    const [image, setImage] = useState(null)
    const [profile, setProfile] = useState([])
    function onCloseModal() {
        setOpenModal(false);
      }
    
    useEffect(() => {
        const id = localStorage.getItem("id");
        const user_id = parseInt(JSON.parse(id));
        axiosInstance.get(`user_list/${user_id}`)
        .then((response) => {
            setProfile(response.data)
        })
    },[])

    const handleSubmit = () => {
        const id = localStorage.getItem("id");
        const user_id = parseInt(JSON.parse(id));
        axiosInstance.put('profile/', {id:user_id, image:image},
        {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        .then((response) => {
            setProfile(response.data)
            setOpenModal(false)
        })
    }

   

  return (
    <div className="flex-none m-4 w-[90%]">
      <h1 className="font-mono text-2xl tracking-tight sky-700">Profile</h1>
      <br />
        <div className="flex">
        <Card className="max-w-sm">
      <div className="flex justify-end px-4 pt-4">
      </div>
      <div className="flex flex-col items-center pb-10">
        <img
          height="96"
          src={`http://localhost:8000${profile.image}`}
          width="96"
          className="mb-3 rounded-full shadow-lg"
        />
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{profile.username}</h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">Wallet: {profile.balance}</span>
        <div className="mt-4 flex space-x-3 lg:mt-6">
          <a
          onClick={() => setOpenModal(true)}
            href="#"
            className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
          >
            Change Profile Picture
          </a>
          
        </div>
      </div>
    </Card>
    <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <form >
            <div>
              <input type="file" accept="image/*" id="password" onChange={(e) => {
                  setImage(e.target.files[0]);
                }} required />
            </div>
            <br/>
            <div className="flex justify-between">
            
            </div>
            <div className="w-full">
              <Button onClick={handleSubmit}>Save</Button>
            </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    <br />
        </div> 
    </div>
  );
};

export default Profile;
