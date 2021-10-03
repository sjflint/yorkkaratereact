import { Link } from "react-router-dom";
import { Card, Col, Row } from "react-bootstrap";
import FormatDate from "./FormatDate";

const Article = ({ article }) => {
  return (
    <Row className="p-2 rounded h-100 bg-primary">
      <Col md="5">
        <Link to={`/article/${article._id}`}>
          <img src={article.image} alt="article" className="mb-2" />
        </Link>
      </Col>
      <Col md="7">
        <Link to={`/article/${article._id}`}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>
                <h5>
                  <strong>{article.title}</strong>
                </h5>
              </Card.Title>

              <div className="my-3">{article.leader}</div>
            </Card.Body>
            <Card.Footer>
              <div className="text-white">Author: {article.author}</div>
              <div className="text-white">Category: {article.category}</div>
              <small className="text-white">
                <FormatDate date={article.dateCreated} />
              </small>
            </Card.Footer>
          </Card>
        </Link>
      </Col>
    </Row>
  );
};

export default Article;
