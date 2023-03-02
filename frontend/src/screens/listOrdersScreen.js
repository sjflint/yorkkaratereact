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
      history.push("/login?redirect=shopadmin/editorders");
    } else if (!memberInfo.isShopAdmin) {
      history.push("/profile");
    } else {
      dispatch(listOrders());
    }
  }, [dispatch, history, memberInfo, member]);

  let filteredOrders = null;
  if (orders) {
    if (paid === "all") {
      filteredOrders = orders.filter(
        (order) => order.isPaid === "true" || order.isPaid === "pending"
      );
    } else if (paid === "paid") {
      filteredOrders = orders.filter((order) => order.isPaid === "true");
    } else {
      filteredOrders = orders.filter((order) => order.isPaid === "pending");
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
    <Container fluid="lg" className="mt-3">
      <Link className="btn btn-outline-secondary py-0" to="/admin">
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
                <th>Member</th>
                <th>Date</th>
                <th>Total</th>
                {paid === "pending" ? (
                  <th onClick={() => setPaid("paid")} className="pointer">
                    Payment Status (pending) <i className="fas fa-sort"></i>
                  </th>
                ) : paid === "paid" ? (
                  <th onClick={() => setPaid("all")} className="pointer">
                    Payment Status (Paid) <i className="fas fa-sort"></i>
                  </th>
                ) : (
                  <th onClick={() => setPaid("pending")} className="pointer">
                    Payment Status (All) <i className="fas fa-sort"></i>
                  </th>
                )}
                {collection === "notReady" ? (
                  <th onClick={() => setReady("ready")} className="pointer">
                    Collection Status (Not Ready){" "}
                    <i className="fas fa-sort"></i>
                  </th>
                ) : collection === "ready" ? (
                  <th onClick={() => setReady("all")} className="pointer">
                    Collection Status (Ready) <i className="fas fa-sort"></i>
                  </th>
                ) : (
                  <th onClick={() => setReady("notReady")} className="pointer">
                    Collection Status (All) <i className="fas fa-sort"></i>
                  </th>
                )}
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>
                    {order.member && memberInfo.isAdmin ? (
                      <Link to={`/admin/members/${order.member._id}/edit`}>
                        {order.member.firstName} {order.member.lastName}
                      </Link>
                    ) : (
                      `${order.member.firstName} ${order.member.lastName}`
                    )}
                  </td>

                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>£{order.totalPrice.toFixed(2)}</td>
                  <td className="text-center">
                    {order.isPaid ? (
                      new Date(order.paidAt).toLocaleDateString()
                    ) : (
                      <small className="text-danger">Not paid</small>
                    )}
                  </td>
                  <td className="text-center">
                    {order.isDelivered ? (
                      new Date(order.deliveredAt).toLocaleDateString()
                    ) : (
                      <small className="text-danger">
                        Not ready for collection
                      </small>
                    )}
                  </td>
                  <td>
                    <Link to={`/order/${order._id}`}>
                      <Button variant="success" className="btn-sm">
                        <i className="fas fa-edit"></i>
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
