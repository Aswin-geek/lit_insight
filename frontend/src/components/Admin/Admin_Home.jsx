import React, { useEffect, useState } from 'react'
import { Card } from "flowbite-react";
import axiosInstance from '../../API/axiosInstance';



const Admin_Home = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    axiosInstance.get('admin_home/')
    .then((response) => {
      setData(response.data)
    })
  },[])

  return (
    <div className="flex-none m-4 w-full">
      <h1 className="font-mono text-2xl tracking-tight sky-700">Home</h1>
    <Card href="#" className="max-w-sm">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Statistics
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Active Authors: {data.authors}
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Active Users: {data.users}
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Active Books: {data.books}
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Active Reviews: {data.reviews}
      </p>
    </Card>
    </div>
  )
}

export default Admin_Home