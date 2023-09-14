import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ArticlePaginate = ({ pages, page, editList = false }) => {
  const history = useHistory();
  const url = editList === false ? "/news/page" : "/author/editarticles";

  return (
    // pages > 1 && (
    //   <Pagination>
    //     {page === 1 ? (
    //       <Pagination.Prev disabled />
    //     ) : (
    //       <LinkContainer to={`${url}/${page - 1}`}>
    //         <Pagination.Prev />
    //       </LinkContainer>
    //     )}
    //     {[...Array(pages).keys()].map((x) => (
    //       <LinkContainer key={x + 1} to={`${url}/${x + 1}`}>
    //         <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
    //       </LinkContainer>
    //     ))}
    //     {pages === page ? (
    //       <Pagination.Next disabled />
    //     ) : (
    //       <LinkContainer to={`${url}/${page + 1}`}>
    //         <Pagination.Next />
    //       </LinkContainer>
    //     )}
    //   </Pagination>
    // )
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
