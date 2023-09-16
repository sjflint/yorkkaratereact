import { Pagination } from "react-bootstrap";
import { PaginationControl } from "react-bootstrap-pagination-control";
import { LinkContainer } from "react-router-bootstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const TrainingVideoPaginate = ({ pages, page, editList = false }) => {
  const url = editList === false ? "" : "/instructor/editsyllabus";
  const history = useHistory();
  return (
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
  );
};

export default TrainingVideoPaginate;
