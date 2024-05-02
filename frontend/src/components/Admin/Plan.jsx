import React, { useEffect, useState } from "react";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import axiosInstance from "../../API/axiosInstance";
import { Table } from "flowbite-react";
import Swal from "sweetalert2";

const Plan = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [name, setName] = useState("");
  const [validity, setValidity] = useState(0);
  const [price, setPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [planId, setPlanId] = useState(null);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    axiosInstance.get("plan/").then((response) => {
      console.log(response.data);
      setPlans(response.data);
    });
  }, []);

  const handleSubmit = () => {
    axiosInstance
      .post("plan/", { Plan_Name: name, validity: validity, price:price })
      .then((response) => {
        console.log(response.data);
        setName("");
        setValidity(0);
        setPrice(0)
        setOpenModal(false);
        setPlans([...plans, response.data]);
      })
      .catch((error) => console.error("Error:", error));
  };

  const updatePlan = (e) => {
    e.preventDefault()
    axiosInstance.put('plan/',{id:planId, Plan_Name:name, validity:validity, price:price})
    .then((response) => {
        setPlans((current) => current.filter((item) => item.id !== planId))
        setPlans([...plans, response.data]);
        setOpenModal2(false)
        setName('')
        setPlanId(0)
        setValidity(0)
        setPrice(0)
      })
      .catch((error) => console.error("Error:", error));
  }

  function deletePlan(id){
    axiosInstance.delete(`plan/${id}`)
    .then((response) => {
        if (response.data) {
          setPlans((current) => current.filter((item) => item.id !== id),
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
      <div className="flex-none m-4 ">
        <h1 className="font-mono text-2xl tracking-tight sky-700">Plan</h1>
        <br />
        <Button onClick={() => setOpenModal(true)} className="max-h-10">
          Add Plan
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
                New Plan
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="p-1">
                  <div className="mb-2 block">
                    <Label htmlFor="email" value="Name" />
                  </div>
                  <TextInput
                    id="email"
                    placeholder=""
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    required
                  />
                  <div className="mb-2 block p-1">
                    <label
                      for="number-input"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      No. of days:
                    </label>
                    <input
                      type="number"
                      id="number-input"
                      aria-describedby="helper-text-explanation"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="0"
                      value={validity}
                      onChange={(e) => {
                        setValidity(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="mb-2 block p-1">
                    <label
                      for="number-input"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Price:
                    </label>
                    <input
                      type="number"
                      id="number-input"
                      aria-describedby="helper-text-explanation"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="0"
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value);
                      }}
                      required
                    />
                  </div>
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
                Update Plan
              </h3>
              <form onSubmit={updatePlan}>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="email" value="Genre" />
                  </div>
                  <TextInput
                    id="email"
                    placeholder=""
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-2 block p-1">
                  <label
                    for="number-input"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    No. of days:
                  </label>
                  <input
                    type="number"
                    id="number-input"
                    aria-describedby="helper-text-explanation"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="0"
                    value={validity}
                    onChange={(e) => setValidity(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2 block p-1">
                  <label
                    for="number-input"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Price:
                  </label>
                  <input
                    type="number"
                    id="number-input"
                    aria-describedby="helper-text-explanation"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
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
              <Table.HeadCell>Plan</Table.HeadCell>
              <Table.HeadCell>Validity</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {plans.map((plan) => {
              return (
                <Table.Body className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {plan.Plan_Name}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {plan.validity}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {plan.price}
                    </Table.Cell>
                    <Table.Cell>
                      <a
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                        onClick={() => {
                          setPlanId(plan.id);
                          setName(plan.Plan_Name);
                          setValidity(plan.validity);
                          setPrice(plan.price)
                          setOpenModal2(true);
                        }}
                      >
                        Edit
                      </a>
                    </Table.Cell>
                    <Table.Cell>
                      <a
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
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
                                deletePlan(plan.id);
                              }
                            });
                          }}
                      >
                        Delete
                      </a>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              );
            })}
          </Table>
        </div>
      </div>
    </>
  );
};

export default Plan;
