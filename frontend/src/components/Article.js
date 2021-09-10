import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import FormatDate from "./FormatDate";

const Article = ({ article }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/article/${article._id}`}>
        <Card.Img src={article.image} variant="top" />
      </Link>
      <Card.Body>
        <Link to={`/article/${article._id}`}>
          <Card.Title as="div">
            <strong>{article.title}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <div className="my-3">{article.leader}</div>
          <div className="text-white">{article.author}</div>
          <small className="text-white">
            <FormatDate date={article.dateCreated} />
          </small>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Article;
