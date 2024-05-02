import React, { useEffect, useState } from 'react'
import axiosInstance from '../../API/axiosInstance'
import { Card } from "flowbite-react";
import { useNavigate } from 'react-router-dom'

const Reviews = () => {
    const[reviews, setReviews] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
          const id = localStorage.getItem("id");
          const user_id = parseInt(JSON.parse(id));
          axiosInstance.get(`author_reviews/${user_id}`)
          .then((response) => setReviews(response.data),
          (response) => console.log(response.data))
          .catch((console.log("error")))
      },[])

      
  return (
    <div className="flex-none m-4 ">
        <h1 className="font-mono text-2xl tracking-tight sky-700">Reviews</h1>
      <br />
      <div className="flex gap-3 flex-wrap w-[70%] ">
        {reviews.length > 0 &&
        reviews.map((review) => {
          return (
        <Card href="#" key={review.id} className="max-w-sm">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {review.book_id.Book_Name}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
          Written By : {review.user_id.username}
          </p>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {review.Description}
          </p>
          <a onClick={() => {navigate(`/author/view_post/${review.id}`)}} className="px-3 py-1 bg-emerald-600 rounded-md text-center text-white font-sans text-sm" without rel='noreferrer' target='_blank'>
                View
          </a>
        </Card>
          )})}
      </div>

    </div>
  )
}

export default Reviews