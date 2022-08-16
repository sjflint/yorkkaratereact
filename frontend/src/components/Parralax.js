const Parralax = ({ image }) => {
  const parStyle = {
    background: `url(../img/${image}) no-repeat center center/cover fixed`,
    width: "100%",
    height: "50vh",
    backgroundAttachment: "fixed",
    margin: "0 auto 0 auto",
  };
  return <div style={parStyle}></div>;
};

export default Parralax;
