import { Card, CardGroup } from "react-bootstrap";

const TrainingSession = ({ trainingSessions, trainingDay }) => {
  const day = trainingSessions.filter(
    (trainingSessions) =>
      trainingSessions.name.split(" ")[0] ===
      trainingDay.charAt(0).toUpperCase() + trainingDay.slice(1)
  );

  return (
    <>
      <h4 className="bg-warning text-center py-2 text-white mb-0">
        {trainingDay}
      </h4>
      <CardGroup className="text-center">
        {day.map((trainingSession) => (
          <Card className="mb-2" key={trainingSession._id}>
            <Card.Body>
              <Card.Title>{trainingSession.name} Class</Card.Title>
              <Card.Subtitle className="text-muted">
                {trainingSession.times}
              </Card.Subtitle>
              <Card.Text>{trainingSession.location}</Card.Text>
            </Card.Body>
            <Card.Footer>
              Number of places available:{" "}
              {trainingSession.capacity - trainingSession.numberBooked}
            </Card.Footer>
          </Card>
        ))}
      </CardGroup>
    </>
  );
};
export default TrainingSession;
