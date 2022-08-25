import { useState } from "react";
import { Button, Form } from "react-bootstrap";

const SearchBox = ({ history, path, placeholder }) => {
  if (!placeholder) {
    placeholder = "";
  }
  const [keyword, setKeyword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      history.push(`${path}search/${keyword}`);
    } else {
      history.push(`${path}search`);
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder={`Search ${placeholder}...`}
        className="mr-sm-2 ml-sm-2"
      ></Form.Control>
      <Button type="submit" variant="outline-secondary" className="p-2">
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
