import { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { listOrders } from "../actions/orderActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ListOrdersScreen = ({ history }) => {
  const [paid, setPaid] = useState("paid");
  const [collection, setReady] = useState("notReady");

  const dispatch = useDispatch();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  useEffect(() => {
    if (!memberInfo) {
      history.push("/login");
    } else if (!member.isShopAdmin) {
      history.push("/profile");
    } else {
      dispatch(listOrders());
    }
  }, [dispatch, history, memberInfo, member]);

  let filteredOrders = null;
  if (orders) {
    if (paid === "all") {
      filteredOrders = orders;
    } else if (paid === "paid") {
      filteredOrders = orders.filter((order) => order.isPaid === true);
    } else {
      filteredOrders = orders.filter((order) => order.isPaid === false);
    }
  }

  if (filteredOrders !== null) {
    if (collection === "all") {
    } else if (collection === "ready") {
      filteredOrders = filteredOrders.filter(
        (order) => order.isDelivered === true
      );
    } else {
      filteredOrders = filteredOrders.filter(
        (order) => order.isDelivered === false
      );
    }
  }

  return (
    <Container fluid="lg">
      <Link className="btn btn-dark" to="/admin">
        <i className="fas fa-arrow-left"></i> Return
      </Link>
      <h3 className="text-center border-bottom border-warning pb-1">
        Order List
      </h3>
      {loading ? (
        <Loader variant="warning" />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table
            striped
            bordered
            hover
            responsive
            className="table-sm text-center"
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Member</th>
                <th>Date</th>
                <th>Total</th>
                {paid === "unpaid" ? (
                  <th onClick={() => setPaid("paid")} className="pointer">
                    Paid (Unpaid) <i className="fas fa-sort"></i>
                  </th>
                ) : paid === "paid" ? (
                  <th onClick={() => setPaid("all")} className="pointer">
                    Paid (Paid) <i className="fas fa-sort"></i>
                  </th>
                ) : (
                  <th onClick={() => setPaid("unpaid")} className="pointer">
                    Paid (All) <i className="fas fa-sort"></i>
                  </th>
                )}
                {collection === "notReady" ? (
                  <th onClick={() => setReady("ready")} className="pointer">
                    Ready For Collection (Not Ready){" "}
                    <i className="fas fa-sort"></i>
                  </th>
                ) : collection === "ready" ? (
                  <th onClick={() => setReady("all")} className="pointer">
                    Ready For Collection (Ready) <i className="fas fa-sort"></i>
                  </th>
                ) : (
                  <th onClick={() => setReady("notReady")} className="pointer">
                    Ready For Collection (All) <i className="fas fa-sort"></i>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>
                    {order.member && (
                      <Link to={`/shopadmin/members/${order.member._id}`}>
                        {order.member.firstName} {order.member.lastName}
                      </Link>
                    )}
                  </td>

                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>£{order.totalPrice.toFixed(2)}</td>
                  <td className="text-center">
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td className="text-center">
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <Link to={`/order/${order._id}`}>
                      <Button variant="light" className="btn-sm">
                        Details
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default ListOrdersScreen;
