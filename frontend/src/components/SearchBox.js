import { useState } from "react";
import { Button, Form } from "react-bootstrap";

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      history.push(`/admin/listmembers/search/${keyword}`);
    } else {
      history.push("/admin/listmembers");
    }
  };

  return (
    <Form onSubmit={submitHandler} inline>
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search..."
        className="mr-sm-2 ml-sm-2"
      ></Form.Control>
      <Button type="submit" variant="outline-warning" className="p-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
