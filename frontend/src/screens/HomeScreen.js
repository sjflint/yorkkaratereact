import simonProfileImg from "../img/simon-profile.jpg";
import {
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  CardGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Video from "../components/Video";
import poster2Img from "../img/poster2.png";
import yorkkarateOgv from "../img/yorkkarate.ogv";
import yorkkarateWebmHd from "../img/yorkkarate.webmhd.webm";
import respectImg from "../img/respect.jpg";
import sportRoundhouseKickImg from "../img/sport-roundhousekick.jpg";
import sportKumiteTrainingImg from "../img/sportkumitetraining.jpg";
import ekfTrainingImg from "../img/ekftraining.jpg";
import familyTrainingImg from "../img/family-training.jpg";
import InfoCard from "../components/InfoCard";
import EnquiryForm from "../components//FormComponents/EnquiryForm";
import Meta from "../components/Meta";

const HomeScreen = () => {
  return (
    <>
      <Meta />

      <section id="mini-promo" className="py-4 border-bottom border-warning">
        <Container>
          <Row className="p-3 align-items-center mb-2 bg-light">
            <Col xs={2}>
              <img
                id="simon-profile-round"
                src={simonProfileImg}
                alt="simon-instructor"
                className="border border-warning"
              />
            </Col>
            <Col>
              <h3>Welcome to York Karate Dojo</h3>
            </Col>
          </Row>

          <Row className="align-items-start">
            <Col lg={6} sm={12} className="p-2">
              <div className="p-2 bg-primary">
                <Video
                  poster={poster2Img}
                  mp4="https://york-karate-uploads.s3.eu-west-2.amazonaws.com/ageuke.mp4"
                  ogv={yorkkarateOgv}
                  webmhd={yorkkarateWebmHd}
                />
              </div>
            </Col>
            <Col lg={6} sm={12} className="p-2">
              <p>
                Welcome to York Karate Dojo. Please take a minute to explore our
                site and discover what we do. Should You have any questions,
                please don't hesitate to <Link to="/contact">contact us</Link>.
                <br />
                <br /> Our ethos is very simple. We aim to provide an excellent
                standard of karate training. We are interested in training those
                who are very determined to achieve their potential within
                karate, as well as developing other skills that are of wider
                benefit. Karate has long been hailed as an activity to stimulate
                personal growth, be it physical strength and fitness or
                defensive skills, emotional nurturing through inner confidence
                and belief or learning to appreciate the importance of respect
                and discipline. <br />
                <br />
                Our club motto is Respect - Discipline - Dedication:{" "}
                <li>Respect others</li>
                <li>Discipline yourself</li>
                <li>Dedicate your energy to your dreams and ambitions</li>
                Simon Flint <br />
                Instructor
              </p>
            </Col>
          </Row>
        </Container>
      </section>
      <section
        className="bg-primary py-4 border-bottom border-warning text-white"
        id="traditional-karate"
      >
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h3 className="text-center text-white">
                Traditional Shotokan Karate
              </h3>
              <p>
                We teach a traditional style of karate called Shotokan. Shotokan
                is one of the most widely practised martial arts in the world
                and originated from Okinawa, the birth place of all karate.
              </p>
              <p>
                It was in the early 20th century when pioneers travelled from
                Okinawa to Tokyo in order to spread karate to the Japanese
                mainland. One of these pioneers was Gichin Funakoshi. His pen
                name was Shoto, which translates as pine-waves (as in, when the
                wind blows through a pine forest). Funakoshi's teachings grew
                popular and he established his own school in Tokyo. The school
                was called the Shoto-Kan (Shoto's school/house).
              </p>
              <p>
                Karate spread rapidly throughout the world during the second
                half of the 20th century. One of the many reasons for this was
                that American soldiers stationed on Okinawa at the end of the
                2nd World War were fascinated by this ancient martial art. It's
                also fair to say that there was a growing interest from the West
                in Eastern religion and philosophy, with the likes of Bruce Lee
                captivating audiences on the big screen.
              </p>
            </Col>
            <Col lg={6} className="bg-light p-2">
              <img src={respectImg} alt="" />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="py-4 border-bottom border-warning" id="sport-karate">
        <Container>
          <Row className="no-gutters">
            <Col md={6} className="p-2 bg-primary">
              <img
                src={sportRoundhouseKickImg}
                alt="sport-karate-roundhouse-kick"
                className="h-100 sport-img flex-fill"
              />
            </Col>
            <Col md={6} className="align-self-center px-2">
              <h3 className="text-center">
                Grassroots and elite level competition training
              </h3>
              <p className="px-2">
                Competition is one aspect of karate training that is very
                rewarding and can spur progress and development. We encourage
                all members to test themselves within this arena. Through our
                connection with the English Karate Federation and the World
                Karate Federation, the Olympic Dream can be an ambition for any
                of our members.
              </p>
            </Col>
            <Col md={6} className="bg-primary p-2">
              <img src={sportKumiteTrainingImg} alt="sparring-class" />
            </Col>
            <Col md={6} className="bg-primary p-2">
              <img src={ekfTrainingImg} alt="" />
            </Col>
          </Row>
        </Container>
      </section>
      <section
        className="bg-primary text-white py-4 border-bottom border-warning"
        id="family-training"
      >
        <Container>
          <Row>
            <Col md={6}>
              <img src={familyTrainingImg} alt="" className="bg-light p-2" />
            </Col>
            <Col md={6} className="align-self-center">
              <h3 className="text-center text-white">
                Fun training for all the family
              </h3>
              <p>
                Karate is a great way for family members to connect. Training
                together, progressing through the belts together and achieving
                success together can be very rewarding. Sharing in the fun and
                watching your child grow can be hugely satisfying - providing
                you aren't too competitive with one and another!
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <section id="affiliation" className="py-4">
        <Container>
          <CardGroup>
            <InfoCard
              image="/img/jksinstructor.jpg"
              title="The Japan Karate Federation"
              text="A traditional organisation based in Tokyo. All black belt gradings are registered with the JKS"
              link="https://jks.jp/en/"
            />
            <InfoCard
              image="/img/worldkaratefederation.jpg"
              title="The World Karate Federation"
              text="The only governing body for karate recognised by the Olympic Committee."
              link="https://www.wkf.net/"
            />
            <InfoCard
              image="/img/sportengland.jpg"
              title="Sport England Registered"
              text="The government body with oversight for sport in England, ensuring quality and standards are met."
              link="https://www.sportengland.org/how-we-can-help/safeguarding/safeguarding-martial-arts"
            />
          </CardGroup>

          <h2 className="text-center mt-4">Our Affiliations</h2>
          <div
            id="affiliates"
            className="row align-items-center bg-secondary text-center p-2"
          >
            <Col lg={2} xs={4}>
              <img
                src="img/logojksengland.png"
                alt=""
                style={{ maxWidth: "120px" }}
              />
            </Col>
            <Col lg={2} xs={4}>
              <img src="img/logoekf.png" alt="" style={{ maxWidth: "120px" }} />
            </Col>
            <Col lg={2} xs={4}>
              <img
                src="img/logojapan-1.png"
                alt=""
                style={{ maxWidth: "120px" }}
              />
            </Col>
            <Col lg={2} xs={4}>
              <img
                src="img/logosafeguarding.png"
                alt=""
                style={{ maxWidth: "120px" }}
              />
            </Col>
            <Col lg={2} xs={4}>
              <img src="img/logowkf.png" alt="" style={{ maxWidth: "120px" }} />
            </Col>
            <Col lg={2} xs={4}>
              <img
                src="img/logosportengland.jpg"
                alt=""
                style={{ maxWidth: "120px" }}
              />
            </Col>
          </div>
        </Container>
      </section>

      <section
        id="contact-enquiry"
        className="py-4 border-top border-warning bg-primary"
      >
        <Container>
          <Row>
            <Col lg={6}>
              <h5 className="text-white mb-3">
                Benefits of training in Karate:
              </h5>
              <ListGroup className="mb-4">
                <ListGroupItem className="list-group-item d-flex justify-content-between align-items-center">
                  Self-defence
                  <span>
                    <i className="fas fa-check-circle text-success fa-2x"></i>
                  </span>
                </ListGroupItem>
                <ListGroupItem className="list-group-item d-flex justify-content-between align-items-center">
                  Improve fitness, conditioning and flexibility
                  <span>
                    <i className="fas fa-check-circle text-success fa-2x"></i>
                  </span>
                </ListGroupItem>
                <ListGroupItem className="list-group-item d-flex justify-content-between align-items-center">
                  Discipline
                  <span>
                    <i className="fas fa-check-circle text-success fa-2x"></i>
                  </span>
                </ListGroupItem>
                <ListGroupItem className="list-group-item d-flex justify-content-between align-items-center">
                  Improve confidence by building inner strength
                  <span>
                    <i className="fas fa-check-circle text-success fa-2x"></i>
                  </span>
                </ListGroupItem>
                <ListGroupItem className="list-group-item d-flex justify-content-between align-items-center">
                  Achieve sporting success, at every level of the sport
                  <span>
                    <i className="fas fa-check-circle text-success fa-2x"></i>
                  </span>
                </ListGroupItem>
                <ListGroupItem className="list-group-item d-flex justify-content-between align-items-center">
                  Learn a new skill
                  <span>
                    <i className="fas fa-check-circle text-success fa-2x"></i>
                  </span>
                </ListGroupItem>
                <ListGroupItem className="list-group-item d-flex justify-content-between align-items-center">
                  Earn a genuine black belt, recognised by the Japanese
                  Government
                  <span>
                    <i className="fas fa-check-circle text-success fa-2x"></i>
                  </span>
                </ListGroupItem>
                <ListGroupItem className="list-group-item d-flex justify-content-between align-items-center">
                  Meet new friends
                  <span>
                    <i className="fas fa-check-circle text-success fa-2x"></i>
                  </span>
                </ListGroupItem>
                <ListGroupItem className="list-group-item d-flex justify-content-between align-items-center">
                  Have fun!
                  <span>
                    <i className="fas fa-check-circle text-success fa-2x"></i>
                  </span>
                </ListGroupItem>
              </ListGroup>
            </Col>
            <Col lg={6}>
              <h5 className="text-white">Let us know how we can help:</h5>
              <EnquiryForm />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="py-4 border-top border-warning" id="social-media-bar">
        <Container className="text-center">
          <h3 className="text-center mb-3">Connect with us on social media</h3>

          <Row className="text-center text-warning mb-3">
            <Col xs={4}>
              <a
                href="https://www.facebook.com/YorkKarate"
                target="_blank"
                rel="noreferrer"
                className="text-decoration-none"
              >
                <i className="fab fa-facebook fa-3x"></i>
                <h5 className="mt-2 text-warning">Facebook</h5>
              </a>
            </Col>
            <Col xs={4}>
              <a
                href="https://www.instagram.com/yorkkarate"
                target="_blank"
                rel="noreferrer"
                className="text-decoration-none"
              >
                <i className="fab fa-instagram fa-3x"></i>
                <h5 className="mt-2 text-warning">Instagram</h5>
              </a>
            </Col>
            <Col xs={4}>
              <a
                href="https://www.youtube.com/channel/UC3uCY2UeiuTub4qsquGFdng?view_as=subscriber"
                target="_blank"
                rel="noreferrer"
                className="text-decoration-none"
              >
                <i className="fab fa-youtube fa-3x"></i>
                <h5 className="mt-2 text-warning">YouTube</h5>
              </a>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default HomeScreen;
