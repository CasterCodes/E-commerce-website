import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../actions/cartAction";
import { Link } from "react-router-dom";
import Message from "../components/Message";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";

const CartScreen = ({ match, location, history }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const productId = match.params.id;
  const productQuantity = location.search ? +location.search.split("=")[1] : 1;

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, productQuantity));
    }
  }, [dispatch, productQuantity, productId]);

  const handleRemoveFromCart = (id) => dispatch(removeFromCart(id));

  const handleCheckout = () => history.push("/login?redirect=shipping");
  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message variant="info">
            <h4>
              {" "}
              Your cart is empty{" "}
              <Link to="/" style={{ display: "inline" }}>
                Go Back
              </Link>
            </h4>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={3}>{item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.quantity}
                      onChange={(e) =>
                        dispatch(addToCart(item.product, +e.target.value))
                      }>
                      {" "}
                      {[...Array(item.countInStock).keys()].map((count) => (
                        <option key={count + 1} value={count + 1}>
                          {count + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      variant="light"
                      type="button"
                      onClick={() => handleRemoveFromCart(item.product)}>
                      Remove
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup>
            <ListGroup.Item>
              <h2>
                Subtotal (
                {cartItems.reduce((accum, item) => accum + item.quantity, 0)})
                items
              </h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <h3>
                Total {"  "}
                {cartItems
                  .reduce(
                    (accum, item) => accum + item.quantity * item.price,
                    0
                  )
                  .toFixed(2)}
              </h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cartItems === 0}
                onClick={() => handleCheckout()}>
                Proceed to Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
