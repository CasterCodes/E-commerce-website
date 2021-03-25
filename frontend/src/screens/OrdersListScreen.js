import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrdersList } from "../actions/orderActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";

const OrdersListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const ordersList = useSelector((state) => state.ordersList);

  const { loading, error, orders } = ordersList;

  const user = useSelector((state) => state.user);

  const { userInfo } = user;

  const Userdelete = useSelector((state) => state.deleteUser);

  const { loading: deleteLoading, error: deleteError } = Userdelete;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(getOrdersList());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo, deleteLoading]);

  return (
    <div>
      <h2>Orders List</h2>
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
              <th>User</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Delivered</th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <Message variant="success">
                There are not registered users
              </Message>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <th>{order._id}</th>
                  <th>{order.user.name}</th>
                  <th>{order.createdAt}</th>
                  <th>{order.totalPrice}</th>
                  <th>{order.isPaid ? "Paid" : "Not Paid"}</th>
                  <th>{order.isDelivered ? "Delivered" : "Not Delivered"}</th>
                  <th>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className="btn btn-sm btn-success">
                        Deltails
                      </Button>
                    </LinkContainer>
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

export default OrdersListScreen;
