import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Image, ListGroup, Container } from "react-bootstrap";
import Article from "../components/Article";
import FormatDate from "../components/FormatDate";
import { listArticle } from "../actions/articleActions";
import { listArticles } from "../actions/articleActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ArticleScreen = ({ match }) => {
  const dispatch = useDispatch();

  const displayArticle = useSelector((state) => state.displayArticle);
  const { loadingArticle, errorArticle, article } = displayArticle;

  const articleList = useSelector((state) => state.articleList);
  const { loadingArticles, errorArticles, articles } = articleList;

  useEffect(() => {
    dispatch(listArticle(match.params.id));
    dispatch(listArticles());
  }, [dispatch, match]);

  const articleId = article._id;
  const moreArticles = articles.filter((article) => article._id !== articleId);

  return (
    <Container>
      <Row>
        <Col md={8}>
          {loadingArticle ? (
            <Loader variant="warning" />
          ) : errorArticle ? (
            <Message variant="warning" heading="Article failed to load">
              {errorArticle}
            </Message>
          ) : (
            <div>
              <Image src={article.image} alt={article.title} />
              <ListGroup>
                <h3 className="p-2">{article.title}</h3>
                <ListGroup.Item className="bg-primary">
                  <FormatDate date={article.dateCreated} />
                  <br></br>Author: {article.author}
                  <br></br>
                  Category: {article.category}
                </ListGroup.Item>
                <ListGroup.Item className="bg-dark">
                  <p className="text-white">{article.leader}</p>
                  <p>{article.body}</p>
                </ListGroup.Item>
                <Link className="btn btn-primary my-3" to="/news">
                  Return to news articles
                </Link>
              </ListGroup>
            </div>
          )}
        </Col>
        <Col md={4} className="bg-primary mb-2">
          <h5 className="text-center text-white pt-2">More news articles</h5>
          {loadingArticles ? (
            <Loader variant="warning" />
          ) : errorArticles ? (
            <Message variant="warning" heading="Error loading articles">
              {errorArticles}
            </Message>
          ) : (
            <div>
              {moreArticles.slice(0, 3).map((article) => (
                <Article article={article} key={article._id} />
              ))}
            </div>
          )}
          <Link className="btn btn-block btn-primary my-3" to="/news">
            Read more news articles
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default ArticleScreen;
