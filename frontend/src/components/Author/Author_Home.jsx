import React, { useEffect, useState} from 'react'
import axiosInstance from "../../API/axiosInstance";
import { Card } from "flowbite-react";

const Author_Home = () => {
  const [reviews, setReviews] = useState([])
  const [books, setBooks] = useState([])
  useEffect(() => {
    axiosInstance.get("user_home/")
    .then((response) => {
      setBooks(response.data.books)
      setReviews(response.data.reviews)
    });
  }, []);
  return (
    <div className="flex-none m-4 w-full">
      <h1 className="font-mono text-2xl tracking-tight sky-700">Home</h1>
      <div className="flex gap-3 flex-wrap w-[70%]">
        <h1 className="font-mono text-2xl tracking-tight sky-700">Reviews</h1>
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
                </Card>
              );
            })}
        </div>
        <h1 className="font-mono text-2xl tracking-tight sky-700">Books</h1>
        <div className="flex gap-3 flex-wrap w-full">
          {books.length > 0 &&
            books.map((book) => {
              return (
                <Card href="#" key={book.id} className="max-w-sm">
                  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {book.Book_Name}
                  </h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    {book.genre_id.name}
                  </p>
                </Card>
              );
            })}
        </div>
      </div>
    </div>
  )
}

export default Author_Home