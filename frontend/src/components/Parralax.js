const Parralax = ({ image }) => {
  const parStyle = {
    background: `url(../img/${image}) no-repeat center center/cover fixed`,
    minHeight: "300px",
    backgroundAttachment: "fixed",
  };
  return <div style={parStyle}></div>;
};

export default Parralax;
