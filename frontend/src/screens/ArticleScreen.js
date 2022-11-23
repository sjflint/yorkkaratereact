import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Image, ListGroup, Container, Button } from "react-bootstrap";
import ArticleSidebar from "../components/ArticleSidebar";
import FormatDate from "../components/FormatDate";
import { listArticle } from "../actions/articleActions";
import { listArticles } from "../actions/articleActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ReactImageGallery from "react-image-gallery";
import Meta from "../components/Meta";

const ArticleScreen = ({ match, history }) => {
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

  const images = article.carouselImages;

  return (
    <Container className="mt-3">
      <Row>
        <Col md={8} className="mb-2">
          {loadingArticle ? (
            <Loader variant="warning" />
          ) : errorArticle ? (
            <Message variant="warning" heading="Article failed to load">
              {errorArticle}
            </Message>
          ) : (
            article.title && (
              <>
                <Meta title={article.title} description={article.leader} />

                <ListGroup>
                  <h3 className="p-2">{article.title}</h3>
                  <ListGroup.Item className="bg-light">
                    <Row className="align-items-center">
                      <Col xs={3} sm={2} className="p-0">
                        <Image
                          src={`${article.authorImg}`}
                          alt={article.author}
                          className="rounded-circle"
                        />
                      </Col>
                      <Col>
                        <FormatDate date={article.dateCreated} />
                        <br />
                        Category: {article.category}
                        <br />
                        Author: {article.author}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item className="text-center text-warning">
                    {article.carouselImages === undefined ? (
                      <Loader />
                    ) : article.carouselImages.length === 0 ? (
                      "No additional images for this article"
                    ) : (
                      <ReactImageGallery items={images} />
                    )}
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <p>{article.leader}</p>

                    <p style={{ whiteSpace: "pre-line" }}>{article.body}</p>
                  </ListGroup.Item>
                </ListGroup>
              </>
            )
          )}
        </Col>
        <Col md={4}>
          <h5 className="text-center p-2 bg-primary text-white">
            More news articles
          </h5>
          {loadingArticles ? (
            <Loader variant="warning" />
          ) : errorArticles ? (
            <Message variant="warning" heading="Error loading articles">
              {errorArticles}
            </Message>
          ) : (
            <div>
              {moreArticles.slice(0, 3).map((article) => (
                <ArticleSidebar article={article} key={article._id} />
              ))}
            </div>
          )}
          <Button
            onClick={() => history.push("/news")}
            variant="link"
            className="w-100 text-center"
          >
            Read more news articles
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ArticleScreen;
