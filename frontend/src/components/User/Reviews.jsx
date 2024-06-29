import React, { useEffect, useState } from 'react'
import axiosInstance from '../../API/axiosInstance'
import { Card } from "flowbite-react";
import { Button, Label, Modal, Textarea, Select } from "flowbite-react";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom'

const Reviews = () => {
    const navigate = useNavigate()
    const[books, setBooks] = useState([])
    const [openModal2, setOpenModal2] = useState(false);
    const[bookId, setBookId] = useState(0)
    const[description, setDescription] = useState('')
    const[rating, setRaing] = useState(0)
    useEffect(() => {
        axiosInstance.get("books/").then(
            (response) => {
                setBooks(response.data)
                console.log(response.data)
            }
        )
    },[])

    const handleSubmit = (e) => {
      e.preventDefault();
      const id = localStorage.getItem("id");
      axiosInstance.post("review/", {
        Description: description,
        rating: rating,
        user_id: parseInt(JSON.parse(id)),
        book_id: parseInt(bookId),
        // Book_image: image,
      })
      .then((response) => {
        if(response.status === 226){
          Swal.fire("Review exists");
          setDescription('')
          setRaing(0)
          setOpenModal2(false)
        }
        else if(response.status === 201){
          Swal.fire("Review posted");
          setDescription('')
          setRaing(0)
          setOpenModal2(false)
        }
      })
    }
  return (
    <div className="flex-none m-4 ">
      <h1 className="font-mono text-2xl tracking-tight sky-700">Books</h1>
      <br />
    <div className="flex gap-3 flex-wrap w-full">
        {books.length > 0 &&
          books.map((book) => {
            console.log(book)
            return (
              <Card
                key={book.id}
                className="max-w-sm h-fit"
                imgAlt="Meaningful alt text for an image that is not purely decorative"
                imgSrc={`https://litinsight.in${book.image}`}
              >
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {book.Book_Name}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  By {book.author_id.username}
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {book.genre_id.name}
                </p>
                <a className="px-3 py-1 bg-emerald-600 rounded-md text-center text-white font-sans text-sm" onClick={() => {navigate(`/user/view_book/${book.id}`)}}>
                View
                </a>
                
                {/* <Button
                  color="blue"
                  onClick={() => {
                    setBookId(book.id)
                    // setEditBook(book.Book_Name);
                    // setEditId(book.genre_id.id);
                    setOpenModal2(true);
                  }}
                >
                    Post Review
                </Button> */}
              </Card>
            );
          })}
      </div>
      <div>
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
                New Review
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
                      onChange={(e)=>setRaing(e.target.value)}
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
      </div>
      </div>
  )
}

export default Reviews