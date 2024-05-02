import React, { useEffect, useState} from 'react'
import { Navbar } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { Card } from "flowbite-react";

const Home = () => {
  const [reviews, setReviews] = useState([])
  const [books, setBooks] = useState([])
  useEffect(() => {
    fetch("http://127.0.0.1:8000/user_home/")
    .then((response) => {
      setBooks(response.data.books)
      setReviews(response.data.reviews)
    });
  }, []);
  return (
    <>
    <Navbar fluid rounded className='bg-blue-400 rounded-none'>
  <Navbar.Brand className='space-x-1.5'>
  <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M11 4.717c-2.286-.58-4.16-.756-7.045-.71A1.99 1.99 0 0 0 2 6v11c0 1.133.934 2.022 2.044 2.007 2.759-.038 4.5.16 6.956.791V4.717Zm2 15.081c2.456-.631 4.198-.829 6.956-.791A2.013 2.013 0 0 0 22 16.999V6a1.99 1.99 0 0 0-1.955-1.993c-2.885-.046-4.76.13-7.045.71v15.081Z" clip-rule="evenodd"/>
  </svg>
    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Lit Insight</span>
  </Navbar.Brand>
  <Navbar.Toggle />
  <Navbar.Collapse >
    
    <Link to='/register' className='bg-blue-400' >
      Register
    </Link>
    <Link to='/login' className='bg-blue-400 cursor-pointer'>Login</Link>
  </Navbar.Collapse>
</Navbar>
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
    </>
  )
}

export default Home