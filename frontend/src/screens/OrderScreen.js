import React, { useEffect, useState } from "react";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { PayPalButton } from "react-paypal-button-v2";
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from "../constants/orderConstants";
import { getUserList } from "../actions/userActions";
import axios from "axios";

const OrderScreen = ({ history, match }) => {
  const orderId = match.params.id;

  const [sdkReady, setSdkReady] = useState(false);

  // Calculations

  const orderDetails = useSelector((state) => state.orderDetails);

  const { error, loading, order, success } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);

  const { loading: loadingPay, success: successPay } = orderPay;

  const user = useSelector((state) => state.user);

  const { userInfo } = user;

  const orderDeliver = useSelector((state) => state.orderDeliver);

  const {
    loading: deliverLoading,
    success: deliverSuccess,
    error: deliverError,
  } = orderDeliver;

  if (!loading) {
    // Calculations
    const addDecimal = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };
    order.itemsPrice = addDecimal(
      order.orderItems.reduce(
        (accum, item) => accum + item.price * item.quantity,
        0
      )
    );
  }

  const dispatch = useDispatch();

  useEffect(() => {
    const addPayPalScript = async () => {
      const res = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${res.data}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };
    if (!userInfo) {
      history.push("/login");
    }

    if (!order || order._id !== orderId) {
      dispatch(getOrderDetails(orderId));
    }

    if (!order || successPay || deliverSuccess) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }

    dispatch(getUserList());
    // eslint-disable-next-line
  }, [success, orderId, successPay, deliverSuccess]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  const handleDeliver = (id) => {
    dispatch(deliverOrder(id));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      {deliverLoading && <Loader />}
      <Row>
        <Col md={8}>
          <ListGroup>
            <ListGroup.Item>
              <h2>Shipping</h2>

              <p>
                {" "}
                <strong>Name :</strong> {order.user.name}
              </p>
              <p>
                <strong>Email :</strong>
                <a
                  href={`mailto:${order.user.name}`}>{`mailto:${order.user.name}`}</a>
              </p>

              <p>
                <strong>Address : </strong> {order.shippingAddress.address},
                {order.shippingAddress.city},{order.shippingAddress.postalCode},
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.DeliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method : </strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Pain on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          <strong>
                            {item.quantity} x {item.price} ={" "}
                            {item.quantity * item.price}
                          </strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            {deliverError && <Message variant="danger">{deliverError}</Message>}
            {userInfo &&
              !order.isDelivered &&
              userInfo.isAdmin &&
              order.isPaid && (
                <ListGroup className="mt-3">
                  <ListGroup.Item>
                    <Button
                      className="btn btn-dark btn-block"
                      type="button"
                      onClick={() => handleDeliver(order._id)}>
                      Mark as Delivered
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              )}
          </Card>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>{order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>{order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>{order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total Price</Col>
                  <Col>{order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
