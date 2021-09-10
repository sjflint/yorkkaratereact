import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";

const Product = ({ product }) => {
  return (
    <Card className="mb-3">
      <Link to={`/products/${product._id}`}>
        <Card.Img src={product.image} variant="top" className="rounded" />
      </Link>
      <Card.Body>
        <Link to={`/products/${product._id}`}>
          <Card.Title as="div" className="text-warning">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <div className="my-3">{product.description}</div>
        </Card.Text>
      </Card.Body>
      <Card.Footer className="text-white">£{product.price}.00</Card.Footer>
    </Card>
  );
};

export default Product;
