import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useParams } from "react-router-dom";
import axiosInstance from "../../API/axiosInstance";
import StarIcon from "@mui/icons-material/Star";
import { Button, Label, Modal, Textarea, Select } from "flowbite-react";
import Swal from "sweetalert2";

const View_Book = () => {
  const { id } = useParams();
  const [openModal2, setOpenModal2] = useState(false);
  const [book, setBook] = useState();
  const [reviews, setReviews] = useState([]);
  const [like, setLike] = useState(false);
  const [likes, setLikes] = useState(0);
  const [description, setDescription] = useState("");
  const [rating, setRaing] = useState(0);

  useEffect(() => {
    axiosInstance.get(`view_book/${id}`).then((response) => {
      setBook(response.data.book);
      setReviews(response.data.reviews);
    });
    const uid = localStorage.getItem("id");
    const user_id = parseInt(JSON.parse(uid));
    axiosInstance
      .post("book_like/", { user_id: user_id, book_id: id })
      .then((response) => {
        setLike(response.data.like);
        setLikes(response.data.like_count);
      });
  }, []);

  async function handleLike(book_id) {
    const id = localStorage.getItem("id");
    const user_id = parseInt(JSON.parse(id));
    try {
      await axiosInstance
        .put("book_like/", {
          user_id: user_id,
          book_id: book_id,
        })
        .then((response) => {
          setLikes(response.data.like_count);
          setLike((v) => !v);
        });
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const id1 = localStorage.getItem("id");
    const user_id = parseInt(JSON.parse(id1));
    axiosInstance.post("review/", {
      Description: description,
      rating: rating,
      user_id: user_id,
      book_id: id,
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
    <>
      <div className="flex-none m-4 ">
        <h1 className="font-mono text-2xl tracking-tight sky-700">Book</h1>
        <br />
        {book && (
          <Card
            className="w-full"
            imgSrc={`http://localhost:8000${book.image}`}
            horizontal
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
           
              <a
                className="px-3 py-1 bg-emerald-600 rounded-md text-center text-white font-sans text-sm"
                href={`http://localhost:8000${book.copy}`}
                without
                rel="noreferrer"
                target="_blank"
              >
                View
              </a>
              <Button
                color="blue"
                onClick={() => {
                  // setEditBook(book.Book_Name);
                  // setEditId(book.genre_id.id);
                  setOpenModal2(true);
                }}
              >
                Post Review
              </Button>
            
            <div className="flex space-x-3">
              <h3>{likes}</h3>
              <span>
                <StarIcon
                  onClick={() => {
                    handleLike(book.id);
                  }}
                  className={`${like && "text-blue-500"}`}
                />
              </span>
            </div>
          </Card>
        )}
        <br />
        {/* <div className="flex gap-2 bg-slate-300 rounded-full p-1 w-[70%]">
          <input
            //   value={comment}
            //   onChange={(e) => {
            //     setComment(e.target.value);
            //   }}
            type="text"
            id="small-input"
            class="block w-full p-2 text-gray-900 border border-gray-300 rounded-full bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <span>
            <PlayArrowIcon className="cursor-pointer" />
          </span>
        </div> */}
        <br />
        <div className="justify-between p-1 rounded bg-slate-300 max-h-40 overflow-x-auto overflow-y-auto w-[70%]">
          {reviews &&
            reviews.map((review) => {
              return (
                <div>
                  <p className="text-xs mb-1 font-normal text-gray-700 dark:text-gray-400 p-1">
                    {review.user_id.username}
                  </p>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 p-1 w-[50%]">
                    {review.Description}
                  </p>
                </div>
              );
            })}
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
              New Review
            </h3>
            <form onSubmit={handleSubmit}>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="email" value="Review" />
                </div>
                <Textarea
                  id="comment"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                />
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
                  onChange={(e) => setRaing(e.target.value)}
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
      
    </>
  );
};

export default View_Book;
