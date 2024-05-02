import React, { useEffect, useState } from 'react'
import axiosInstance from '../../API/axiosInstance'
import { Card } from "flowbite-react";

const Upcomings = () => {
    const[upcomings, setUpcomings] = useState([])

    useEffect(() => {
        axiosInstance.get('upcoming/')
        .then((response) => {
            setUpcomings(response.data)
        })
    },[])

  return (
    <div className="flex-none m-4 ">
      <h1 className="font-mono text-2xl tracking-tight sky-700">Upcomings</h1>
      <br />
    <div className="flex gap-3 flex-wrap w-full">
        {upcomings.length > 0 &&
          upcomings.map((upcoming) => {
            console.log(upcoming)
            return (
              <Card
                key={upcoming.id}
                className="max-w-sm h-fit"
                imgAlt="Meaningful alt text for an image that is not purely decorative"
                imgSrc={`http://localhost:8000${upcoming.image}`}
              >
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {upcoming.Book_Name}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  By {upcoming.author_id.username}
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {upcoming.genre_id.name}
                </p>
              </Card>
            );
          })}
      </div>
      <div>  
      </div>
      </div>
  )
}

export default Upcomings