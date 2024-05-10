import React from 'react'
import { useState } from "react";
import { Link } from 'react-router-dom';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import GridViewTwoToneIcon from '@mui/icons-material/GridViewTwoTone';
import ArrowCircleRightTwoToneIcon from '@mui/icons-material/ArrowCircleRightTwoTone';
import MarkunreadMailboxTwoToneIcon from '@mui/icons-material/MarkunreadMailboxTwoTone';
import CampaignTwoToneIcon from '@mui/icons-material/CampaignTwoTone';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import ChatTwoToneIcon from "@mui/icons-material/ChatTwoTone";


const Author_Sidebar = () => {
    const [open, setOpen] = useState(true);
  
  return (
    <div className="flex">
      <div
        className={` ${
          open ? "w-72" : "w-20 "
        } bg-sky-600 h-screen p-5  pt-8 relative duration-300`}
      >
        {/* <img
          src="../assets/control.png"
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
           border-2 rounded-full  ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        /> */}
          <ArrowCircleRightTwoToneIcon className={`absolute cursor-pointer -right-1. top-9 w-7 border-dark-purple
           border-2 rounded-full  ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)} />
        
        {/* <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7"/>
</svg> */}

        {/* <div className="flex gap-x-4 items-center">
          <img
            src="./src/assets/logo.png"
            className={`cursor-pointer duration-500 ${
              open && "rotate-[360deg]"
            }`}
          />
          <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
            }`}
          >
            Designer
          </h1>
        </div> */}
        <ul className="pt-6">
        <Link to="/author/"><li className="flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4">
              {/* <img src={`./src/assets/${Menu.src}.png`} /> */}
              <GridViewTwoToneIcon />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Dashboard
              </span>
            </li></Link>
          <Link to="/author/book/"><li className="flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4">
              {/* <img src={`./src/assets/${Menu.src}.png`} /> */}
              <LibraryBooksIcon/>
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                My Books
              </span>
            </li></Link>
            <Link to="/author/reviews/"><li className="flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4">
              {/* <img src={`./src/assets/${Menu.src}.png`} /> */}
              <MarkunreadMailboxTwoToneIcon/>
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Reviews
              </span>
            </li></Link>
            <Link to="/author/upcoming/"><li className="flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4">
              {/* <img src={`./src/assets/${Menu.src}.png`} /> */}
              <CampaignTwoToneIcon/>
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Upcoming
              </span>
            </li></Link>
            <Link to="/author/profile/"><li className="flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4">
              {/* <img src={`./src/assets/${Menu.src}.png`} /> */}
              <AccountBoxTwoToneIcon/>
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Profile
              </span>
            </li></Link>
            <Link to="/author/chat/">
            <li className="flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4">
              {/* <img src={`./src/assets/${Menu.src}.png`} /> */}
              <ChatTwoToneIcon />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                Chat
              </span>
            </li>
          </Link>
        </ul>
        
      </div>
    
    </div>
  )
}

export default Author_Sidebar