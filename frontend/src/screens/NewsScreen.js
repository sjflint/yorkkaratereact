import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import Article from "../components/Article";
import { listArticles } from "../actions/articleActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const NewsScreen = () => {
  const dispatch = useDispatch();

  const articleList = useSelector((state) => state.articleList);
  const { loadingArticles, error, articles } = articleList;

  useEffect(() => {
    dispatch(listArticles());
  }, [dispatch]);

  return (
    <>
      <Container fluid="lg">
        <h3 className="text-center border-bottom border-warning pb-1">
          Latest News
        </h3>
        {loadingArticles ? (
          <Loader variant="warning" />
        ) : error ? (
          <Message variant="warning" heading="Error loading articles">
            {error}
          </Message>
        ) : (
          <>
            {articles.map((article) => (
              <div key={article._id} className="mb-2">
                <Article article={article} />
              </div>
            ))}
          </>
        )}
      </Container>
    </>
  );
};

export default NewsScreen;
