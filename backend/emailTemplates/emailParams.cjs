// standard images/logos
const logoYorkKarate =
  "https://york-karate-uploads.s3.eu-west-2.amazonaws.com/logo2021(1).png";
const defaultImg =
  "https://york-karate-uploads.s3.eu-west-2.amazonaws.com/emaildefaultimage.jpg";
const logoJksEngland =
  "https://york-karate-uploads.s3.eu-west-2.amazonaws.com/jks-england-logo.jpg";
const logoEKF =
  "https://york-karate-uploads.s3.eu-west-2.amazonaws.com/logoekf.png";
const logoWKF =
  "https://york-karate-uploads.s3.eu-west-2.amazonaws.com/logowkf.png";

// standard header
const header = `
<div
  style="
    padding: 10px 0 10px 0;
    max-width: 600px;
    margin: 20px auto 0 auto;
    background: black;
    text-align: center;
  "
>
    <img src="${logoYorkKarate}" width="150" />
</div>`;

// standard footer
const footer = `<div
style="
  max-width: 600px;
  margin: 0 auto 20px auto;
  padding: 10px 0 10px 0;
  text-align: center;
  color: #fff;
  background: black;
  text-decoration: none;
"
>
<h4>info@yorkkarate.net | 07814545013 | www.yorkkarate.net</h4>
</div>
<div
style="
  max-width: 600px;
  text-align: center;
  margin: 0 auto 20px auto;
  padding: 10px 0 10px 0;
"
>
    <div style="display: inline">
      <img
        src="${logoJksEngland}"
        alt=""
        width="80px"
        height="80px"
        style="margin: 0 25px 0 25px"
      />
      <img
        src="${logoWKF}"
        alt=""
        width="80px"
        height="80px"
        style="margin: 0 25px 0 25px"
      />
      <img
        src="${logoEKF}"
        alt=""
        width="80px"
        height="80px"
        style="margin: 0 25px 0 25px"
      />
    </div>
</div>`;

module.exports = {
  defaultImg,
  header,
  footer,
  logoYorkKarate,
};
