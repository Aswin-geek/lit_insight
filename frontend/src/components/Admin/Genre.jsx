import React, { useEffect } from "react";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import axiosInstance from "../../API/axiosInstance";
import { Table } from "flowbite-react";
import Swal from "sweetalert2";

const Genre = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [editGenre, setEditGenre] = useState(null);
  const [newGenre, setNewGenre] = useState(null);
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    axiosInstance.get("genre/").then((response) => {
      setGenres(response.data);
    });
  }, []);

  const updateGenre = (e) => {
    axiosInstance
      .put("genre/", { id: editGenre.id, name: editGenre.name })
      .then((response) => {
        const newGenres = genres.map((item) => {
          if (item.id == response.data.id) {
            return response.data;
          } else {
            return item;
          }
        });

        setGenres(newGenres);
        setOpenModal2(false);
        setEditGenre(null);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosInstance
      .post("genre/", { name })
      .then((response) => {
        if (response.status === 226) {
          setErrorMessage("Genre already exists");
        } else {
          setGenres([...genres, response.data]);
          console.log(response.data);
          setName("");
          setOpenModal(false);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  function deleteGenre(id) {
    try {
      console.log(id)
      axiosInstance.delete(`genre/${id}`).then((response) => {
        if (response.data) {
          setGenres(
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
    <>
      <div className="flex-none m-4 ">
        <h1 className="font-mono text-2xl tracking-tight sky-700">Genre</h1>
        <br />
        <Button onClick={() => setOpenModal(true)} className="max-h-10">
          Add Genre
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
                New Genre
              </h3>
              <form onSubmit={handleSubmit}>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="email" value="Genre" />
                  </div>
                  <TextInput
                    id="email"
                    placeholder=""
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <br />
                <div className="w-full">
                  <Button type="submit">Submit</Button>
                </div>
              </form>
              <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
                {errorMessage && (
                  <p className="error-message">{errorMessage}</p>
                )}
                &nbsp;
              </div>
            </div>
          </Modal.Body>
        </Modal>
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
                Update Genre
              </h3>
              <form onSubmit={updateGenre}>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="email" value="Genre" />
                  </div>
                  <TextInput
                    id="email"
                    placeholder=""
                    value={editGenre?.name}
                    onChange={(e) =>
                      setEditGenre({ ...editGenre, name: e.target.value })
                    }
                    required
                  />
                </div>
                <br />
                <div className="w-full">
                  <Button type="submit">Submit</Button>
                </div>
              </form>
              <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
                {errorMessage && (
                  <p className="error-message">{errorMessage}</p>
                )}
                &nbsp;
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <br />
        <div className="overflow-x-auto ">
          <Table>
            <Table.Head className="sky-700">
              <Table.HeadCell>Genre</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {genres.length > 0 &&
                genres.map((genre) => {
                  return (
                    <Table.Row
                      key={genre.id}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {genre.name}
                      </Table.Cell>
                      <Table.Cell>
                        <a
                          onClick={() => {
                            setEditGenre(genre);
                            setOpenModal2(true);
                          }}
                          className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                        >
                          Edit
                        </a>
                      </Table.Cell>
                      <Table.Cell>
                        <a
                          href="#"
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
                                deleteGenre(genre.id);
                              }
                            });
                          }}
                          className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                        >
                          Delete
                        </a>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
            </Table.Body>
          </Table>
        </div>
      </div>
    </>
  );
};

export default Genre;
