import { ListGroup } from "react-bootstrap";
import { FormControl } from "react-bootstrap";
import { Table } from "react-bootstrap";
import { InputGroup, Modal } from "react-bootstrap";
import { Container, Row, Card, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { listTrainingSessions } from "../actions/trainingSessionActions";
import { membersList } from "../actions/memberActions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  listFinancials,
  updateFinancials,
  listMonthlyCosts,
  updateMonthlyCosts,
  deleteMonthlyCost,
} from "../actions/financialActions";
import LineChart from "../components/ChartComponents/LineChart";

const FinanceScreen = ({ history }) => {
  const [showFees, setShowFees] = useState(false);
  const [editFees, setEditFees] = useState(false);
  const [baseFees, setBaseFees] = useState(0);
  const [joiningFee, setJoiningFee] = useState(0);
  const [additionalFees, setAdditionalFees] = useState(0);
  const [extraFee, setExtraFee] = useState(0);
  const [gradingFees, setGradingFees] = useState(0);
  const [trainingCourseFees, setTrainingCourseFees] = useState(0);
  const [showMonthlyCosts, setShowMonthlyCosts] = useState(false);
  const [name, setName] = useState("");
  const [cost, setCost] = useState(0);
  const [costId, setCostId] = useState("");
  const [memberChartData, setMemberChartData] = useState();
  const [financialChartData, setFinancialChartData] = useState();

  const dispatch = useDispatch();

  const memberLogin = useSelector((state) => state.memberLogin);
  const { memberInfo } = memberLogin;

  const financialList = useSelector((state) => state.financialList);
  const {
    loading: financialsLoading,
    financials,
    error: financialsError,
  } = financialList;

  const financialUpdate = useSelector((state) => state.financialUpdate);
  const { loading: financialUpdateLoading, error: financialUpdateError } =
    financialUpdate;

  const monthlyCostList = useSelector((state) => state.monthlyCostList);
  const {
    loading: monthlyCostsLoading,
    error: monthlyCostsError,
    monthlyCosts,
  } = monthlyCostList;

  const listMembers = useSelector((state) => state.listMembers);
  const { memberList } = listMembers;

  const trainingSessionsList = useSelector(
    (state) => state.trainingSessionsList
  );
  const {
    loading: sessionsLoading,
    error: sessionsError,
    trainingSessions,
  } = trainingSessionsList;

  useEffect(() => {
    if (!memberInfo) {
      history.push("/login?redirect=/profile");
    } else if (!memberInfo.isAdmin) {
      history.push("/profile");
    } else {
      dispatch(membersList(0, "all"));
      dispatch(listTrainingSessions());
      dispatch(listFinancials());
      dispatch(listMonthlyCosts());
    }
  }, [dispatch, memberInfo, history]);

  const handleFeeChange = async () => {
    const newFees = {
      baseLevelTrainingFees: baseFees,
      joiningFee: joiningFee,
      costOfAdditionalClass: additionalFees,
      costOfExtraFee: extraFee,
      costOfGrading: gradingFees,
      costOfTrainingCourse: trainingCourseFees,
    };

    await dispatch(updateFinancials(newFees));
    await dispatch(listFinancials());
    setEditFees(false);
  };

  const updateCost = (cost) => {
    if (cost) {
      setName(cost.name);
      setCost(cost.cost);
      setCostId(cost._id);
    }
    setShowMonthlyCosts(true);
  };

  const updateMonthlyCost = async () => {
    const costs = {
      _id: costId,
      name: name,
      cost: cost,
    };
    await dispatch(updateMonthlyCosts(costs));
    await dispatch(listMonthlyCosts());
  };

  const deleteCost = async () => {
    await dispatch(deleteMonthlyCost(costId));
    await dispatch(listMonthlyCosts());
    setShowMonthlyCosts(false);
  };

  // total costs
  let totalCosts = [];
  let totalCost;
  if (monthlyCosts) {
    monthlyCosts.forEach((cost) => {
      totalCosts.push(cost.cost);
    });
    const initialValue = 0;
    totalCost = totalCosts.reduce(
      (prevValue, currValue) => prevValue + currValue,
      initialValue
    );
  }

  // total income
  let totalFees = [];
  let totalIncome;
  let totalMembers = 0;
  let totalMembersDelta = 0;

  // total income
  if (memberList && financials) {
    memberList.forEach((member) => {
      if (member.ddsuccess) {
        totalFees.push(Number(member.trainingFees));
        totalMembers++;
      }
    });
    totalMembersDelta =
      totalMembers - financials.totalMembers.at(-1).totalMembers;
  }
  const initialValue = 0;
  totalIncome = totalFees.reduce((prev, curr) => prev + curr, initialValue);
  totalIncome = totalIncome / 100;

  // construct data for chart
  if (!memberChartData && financials) {
    setMemberChartData({
      labels: financials.totalMembers.map((date) =>
        new Date(date.date).toLocaleDateString("en-GB")
      ),
      datasets: [
        {
          label: "Total Members",
          data: financials.totalMembers.map(
            (totalMembers) => totalMembers.totalMembers
          ),
          backgroundColor: ["#1f9bcf"],
          borderColor: ["#1f9bcf"],
        },
        {
          label: "Target Members",
          data: financials.totalMembers.map(() => 200),
          backgroundColor: ["white"],
          borderColor: ["white"],
        },
        {
          label: "",
          data: financials.totalMembers.map(() => 150),
          backgroundColor: ["black"],
          borderColor: ["black"],
        },
        {
          label: "",
          data: financials.totalMembers.map(() => 220),
          backgroundColor: ["black"],
          borderColor: ["black"],
        },
      ],
    });
    setFinancialChartData({
      labels: financials.totalMembers.map((date) =>
        new Date(date.date).toLocaleDateString("en-GB")
      ),
      datasets: [
        {
          label: "Training Fees",
          data: financials.totalMembers.map(
            (totalMembers) => totalMembers.totalIncome
          ),
          backgroundColor: ["green"],
          borderColor: ["green"],
        },
        {
          label: "Costs",
          data: financials.totalMembers.map(
            (totalMembers) => totalMembers.totalCosts
          ),
          backgroundColor: ["red"],
          borderColor: ["red"],
        },
        {
          label: "Profit/Loss",
          data: financials.totalMembers.map((totalMembers) =>
            totalMembers.profit.toFixed(2)
          ),
          backgroundColor: ["orange"],
          borderColor: ["orange"],
        },
        {
          label: "",
          data: financials.totalMembers.map(() => 5000),
          backgroundColor: ["black"],
          borderColor: ["black"],
        },
      ],
    });
  }

  return (
    <Container fluid="lg" className="mt-3">
      <div className="d-flex justify-content-between mb-2">
        <Link className="btn btn-outline-secondary py-0" to="/admin">
          <i className="fas fa-arrow-left"></i> Return
        </Link>
      </div>
      <h3 className="text-center border-bottom border-warning pb-1">
        Financial Summary
      </h3>
      <Row>
        <Col md={8}>
          <Card className="mb-5">
            <Card.Header>Summary</Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <Row className="mb-2">
                  <Col>
                    <ListGroup.Item className="d-flex justify-content-between bg-success text-white">
                      <small>Income:</small>
                      <small>
                        {Number(totalIncome).toLocaleString("en-GB", {
                          style: "currency",
                          currency: "GBP",
                        })}
                      </small>
                    </ListGroup.Item>
                  </Col>
                  <Col>
                    <ListGroup.Item className="d-flex justify-content-between bg-danger text-white">
                      {" "}
                      <small>Costs:</small>
                      <small>
                        {Number(totalCost).toLocaleString("en-GB", {
                          style: "currency",
                          currency: "GBP",
                        })}
                      </small>
                    </ListGroup.Item>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <ListGroup.Item className="d-flex justify-content-between bg-warning text-white">
                      {" "}
                      <small>Profit/Loss:</small>
                      <small>
                        {(totalIncome - totalCost).toLocaleString("en-GB", {
                          style: "currency",
                          currency: "GBP",
                        })}
                      </small>
                    </ListGroup.Item>
                  </Col>
                  <Col>
                    <ListGroup.Item className="d-flex justify-content-between bg-info text-white">
                      <small>Total Members:</small>

                      <small>
                        {totalMembers}
                        {totalMembersDelta > 0 ? (
                          <small className="text-success">
                            (+{totalMembersDelta})
                          </small>
                        ) : totalMembersDelta < 0 ? (
                          <small className="text-danger">
                            ({totalMembersDelta})
                          </small>
                        ) : (
                          ""
                        )}
                      </small>
                    </ListGroup.Item>
                  </Col>
                </Row>
              </ListGroup>
              {memberChartData && financialChartData && (
                <>
                  <LineChart
                    chartData={memberChartData}
                    options={{
                      scales: {
                        yAxis: {
                          min: 100,
                          max: 200,
                        },
                      },
                    }}
                  />
                  <LineChart
                    chartData={financialChartData}
                    options={{
                      scales: {
                        yAxis: {
                          min: 100,
                          max: 200,
                        },
                      },
                    }}
                  />
                </>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-5">
            <Card.Header>Financials per class</Card.Header>
            {sessionsLoading ? (
              <Loader variant="default" />
            ) : sessionsError ? (
              <Message>{sessionsError}</Message>
            ) : (
              trainingSessions.map((trainingSession) => (
                <Card.Body className="text-center" key={trainingSession._id}>
                  <h5 key={trainingSession._id} className="text-center">
                    {trainingSession.name}
                  </h5>
                  <Link to="/admin/editclasses">
                    <Button variant="outline-secondary btn-sm py-0 mb-1">
                      edit
                    </Button>
                  </Link>
                  <Table
                    striped
                    bordered
                    hover
                    responsive
                    className="table-sm text-center table-font-size"
                  >
                    <thead>
                      <tr>
                        <td># members</td>
                        <td>Income</td>
                        <td>Cost of hire</td>
                        <td>Profit / loss</td>
                        <td>Places Available</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{trainingSession.numberBooked}</td>
                        <td>
                          £{(trainingSession.numberBooked * 21.0).toFixed(2)}
                          {/* Calculate avarage income per member */}
                        </td>

                        <td>
                          {trainingSession.hallHire.toLocaleString("en-GB", {
                            style: "currency",
                            currency: "GBP",
                          })}
                        </td>
                        <td>
                          {(
                            trainingSession.numberBooked * 21.0 -
                            trainingSession.hallHire
                          ).toLocaleString("en-GB", {
                            style: "currency",
                            currency: "GBP",
                          })}
                          {/* Use average income per member when available */}
                        </td>
                        <td>
                          {trainingSession.capacity -
                            trainingSession.numberBooked}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              ))
            )}
          </Card>
        </Col>
        <Col>
          <Card className="mb-5">
            <Card.Header>Set Training/Grading Fees</Card.Header>
            <Card.Body>
              {financialsLoading || financialUpdateLoading ? (
                <div className="text-center text-warning">
                  <Loader variant="warning" />
                  <small>Please don't navigate or refresh page</small>
                </div>
              ) : financialUpdateError ? (
                <Message variant="warning">{financialUpdateError}</Message>
              ) : financials ? (
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <div>Base Level Training Fees</div>
                    {editFees ? (
                      <InputGroup>
                        <InputGroup.Text>£</InputGroup.Text>
                        <FormControl
                          className="mb-0 bg-light"
                          type="number"
                          onChange={(e) => setBaseFees(e.target.value)}
                          value={baseFees}
                        />
                      </InputGroup>
                    ) : (
                      <InputGroup>
                        <InputGroup.Text>£</InputGroup.Text>
                        <FormControl
                          value={(
                            financials.baseLevelTrainingFees / 100
                          ).toFixed(2)}
                          className="mb-0 bg-light"
                          type="number"
                          disabled
                        />
                      </InputGroup>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div>Club Joining Fee</div>
                    {editFees ? (
                      <InputGroup>
                        <InputGroup.Text>£</InputGroup.Text>
                        <FormControl
                          className="mb-0 bg-light"
                          type="number"
                          onChange={(e) => setJoiningFee(e.target.value)}
                          value={joiningFee}
                        />
                      </InputGroup>
                    ) : (
                      <InputGroup>
                        <InputGroup.Text>£</InputGroup.Text>
                        <FormControl
                          value={(financials.joiningFee / 100).toFixed(2)}
                          className="mb-0 bg-light"
                          type="number"
                          disabled
                        />
                      </InputGroup>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div>Cost of adding an additional class to membership</div>
                    {editFees ? (
                      <InputGroup>
                        <InputGroup.Text>£</InputGroup.Text>
                        <FormControl
                          className="mb-0 bg-light"
                          type="number"
                          value={additionalFees}
                          onChange={(e) => setAdditionalFees(e.target.value)}
                        />
                      </InputGroup>
                    ) : (
                      <InputGroup>
                        <InputGroup.Text>£</InputGroup.Text>
                        <FormControl
                          disabled
                          className="mb-0 bg-light"
                          type="number"
                          value={(
                            financials.costOfAdditionalClass / 100
                          ).toFixed(2)}
                        />
                      </InputGroup>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div>Cost of attending a one-off, extra class</div>
                    {editFees ? (
                      <InputGroup>
                        <InputGroup.Text>£</InputGroup.Text>
                        <FormControl
                          className="mb-0 bg-light"
                          type="number"
                          value={extraFee}
                          onChange={(e) => setExtraFee(e.target.value)}
                        />
                      </InputGroup>
                    ) : (
                      <InputGroup>
                        <InputGroup.Text>£</InputGroup.Text>
                        <FormControl
                          disabled
                          className="mb-0 bg-light"
                          type="number"
                          value={(financials.costOfExtraFee / 100).toFixed(2)}
                        />
                      </InputGroup>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div>Cost of grading fees</div>
                    {editFees ? (
                      <InputGroup>
                        <InputGroup.Text>£</InputGroup.Text>
                        <FormControl
                          onChange={(e) => setGradingFees(e.target.value)}
                          value={gradingFees}
                          className="mb-0 bg-light"
                          type="number"
                        />
                      </InputGroup>
                    ) : (
                      <InputGroup>
                        <InputGroup.Text>£</InputGroup.Text>
                        <FormControl
                          disabled
                          value={(financials.costOfGrading / 100).toFixed(2)}
                          className="mb-0 bg-light"
                          type="number"
                        />
                      </InputGroup>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div>Cost of training course</div>
                    {editFees ? (
                      <InputGroup>
                        <InputGroup.Text>£</InputGroup.Text>
                        <FormControl
                          onChange={(e) =>
                            setTrainingCourseFees(e.target.value)
                          }
                          value={trainingCourseFees}
                          className="mb-0 bg-light"
                          type="number"
                        />
                      </InputGroup>
                    ) : (
                      <InputGroup>
                        <InputGroup.Text>£</InputGroup.Text>
                        <FormControl
                          disabled
                          value={(
                            financials.costOfTrainingCourse / 100
                          ).toFixed(2)}
                          className="mb-0 bg-light"
                          type="number"
                        />
                      </InputGroup>
                    )}
                  </ListGroup.Item>
                  <ListGroup>
                    {editFees ? (
                      <>
                        <Button
                          variant="outline-success btn-sm py-0 mb-1"
                          onClick={() => {
                            handleFeeChange();
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline-danger btn-sm py-0 mb-1"
                          onClick={() => setEditFees(false)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline-secondary btn-sm py-0 mb-2"
                        onClick={() => setShowFees(true)}
                      >
                        Edit
                      </Button>
                    )}
                  </ListGroup>
                </ListGroup>
              ) : (
                <Message variant="warning">{financialsError}</Message>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-5">
            {monthlyCosts && (
              <>
                <Card.Header>Monthly Costs</Card.Header>
                {monthlyCostsLoading ? (
                  <Loader variant="warning" />
                ) : monthlyCostsError ? (
                  <Message>{monthlyCostsError}</Message>
                ) : (
                  monthlyCosts.map((cost) => {
                    return (
                      <Card.Body key={cost._id}>
                        <ListGroup variant="flush">
                          <ListGroup.Item>
                            <div>{cost.name}</div>
                            <InputGroup>
                              <InputGroup.Text>£</InputGroup.Text>
                              <FormControl
                                className="mb-0 bg-light"
                                type="number"
                                value={cost.cost.toFixed(2)}
                                disabled
                              />
                            </InputGroup>
                          </ListGroup.Item>
                          <Button
                            variant="outline-secondary btn-sm py-0 mb-1"
                            onClick={() => updateCost(cost)}
                          >
                            Edit
                          </Button>
                        </ListGroup>
                      </Card.Body>
                    );
                  })
                )}
              </>
            )}

            <Button
              variant="outline-success btn-sm py-0 mb-1"
              onClick={() => updateCost()}
            >
              Create New Cost
            </Button>
          </Card>
        </Col>
      </Row>

      <Modal show={showFees} onHide={() => setShowFees(false)}>
        <Modal.Header className="bg-danger" closeButton>
          <Modal.Title className="text-white text-center">
            <i className="fas fa-warning"></i> WARNING - Edit club fees{" "}
            <i className="fas fa-warning"></i>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            Adjusting the fees here will amend direct debits and fees charged
            for all members and across the whole site.
          </p>
          <p>Are you sure you wish to proceed?</p>
        </Modal.Body>

        <Modal.Footer className="bg-danger">
          <Button variant="secondary" onClick={() => setShowFees(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setEditFees(true);
              setBaseFees(financials.baseLevelTrainingFees / 100);
              setAdditionalFees(financials.costOfAdditionalClass / 100);
              setExtraFee(financials.costOfExtraFee / 100);
              setGradingFees(financials.costOfGrading / 100);
              setJoiningFee(financials.joiningFee / 100);
              setShowFees(false);
            }}
          >
            <i className="fas fa-warning"></i> Proceed
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showMonthlyCosts} onHide={() => setShowMonthlyCosts(false)}>
        <Modal.Header className="bg-dark" closeButton>
          <Modal.Title className="text-white">Update Cost</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <InputGroup className="mb-2">
            <InputGroup.Text>Name</InputGroup.Text>
            <FormControl
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="mb-0 bg-light"
              type="text"
            />
          </InputGroup>
          <InputGroup>
            <InputGroup.Text>Cost (£)</InputGroup.Text>
            <FormControl
              onChange={(e) => setCost(e.target.value)}
              value={cost}
              className="mb-0 bg-light"
              type="text"
            />
          </InputGroup>
        </Modal.Body>

        <Modal.Footer className="bg-dark">
          <Button variant="danger" onClick={() => deleteCost()}>
            Delete
          </Button>
          <Button
            variant="success"
            onClick={() => {
              updateMonthlyCost();
              setShowMonthlyCosts(false);
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FinanceScreen;
