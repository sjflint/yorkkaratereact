import { Link } from "react-router-dom";

const Showcase = () => {
  return (
    <>
      <div id="showcase">
        <Link
          to="/contact"
          className="btn btn-default center-el"
          id="join-now-btn"
        >
          Contact Us
        </Link>
      </div>
    </>
  );
};

export default Showcase;
