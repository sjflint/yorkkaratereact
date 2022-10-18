import { useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { listMyOrders } from "../../actions/orderActions";
import dojoImg from "../../img/dojo.jpeg";
import Loader from "../Loader";
import Message from "../Message";

const MemberOrders = () => {
  const dispatch = useDispatch();

  const myOrderList = useSelector((state) => state.myOrderList);
  const { loading, error, orders } = myOrderList;

  useEffect(() => {
    dispatch(listMyOrders());
  }, [dispatch]);

  const formatDate = (date) => {
    let newDate = new Date(date);
    const getDay = newDate.getDate();
    const getMonth = newDate.getMonth();
    const getYear = newDate.getFullYear();
    newDate = `${getDay}/${getMonth + 1}/${getYear}`;
    return newDate;
  };

  let filteredOrders;
  if (orders) {
    filteredOrders = orders.filter(
      (order) => order.isPaid !== "false" && order.isCollected !== "true"
    );
  }

  return (
    <>
      <img src={dojoImg} alt="dojo" />
      <h2 className="border-bottom border-warning mt-2 mb-2 text-warning text-center">
        Orders
      </h2>
      {loading ? (
        <Loader variant="warning" />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : filteredOrders.length === 0 ? (
        <p>No Orders to show</p>
      ) : (
        <>
          {filteredOrders.map((order) => (
            <Card key={order._id} className="my-2">
              <Card.Header>
                <Row>
                  <Col>
                    Order Placed: <br /> {formatDate(order.createdAt)}
                  </Col>
                  <Col>
                    Total Amount: <br /> £{order.totalPrice.toFixed(2)}
                  </Col>
                  <Col className="align-self-center">
                    <Link to={`/order/${order._id}`}>
                      <button className="btn btn-primary btn-sm">
                        View Order
                      </button>
                    </Link>
                  </Col>
                  <Col>
                    Payment Status: <br />{" "}
                    {order.isPaid === "true" ? "Paid" : "Pending"}
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                {order.orderItems.map((item) => (
                  <Row className="my-2 bg-light" key={item._id}>
                    <Col xs={2}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="bg-primary p-1"
                      />
                    </Col>
                    <Col xs={4}>
                      <Link to={`/products/${item.product}`}>
                        {item.name} <br />
                        {item.print}
                      </Link>
                    </Col>
                  </Row>
                ))}
              </Card.Body>
            </Card>
          ))}
        </>
      )}
      <div className="text-center">
        <Link to="/shop" className="w-50 py-1 btn btn-sm btn-outline-primary">
          <i className="fa-solid fa-store fa-2x"></i>{" "}
          <p className="d-inline">Go Shopping!</p>
        </Link>
      </div>
    </>
  );
};

export default MemberOrders;
