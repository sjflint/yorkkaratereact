import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import Article from "../components/Article";
import { listArticles } from "../actions/articleActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ArticlePaginate from "../components/ArticlePaginate";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";

const NewsScreen = ({ match }) => {
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const articleList = useSelector((state) => state.articleList);
  const { loadingArticles, error, articles, page, pages } = articleList;

  useEffect(() => {
    dispatch(listArticles(pageNumber));
  }, [dispatch, pageNumber]);

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
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
                <AnimatePresence>
                  {articles.map((article) => (
                    <motion.div
                      key={article._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div key={article._id} className="mb-2">
                        <Article article={article} />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <ArticlePaginate
                    pages={pages}
                    page={page}
                    className="d-flex justify-content-center"
                  />
                </div>
              </>
            )}
          </Container>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default NewsScreen;
