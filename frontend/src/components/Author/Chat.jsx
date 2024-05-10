import React, { useEffect, useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import axiosInstance from "../../API/axiosInstance";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);
  const [value, setValue] = useState("");
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(0);
  const [name, setName] = useState('')
  const [roomId, setRoomId] = useState(0);
  useEffect(() => {
    const id = localStorage.getItem("id");
    const user_id = parseInt(JSON.parse(id));
    axiosInstance.get(`chat_author/${user_id}`).then((response) => {
      setUsers(response.data);
      console.log(response.data);
    });
  }, []);

  useEffect(() => {
    if (roomId) {
      const newClient = new W3CWebSocket(
        `ws://127.0.0.1:8000/ws/chat/${roomId}`
      );
      setClient(newClient);

      newClient.onopen = () => {
        console.log("WebSocket Client Connected");
      };

      axiosInstance.get(`message/${roomId}`).then((response) => {
        setMessages(response.data);
        console.log(response.data);
      });
    }
  }, [roomId]);

  useEffect(() => {
    if (value) {
      console.log("send");
    }
  }, [value]);

  async function getRoom(id) {
    const id2 = localStorage.getItem("id");
    const user_id = parseInt(JSON.parse(id2));
    setUser(user_id);
    console.log(user_id, id);
    await axiosInstance
      .post("room/", { user_1: user_id, user_2: id })
      .then((response) => {
        setRoomId(response.data[0].id);
      });
  }

  function check_room(id) {
    if (roomId != id && roomId > 0) {
      client.onclose = () => {
        console.log("WebSocket Client Closed");
      };
    }
    getRoom(id);
  }

  const sendMessage = () => {
    const id2 = localStorage.getItem("id");
    const user_id = parseInt(JSON.parse(id2));
    axiosInstance
      .post("message/", { room: roomId, sender: user_id, message: message })
      .then((response) => {
        setMessages([...messages, response.data]);
        client.send(JSON.stringify({ message: response.data }));
      });

    setMessage("");
    console.log(message);
  };

  useEffect(() => {
    if (client) {
      const id2 = localStorage.getItem("id");
      const user_id = parseInt(JSON.parse(id2));
      client.onmessage = (message) => {
        const data = JSON.parse(message.data);
        setValue(data["message"]);
        if (data.message.sender != user_id) {
          setMessages((current) => [...current, data.message]);
        }
      };
    }
  }, [client]);

  return (
    <>
      <div className="grid grid-cols-12 w-full h-screen">
        <div className="bg-slate-500 col-span-3 h-full p-6">
          <div className="bg-slate-200 h-[80%] rounded-3xl p-6">
            {/* <input
              type="text"
              class="bg-gray-50 border rounded-full border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            /> */}
            {users.map((user) => {
              return (
                <div
                  className="text-center p-2 bg-slate-400 m-2 rounded-full cursor-pointer"
                  onClick={() => {
                    check_room(user.id);
                    setName(user.username)
                  }}
                  value={user.id}
                >
                  {/* {user.id} */}
                  {user.username} {user.type}
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-gray-200 col-span-9">
          {/* <div className="bg-slate-300 h-[70%] rounded-3xl p-3 m-2">
            {messages.length > 0 &&
              messages.map((chat) => {
                return <p className="">{chat.message}</p>;
              })}
          </div> */}
          <div className="text-left p-2 bg-blue-400 m-2 rounded-lg cursor-pointer">{name}</div>
          <div class="flex flex-col flex-grow h-96 p-4 overflow-auto">
            {messages.length > 0 &&
              messages.map((chat) => {
                return (
                  <>
                    {chat.sender !== user ? (
                      <>
                        <div class="flex w-full mt-2 space-x-3 max-w-xs">
                          {/* <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div> */}
                          <div>
                            <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                              <p class="text-sm">{chat.message}</p>
                            </div>
                            {/* <span class="text-xs text-gray-500 leading-none">
                  2 min ago
                </span> */}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                          <div>
                            <div class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                              <p class="text-sm">{chat.message}</p>
                            </div>
                            {/* <span class="text-xs text-gray-500 leading-none">
                  2 min ago
                </span> */}
                          </div>
                          {/* <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div> */}
                        </div>
                      </>
                    )}
                  </>
                );
              })}
          </div>
          <div className="flex w-[95%] p-2 items-center">
            <input
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              type="text"
              class="bg-gray-50 border rounded-full border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
            <span className="w-2" onClick={sendMessage}>
              <PlayArrowIcon className="cursor-pointer" fontSize="large" />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
