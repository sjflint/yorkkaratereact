// Clear 'cancelDirectDebit' redux state on page load

import axios from "axios";
import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useSelector } from "react-redux";

const MembershipCancelledScreen = () => {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const memberDetails = useSelector((state) => state.memberDetails);
  const { member } = memberDetails;

  const onSubmit = (e) => {
    e.preventDefault();

    const data = {
      id: member._id,
      feedback: feedback,
    };

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      axios
        .post(
          "/sendFeedback",
          {
            data,
          },
          config
        )
        .then((res) => {
          if (res.data) {
            setSubmitted(true);
          }
        });
    } catch (error) {}
  };

  return (
    <Container className="mt-3">
      <h1 className="text-danger">Membership Cancelled</h1>
      <h5>Your membership to York Karate Dojo has been cancelled.</h5>
      <p>
        We're sorry to see you leave. We would be very greatful if you could
        give us a brief explanation of why, so that we can improve in the
        future.
      </p>
      {submitted === false ? (
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="cancelledFeedback">
            <Form.Control
              as="textarea"
              placeholder="Feedback"
              rows={5}
              value={feedback}
              onChange={(f) => setFeedback(f.target.value)}
            />
          </Form.Group>
          <Button type="submit" className="btn btn-block btn-warning">
            Submit Feedback
          </Button>
        </Form>
      ) : (
        <h5 className="text-center text-warning">Thank You</h5>
      )}
    </Container>
  );
};

export default MembershipCancelledScreen;
