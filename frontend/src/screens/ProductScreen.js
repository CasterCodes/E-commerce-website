import React, { useEffect, useState } from "react";
import Rating from "../components/Rating";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Row,
  Col,
  Button,
  Image,
  Card,
  ListGroup,
  Form,
} from "react-bootstrap";
import { productDetails, reviewCreate } from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productContants";
import Meta from "../components/Meta";

import Loader from "../components/Loader";
import Message from "../components/Message";

const ProductScreen = ({ history, match }) => {
  const [quantity, setQuantity] = useState(1);

  const [rating, setRating] = useState(0);

  const [comment, setComment] = useState("");

  const dispatch = useDispatch();

  const productInfo = useSelector((state) => state.product);

  const { product, error, loading } = productInfo;

  const createReview = useSelector((state) => state.createReview);

  const user = useSelector((state) => state.user);

  const { userInfo } = user;

  const {
    loading: reviewLoading,
    success: reviewSuccess,
    error: reviewError,
  } = createReview;

  useEffect(() => {
    if (reviewSuccess) {
      alert("Rview Created");
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    if (reviewError) {
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(productDetails(match.params.id));
  }, [match, dispatch, reviewSuccess, reviewError]);

  const addToCartHandler = () => {
    history.push(`/cart/${product._id}?qty=${quantity}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(reviewCreate(match.params.id, { rating, comment }));
  };

  return (
    <>
      <Link to="/" className="btn btn-dark my-3">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price Ksh {product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Col>Price : </Col>
                    <Col>
                      <strong>Ksh {product.price}</strong>
                    </Col>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Col>Status: </Col>

                    <Col>
                      {product.countInStock ? "In Stock" : "Out of Stock"}
                    </Col>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Quantity</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}>
                            {" "}
                            {[...Array(product.countInStock).keys()].map(
                              (count) => (
                                <option key={count + 1} value={count + 1}>
                                  {count + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      className="btn btn-block btn-dark"
                      type="button"
                      onClick={addToCartHandler}
                      disabled={product.countInStock === 0}>
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h2>Product Reviews</h2>
              {!loading && product && product.reviews.length === 0 && (
                <Message>No Reviews</Message>
              )}

              <ListGroup variant="flush">
                {product &&
                  !loading &&
                  product.reviews.map((review) => (
                    <ListGroup.Item key={review._id}>
                      <strong>{review.name}</strong>
                      <Rating value={review.rating} />
                      <p>{review.createdAt.substring(0, 10)}</p>
                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>
                  {reviewSuccess && (
                    <Message variant="success">
                      Review submitted successfully
                    </Message>
                  )}
                  {reviewLoading && <Loader />}
                  {reviewError && (
                    <Message variant="danger">{reviewError}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}>
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          value={comment}
                          onChange={(e) =>
                            setComment(e.target.value)
                          }></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={reviewLoading}
                        type="submit"
                        variant="primary">
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login">sign in</Link> to write a review{" "}
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
