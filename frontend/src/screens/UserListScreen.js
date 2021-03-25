import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserList, deleteUser } from "../actions/userActions";

import Message from "../components/Message";
import Loader from "../components/Loader";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";

const UserListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const usersList = useSelector((state) => state.usersList);

  const { loading, error, users } = usersList;

  const user = useSelector((state) => state.user);

  const { userInfo } = user;

  const Userdelete = useSelector((state) => state.deleteUser);

  const { loading: deleteLoading, error: deleteError } = Userdelete;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(getUserList());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo, deleteLoading]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <div>
      <h2>Users List</h2>
      {deleteError && <Message variant="danger">Error deleting user</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <Message variant="success">
                There are not registered users
              </Message>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <th>{user._id}</th>
                  <th>{user.name}</th>
                  <th>{user.email}</th>
                  <th>{user.isAdmin ? "Admin" : "Not Admin"}</th>
                  <th>
                    <LinkContainer to={`/admin/user/edit/${user._id}`}>
                      <Button className="btn btn-sm btn-success">Edit</Button>
                    </LinkContainer>
                    <Button
                      className="btn btn-sm btn-danger ml-2"
                      onClick={() => handleDelete(user._id)}>
                      Delete {deleteLoading && "..."}
                    </Button>
                  </th>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UserListScreen;
