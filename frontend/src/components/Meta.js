import { Helmet } from "react-helmet";

const Meta = ({ title, description, keywords, image }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
      <meta name="og:image" content={image} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "York Karate Dojo",
  description: "York Karate Dojo - a traditional shotokan karate organisation",
  keywords: "shotokan, karate, York, Martial arts, combat, Japan",
  image:
    "https://www.zanshintest.com/static/media/logo2021.22676b1922c790e5e279.png",
};

export default Meta;
