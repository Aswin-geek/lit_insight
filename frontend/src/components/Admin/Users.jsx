import React, { useEffect, useState } from "react";
import { Table } from "flowbite-react";
import axiosInstance from "../../API/axiosInstance";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`users/${"user"}`)
      .then((response) => {
        console.log(response.data);
        setUsers(response.data);
      })
      .catch(console.log("error"));
  }, []);

  useEffect(() => {
    if (userId) {
      console.log(userId)
      handleUser();
    }
  }, [userId]);

  function handleUser() {
    console.log(userId);
    axiosInstance.put(`users/${userId}/`).then((response) => {
      const editUser = users.map((item) => {
        if ((item.id == response.data.id)) {
          return response.data;
        } else {
          return item;
        }
      });
      setUsers(editUser)
      setUserId(null)
    });
  }

  return (
    <div className="flex-none m-4 ">
      <h1 className="font-mono text-2xl tracking-tight sky-700">Users</h1>
      <br />
      <div className="overflow-x-auto ">
        <Table>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Role</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {users.length > 0 &&
              users.map((user) => {
                return (
                  <Table.Row
                    key={user.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {user.username}
                    </Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.type}</Table.Cell>
                    <Table.Cell>{user.status?'active':'inactive'}</Table.Cell>
                    <Table.Cell>
                      <a
                        href="#"
                        className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                        onClick={() => {
                          setUserId(user.id);
                          setEditUser(editUser)
                        }}
                      >
                        Toggle Status
                      </a>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default Users;
