import { useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
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
    filteredOrders = orders.filter((order) => order.isPaid === true);
  }

  return (
    <>
      <img src={dojoImg} alt="dojo" />
      <h2 className="border-bottom border-warning mt-2 mb-2 text-warning">
        Orders
      </h2>
      {loading ? (
        <Loader variant="warning" />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : orders.length === 0 ? (
        <h5>No Orders to show</h5>
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
                      <button className="btn btn-primary">View Order</button>
                    </Link>
                  </Col>
                  <Col>
                    Payment Status: <br />{" "}
                    {order.isPaid ? (
                      "Paid"
                    ) : (
                      <Link to={`/order/${order._id}`}>Not Paid</Link>
                    )}
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                {order.orderItems.map((item) => (
                  <Row className="my-2" key={item._id}>
                    <Col xs={2}>
                      <img src={item.image} alt={item.name} />
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
    </>
  );
};

export default MemberOrders;
