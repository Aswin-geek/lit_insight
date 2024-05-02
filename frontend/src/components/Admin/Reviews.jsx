import React, { useEffect, useState } from 'react'
import { Button, Card } from "flowbite-react";
import axiosInstance from '../../API/axiosInstance';
import Swal from "sweetalert2";

const Reviews = () => {
    const[reviews, setReviews] = useState([])
    const [reviewId, setReviewId] = useState(0)

    useEffect(() => {
        axiosInstance.get("admin_reviews/")
        .then((response) => setReviews(response.data))
        .catch((console.log("error")))
    },[])

    function editReview(id) {
        axiosInstance.delete(`admin_reviews/${id}`).then((response) => {
            const new_review = reviews.map((item) => {
                if (item.id == response.data.id){
                  return response.data
                }else{
                  return item
                }
              })
              setReviews(new_review)
        })
        
      }

  return (
    <div className="flex-none m-4 w-[90%]">
        <h1 className="font-mono text-2xl tracking-tight sky-700">Reviews</h1>
      <br />
      <div className="flex gap-3 flex-wrap w-full">
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
           Description : {review.Description}
          </p>
          <p className="font-normal text-gray-700 dark:text-gray-400">
          Status : {review.status?'active':'inactive'}
          </p>
          <Button color="failure"
                onClick={() => {
                  Swal.fire({
                    title: "Are you sure?",
                    text: "to change status",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      editReview(review.id);
                    }
                  });
                }}
                >Toggle Status</Button>
        </Card>
          )})}
      </div>
    </div>
  )
}

export default Reviews