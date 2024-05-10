import React, { useEffect } from "react";
import { Button, Label, Modal, TextInput, Select } from "flowbite-react";
import { useState } from "react";
import axiosInstance from "../../API/axiosInstance";
import Swal from "sweetalert2";
import { Card } from "flowbite-react";


const Book = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [image, setImage] = useState(null)
  const [file, setFile] = useState(null)
  const [genres, setGenres] = useState([]);
  const [bookId, setBookId] = useState(0);
  const [genreId, setGenreId] = useState(0);
  const [genreNewId, setEditId] = useState(0);
  const [name, setName] = useState("");
  // const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [books, setBooks] = useState([]);
  

  useEffect(() => {
    axiosInstance
      .get("genre/")
      .then((response) => {
        setGenres(response.data);
      })
      .catch(console.log("error"));
    const id = localStorage.getItem("id");
    const author_id = parseInt(JSON.parse(id));
    axiosInstance.get(`book/${author_id}`).then((response) => {
      console.log(response.data);
      setBooks(response.data);
    });
  }, []);

  const updateBook = (e) => {
    e.preventDefault()
    console.log('image:',image,'file:', file)
    axiosInstance.put("book/", {id:bookId, Book_Name:editBook, genre_id:genreNewId, image:image, copy:file },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) =>{
      const newBook = books.map((item) => {
        if (item.id == response.data.id) {
          return response.data
        } else {
          return item
        }
      })
      setBooks(newBook)
      setOpenModal2(false)
      setEditBook(null)
      setImage(null)
      setFile(null)
      setEditId(0)
    })
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("submit");
    const id = localStorage.getItem("id");
    axiosInstance
      .post(
        "book/",
        {
          Book_Name: name,
          author_id: parseInt(JSON.parse(id)),
          genre_id: parseInt(genreId),
          image: image,
          copy: file

        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log(response);
        setName("");
        setGenreId(0);
        setImage(null);
        setFile(null)
        setBooks([...books, response.data]);
      })
      .catch((error) => {
        setOpenModal(true)
        setErrorMessage("Book already exists")
        console.log(error);
        setImage(null);
      });

    setOpenModal(false);
  };

  function deleteBook(id) {
    try{
      axiosInstance.delete(`books/${id}`).then((response) => {
        if (response.data) {
          setBooks(
            (current) => current.filter((item) => item.id !== id),
            () => {
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
              });
            }
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex-none m-4 ">
      <h1 className="font-mono text-2xl tracking-tight sky-700">Book</h1>
      <br />
      <Button onClick={() => setOpenModal(true)} className="max-h-10">
        Add Book
      </Button>
      <Modal
        show={openModal}
        size="md"
        popup
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              New Book
            </h3>
            <form onSubmit={handleSubmit}>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="email" value="Name" />
                </div>
                <TextInput
                  id="email"
                  placeholder=""
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="w-40">
                <Label htmlFor="genre" value="Genre" />
                <Select
                  defaultValue="md"
                  id="genre"
                  onChange={(e) => setGenreId(e.currentTarget.value)}
                >
                  <option>Select Genre</option>
                  {genres.map((genre) => {
                    return <option value={genre.id}>{genre.name}</option>;
                  })}
                </Select>
              </div>
              <br />
              <div className="w-40">
              <Label htmlFor="image" value="Image" />
              <input
                id="image"
                className="mb-5"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
              />
              </div>
              <div className="w-40">
              <Label htmlFor="file" value="Copy" />
              <input
                id="file"
                className="mb-5"
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
              </div>
              <div className="w-full">
                <Button type="submit">Submit</Button>
              </div>
            </form>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              &nbsp;
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <br />
      <div className="flex gap-3 flex-wrap w-full items-start" style={{width:'1600px'}}>
      {books.length > 0 &&
          books.map((book) => {
            return (
              <Card
                key={book.id}
                className="max-w-sm"
                imgAlt="Meaningful alt text for an image that is not purely decorative"
                imgSrc={`http://localhost:8000${book.image}`}
              >
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {book.Book_Name}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  {book.genre_id.name}
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Read by {book.book_views} users
                </p>
                <a className="px-3 py-1 bg-emerald-600 rounded-md text-center text-white font-sans text-sm" href={`http://localhost:8000${book.copy}`}  without rel='noreferrer' target='_blank'>
                View
                </a>
                <Button
                  color="blue"
                  onClick={() => {
                    setBookId(book.id)
                    setEditBook(book.Book_Name);
                    setEditId(book.genre_id.id);
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
                      deleteBook(book.id);
                    }
                  });
                }}
                >Delete</Button>
              </Card>
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
              Update Book
            </h3>
            <form onSubmit={updateBook}>
                <div className="mb-2 block">
                  <Label htmlFor="email" value="Name" />
                </div>
                <TextInput
                  id="email"
                  placeholder=""
                  value={editBook}
                  onChange={(e) =>
                    setEditBook(e.target.value)
                  }
                  required
                />
                <div className="w-40">
                  <Label htmlFor="genre" value="Genre" />
                  <Select
                    defaultValue="md"
                    id="genre"
                    value={genreNewId?.genreId}
                    onChange={(e) => setEditId(e.currentTarget.value)}
                  >
                    {
                      genres.map((genre)=>{
                        if(genre.id === genreNewId){
                          return  <option value={genre.id}>{genre.name}</option>;
                        }
                      })
                    }
                    {genres.map((genre) => {
                      if(genre.id !== genreNewId){
                        return <option value={genre.id}>{genre.name}</option>;
                      }
                    })}
                  </Select>
                </div>
                <div className="w-40">
              <Label htmlFor="image" value="Image" />
              <input
                id="image"
                className="mb-5"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                  
                }}
              />
              </div>
              <div className="w-40">
              <Label htmlFor="file" value="Copy" />
              <input
                id="file"
                className="mb-5"
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  
                }}
              />
              </div>
              <div className="w-full">
                <Button type="submit">Submit</Button>
              </div>
            </form>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              &nbsp;
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Book;
