import React, { useEffect, useState } from "react";
import { Button, Card, Modal } from "flowbite-react";
import axiosInstance from "../../API/axiosInstance";
import useRazorpay from "react-razorpay";
import { useNavigate } from "react-router-dom"

const Premium = () => {
  const [Razorpay] = useRazorpay();
  const [openModal, setOpenModal] = useState(false);
  const [plans, setPlans] = useState([]);
  const [name, setName] = useState("");
  const [validity, setValidity] = useState(0);
  const [price, setPrice] = useState(0);
  const [palnId, setPlanId] = useState(0);
  const [payId, setPayId] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    axiosInstance.get("plan/").then((response) => {
      console.log(response.data);
      setPlans(response.data);
    });
  }, []);

  function loadRazorpayScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

const handleSubmit = (e) => {
  e.preventDefault()
  console.log('1')
    const res = loadRazorpayScript(
      "https://checkout.razorpay.com/v1/checkout.js"
  );
  console.log('1')
  if (!res) {
      alert("Razorpay SDK failed to load. please check are you online?");
      return;
  }

  // creating a new order and sending order ID to backend
  const id = localStorage.getItem("id");
  const user_id = JSON.parse(id)
  axiosInstance.post('pay/',{id:palnId, user_id:user_id})
  .then((response) => {
    console.log(response.data.id)
    setPayId(response.data.id)
  })
  console.log('1')
  // Getting the order details back
  let full_price = price*100
  let actual_price = full_price.toString()
  
  if(payId){
    const options = {
      key:"rzp_test_DLTeq2nNMzXQkj",
      amount: actual_price,
      currency:"INR",
      name: "Razorpay Testing",
      description: "Test Transaction",
      order_id: payId,
      image: "https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/gpimxbtnfrnlajimfavo",
      callback_url: navigate('/user/'),
      prefill: {
        name: "Swapnil Pawar",
        email: "swapnil@example.com",
        contact: "9999999999",
    },
      notes: {
          address: "None",
      },
      theme: {
          color: "#61dafb",
      },
  };
  console.log('1')
  const paymentObject = new Razorpay(options);
  paymentObject.open();
  }
  };

  

  return (
    <>
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
              Are you sure
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="p-1">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {name}
                </h5>
              </div>
              <div className="p-1">
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Validity: {validity}
                </p>
              </div>
              <div className="p-1">
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  Price: {price}
                </p>
              </div>
              <br />
              <div className="w-full">
                <Button type="submit">Confirm</Button>
              </div>
            </form>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              &nbsp;
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div className="flex-none m-4 ">
        <h1 className="font-mono text-2xl tracking-tight sky-700">
          Premium Plans
        </h1>
        <br />
        <div className="flex gap-3 flex-wrap w-full">
          {plans.length > 0 &&
            plans.map((plan) => {
              return (
                <Card href="#" key={plan.id} className="max-w-sm">
                  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {plan.Plan_Name}
                  </h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Validity: {plan.validity}
                  </p>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Price: {plan.price}
                  </p>
                  <Button
                    color="blue"
                    onClick={() => {
                      setName(plan.Plan_Name);
                      setValidity(plan.validity);
                      setPrice(plan.price);
                      setPlanId(plan.id);
                      setOpenModal(true);
                    }}
                  >
                    Choose Plan
                  </Button>
                </Card>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Premium;
