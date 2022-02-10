import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const ProductPaginate = ({ pages, page, editList = false }) => {
  const url = editList === false ? "/shop/page" : "/shopadmin/editproducts";
  return (
    pages > 1 && (
      <Pagination>
        {page === 1 ? (
          <Pagination.Prev disabled />
        ) : (
          <LinkContainer to={`${url}/${page - 1}`}>
            <Pagination.Prev />
          </LinkContainer>
        )}

        {[...Array(pages).keys()].map((x) => (
          <LinkContainer key={x + 1} to={`${url}/${x + 1}`}>
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
        {pages === page ? (
          <Pagination.Next disabled />
        ) : (
          <LinkContainer to={`${url}/${page + 1}`}>
            <Pagination.Next />
          </LinkContainer>
        )}
      </Pagination>
    )
  );
};

export default ProductPaginate;
