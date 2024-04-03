import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import FormatDate from "./FormatDate";
import { Button } from "react-bootstrap";

const ArticleSidebar = ({ article }) => {
  return (
    <Card className="p-2 rounded h-100 mb-2">
      <Link to={`/article/${article._id}`}>
        <Card.Img
          src={`${article.carouselImages[0].original}`}
          alt="article"
          className="mb-2"
          width="100%"
          height="300"
          style={{ width: "100%", objectFit: "contain" }}
        />
      </Link>
      <Link to={`/article/${article._id}`} className="text-decoration-none">
        <div className="bg-primary text-white p-1">
          <p className="mb-0">{article.title}</p>
          <small>
            <FormatDate date={article.dateCreated} />
          </small>
        </div>
        <div>
          <div className="my-1">
            <small>{article.leader}</small>
          </div>
        </div>
        <Card.Footer className="text-center">
          <Button variant="link btn-sm w-100 mb-2">Read More...</Button>
        </Card.Footer>
      </Link>
    </Card>
  );
};

export default ArticleSidebar;
