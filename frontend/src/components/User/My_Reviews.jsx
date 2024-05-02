import React, { useEffect, useState } from 'react'
import { Card } from "flowbite-react";
import axiosInstance from '../../API/axiosInstance';
import { Button, Label, Modal, Textarea, Select } from "flowbite-react";
import Swal from "sweetalert2";

const My_Reviews = () => {
    const[reviews, setReviews] = useState([])
    const [openModal2, setOpenModal2] = useState(false);
    const[description, setDescription] = useState('')
    const [books, setBooks] = useState([]);
    const[bookId, setBookId] = useState(0)
    const [reviewId, setReviewId] = useState(0)
    const [rating, setRating] = useState(0)

    useEffect(() => {
      axiosInstance.get('books/')
      .then((response) => {
        setBooks(response.data)
      })
        const id = localStorage.getItem("id");
        const user_id = parseInt(JSON.parse(id));
        axiosInstance.get(`reviews/${user_id}`)
        .then((response) => setReviews(response.data))
        .catch((console.log("error")))
    },[])

    const handleSubmit = (e) => {
      e.preventDefault()
      axiosInstance.put('review/', {id:reviewId, Description:description, rating:rating})
      .then((response) => {
        const new_review = reviews.map((item) => {
          if (item.id == response.data.id){
            return response.data
          }else{
            return item
          }
        })
        setReviews(new_review)
        setOpenModal2(false)
        setDescription('')
        setRating(0)
        setReviewId(0)
      })
    }

    function deleteReview(id) {
      axiosInstance.delete(`review/${id}`).then((response) => {
        if (response.data) {
          setReviews((current) => current.filter((item) => item.id !== id),
          () => {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          }
          )
        }
      })
      
    }

  return (
    <>
    <div className="flex-none m-4 w-[90%]">
        <h1 className="font-mono text-2xl tracking-tight sky-700">My Reviews</h1>
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
            Rating: {review.rating}/5
          </p>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {review.Description}
          </p>
          <Button
        color="blue"
        onClick={() => {
          setReviewId(review.id)
          setBookId(review.book_id.id);
          setDescription(review.Description)
          setRating(review.rating)
          setOpenModal2(true);
        }}
        >
          Edit
      </Button>
      <Button color="failure"
                onClick={() => {
                  Swal.fire({
                    title: "Are you sure?",
                    text: "You want to delete this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      deleteReview(review.id);
                    }
                  });
                }}
                >Delete</Button>
        </Card>
          )})}
      </div>
      
    </div>
    <Modal
    show={openModal2}
    size="md"
    popup
    onClose={() => setOpenModal2(false)}
  >
<Modal.Header />
    <Modal.Body>
      <div className="space-y-6">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
          Edit Review
        </h3>
        <form onSubmit={handleSubmit}>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Review" />
            </div>
            <Textarea id="comment" value={description} onChange={(e)=>setDescription(e.target.value)} required rows={4} />
          </div>
          <div className="mb-2 block p-1">
                    <label
                      for="number-input"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Rate out of 5:
                    </label>
                    <input
                      type="float"
                      min={0}
                      max={5}
                      id="number-input"
                      aria-describedby="helper-text-explanation"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="0"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      required
                    />
                  </div>
          <br />
          <div className="w-full">
            <Button type="submit">Submit</Button>
          </div>
        </form>
        {/* <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
          {errorMessage && (
            <p className="error-message">{errorMessage}</p>
          )}
          &nbsp;
        </div> */}
      </div>
    </Modal.Body>
  </Modal>
  </>
  )
}

export default My_Reviews