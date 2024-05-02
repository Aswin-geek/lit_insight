import { useNavigate } from "react-router-dom";
import { Navbar } from "flowbite-react";
import React, { useState, useEffect } from "react";


function Admin_Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState([]); // State to store user data
  const navigate = useNavigate();

  const restrict = () => {
    navigate("admin/admin_login");
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const type = localStorage.getItem("type");
    console.log(accessToken);
    console.log(type);
    if (JSON.parse(accessToken) && JSON.parse(type) == "is_admin") {
      console.log("hai");
      setIsLoggedIn(true);
     // Assuming this is the initial admin home route

      
    } else {
      setIsLoggedIn(false);
      restrict();
      console.log("Not logged in as admin");
    }
  }, []); // Empty dependency array to run only once after mount

  function handleLogout() {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("type");
    navigate("/admin_login");
  }

  return (
    <>
      {isLoggedIn ? (
        <>
          <Navbar fluid rounded className="bg-blue-400 rounded-none">
            <Navbar.Brand className="space-x-1.5">
              <svg
                class="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M11 4.717c-2.286-.58-4.16-.756-7.045-.71A1.99 1.99 0 0 0 2 6v11c0 1.133.934 2.022 2.044 2.007 2.759-.038 4.5.16 6.956.791V4.717Zm2 15.081c2.456-.631 4.198-.829 6.956-.791A2.013 2.013 0 0 0 22 16.999V6a1.99 1.99 0 0 0-1.955-1.993c-2.885-.046-4.76.13-7.045.71v15.081Z"
                  clip-rule="evenodd"
                />
              </svg>
              <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                Lit Insight
              </span>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Navbar className="bg-blue-400" href="#" active>
                Home
              </Navbar>
              <Navbar className="bg-blue-400" href="#">
                Admin
              </Navbar>
              <Navbar
                className="bg-blue-400 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </Navbar>
            </Navbar.Collapse>
          </Navbar>
          
        </>
      ) : (
        <div>You are not logged in as admin.</div>
      )}
    </>
  );
}

export default Admin_Navbar;
