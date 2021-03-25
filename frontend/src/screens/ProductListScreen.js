import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listProducts,
  productDelete,
  productCreate,
} from "../actions/productActions";

import { PRODUCT_CREATE_RESET } from "../constants/productContants";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import Paginate from "../components/Paginate";

const ProductListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1;
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);

  const { loading, error, products, page, pages } = productList;

  const user = useSelector((state) => state.user);

  const { userInfo } = user;

  const deleteProduct = useSelector((state) => state.deleteProduct);

  const createProduct = useSelector((state) => state.createProduct);

  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = createProduct;

  const {
    loading: deleteLoading,
    error: deleteError,
    success: successDelete,
  } = deleteProduct;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }

    if (successCreate) {
      history.push(`/admin/product/edit/${createdProduct._id}`);
    } else {
      dispatch(listProducts("", pageNumber));
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
  ]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you")) {
      dispatch(productDelete(id));
    }
  };

  const handleCreateProduct = () => {
    dispatch(productCreate());
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Product List</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={handleCreateProduct}>
            Create Product
          </Button>
        </Col>
      </Row>
      {deleteError && <Message variant="danger">{deleteError}</Message>}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loadingCreate && <Loader />}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Price</th>
                <th>Caterory</th>
                <th>Brand</th>
                <th>Edit Action</th>
                <th>Delete Action</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <Message variant="success" className="py-4">
                  There are no products
                </Message>
              ) : (
                products.map((product) => (
                  <tr key={product._id}>
                    <th>{product._id}</th>
                    <th>{product.name}</th>
                    <th>{product.price}</th>
                    <th>{product.category}</th>
                    <th>{product.brand}</th>

                    <th>
                      <LinkContainer to={`/admin/product/edit/${product._id}`}>
                        <Button className="btn btn-sm btn-success">Edit</Button>
                      </LinkContainer>
                    </th>
                    <th>
                      <Button
                        className="btn btn-sm btn-danger ml-2"
                        onClick={() => handleDelete(product._id)}>
                        Delete {deleteLoading && "..."}
                      </Button>
                    </th>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={userInfo.isAdmin} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
