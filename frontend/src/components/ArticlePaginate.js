import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ArticlePaginate = ({ pages, page, editList = false }) => {
  const history = useHistory();
  const url = editList === false ? "/news/page" : "/author/editarticles";

  return (
    <>
      <PaginationControl
        page={page}
        between={3}
        total={pages}
        limit={1}
        changePage={(page) => {
          history.push(`${url}/${page}`);
        }}
        ellipsis={2}
      />
    </>
  );
};

export default ArticlePaginate;
