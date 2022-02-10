import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import FormatDate from "./FormatDate";

const ArticleSidebar = ({ article }) => {
  return (
    <Card className="p-2 rounded h-100 mb-2">
      <Link to={`/article/${article._id}`}>
        <Card.Img src={article.image} alt="article" className="mb-2" />
      </Link>
      <Link to={`/article/${article._id}`} className="text-decoration-none">
        <div>
          <h5>
            <strong>{article.title}</strong>
          </h5>

          <div className="my-3">{article.leader}</div>
        </div>
        <Card.Footer>
          <div>{article.author}</div>
          <small>
            <FormatDate date={article.dateCreated} />
          </small>
        </Card.Footer>
      </Link>
    </Card>
  );
};

export default ArticleSidebar;
