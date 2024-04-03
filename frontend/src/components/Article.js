import { Link } from "react-router-dom";
import { Button, Card, Col, Row } from "react-bootstrap";
import FormatDate from "./FormatDate";

const Article = ({ article }) => {
  return (
    <Row className="p-2 rounded h-100 bg-grey">
      <Col md="5" className="p-0 align-self-center">
        <Link to={`/article/${article._id}`}>
          <div>
            <img
              src={`${article.carouselImages[0].original}`}
              alt="article"
              width="100%"
              height="300"
              style={{ width: "100%", objectFit: "contain" }}
            />
          </div>
        </Link>
      </Col>
      <Col md="7">
        <Link to={`/article/${article._id}`} className="text-decoration-none">
          <Card className="h-100">
            <div className="bg-primary p-2 m-0 text-white">
              <p className="my-1">{article.title}</p>
            </div>
            <Card.Body>
              <div className="my-3">{article.leader}</div>
            </Card.Body>
            <Card.Footer>
              <div>Author: {article.author}</div>
              <div>Category: {article.category}</div>
              <small>
                <FormatDate date={article.dateCreated} />
              </small>
              <Button variant="link" className="w-100 btn-sm">
                Read Article
              </Button>
            </Card.Footer>
          </Card>
        </Link>
      </Col>
    </Row>
  );
};

export default Article;
