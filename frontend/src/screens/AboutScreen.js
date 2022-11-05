import { Col, Container, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import katoSenseiImg from "../img/katosensei.jpg";
import kagawa2Img from "../img/kagawa2.jpg";
import kagawa from "../img/simontomkagawa.jpg";
import simonKato from "../img/simonkato.jpg";
import submarkLogo from "../img/logosubmark(transparent).png";
import Video from "../components/Video";
import poster3Img from "../img/poster3.png";
import Meta from "../components/Meta";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { listBlackBelts } from "../actions/memberActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const AboutScreen = () => {
  const dispatch = useDispatch();

  const blackBeltList = useSelector((state) => state.blackBeltList);
  const { loading, error, blackBelts } = blackBeltList;

  useEffect(() => {
    dispatch(listBlackBelts());
  }, [dispatch]);

  return (
    <div className="mt-3">
      <Meta title="York Karate | About" />
      <Container>
        <h3 className="text-center pb-2 border-bottom border-warning">
          About York Karate Dojo
        </h3>

        <section className="pb-4">
          <p>
            York Karate Dojo was formed in April 2012 and in only a few months,
            the club had grown to include nearly 200 members training every
            week. To this day, the club is the largest in the city and the most
            successful in terms of black belt grading success and medal wins at
            both national and international level.
          </p>

          <Row className="text-center bg-primary align-items-center">
            <Col lg={8} md={6}>
              <ListGroup className="px-3 py-2">
                <h4 className="text-white">The aims of York Karate Dojo</h4>
                <ListGroup.Item>
                  Further the objectives of Shotokan Karate, and the Japan
                  Karate Shotorenmei (JKS) through excellent standards of
                  practice, coaching and instruction.
                </ListGroup.Item>
                <ListGroup.Item>
                  Promote karate as a martial art, and a sport, that can be
                  enjoyed by everyone in society that wishes to participate
                </ListGroup.Item>
                <ListGroup.Item>
                  Encourage its members to participate in competitions and will
                  support any members who aspire to represent their country.
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col lg={4} md={6} className="p-4 bg-primary">
              <img
                src={submarkLogo}
                alt="about-York-Karate"
                className="rounded-circle"
              />
            </Col>
          </Row>
        </section>
      </Container>
      <Container>
        <h3 className="text-center my-3 border-bottom border-warning pb-2">
          Meet the instructors
        </h3>
        {loading && <Loader variant="warning" />}
        {error && (
          <>
            <Message variant="warning">
              <h3>Error</h3>
              <p>
                Oops! We seem to have lost the instructors. Perhaps try
                refreshing the page.
              </p>
            </Message>
          </>
        )}
        {blackBelts &&
          blackBelts.map((instructor) => {
            if (instructor.isInstructor) {
              return (
                <>
                  <section className="pb-4">
                    <Row className="no-gutters my-3 p-3">
                      <Col md={6}>
                        <img
                          src={instructor.profileImg}
                          alt="profile"
                          className="rounded-0"
                        />
                      </Col>
                      <Col md={6}>
                        <ListGroup className="list-group-flush">
                          <ListGroupItem>
                            {instructor.firstName} {instructor.lastName}{" "}
                          </ListGroupItem>
                          <ListGroupItem>
                            Current Grade: {instructor.danGrade}
                            {instructor.danGrade === 1
                              ? "st"
                              : instructor.danGrade === 2
                              ? "nd"
                              : instructor.danGrade === 3
                              ? "rd"
                              : "th"}{" "}
                            dan
                          </ListGroupItem>
                          {Object.entries(instructor.danGradings).map(
                            (grading) => {
                              return (
                                <ListGroupItem key={Math.random()}>
                                  {`${grading[0]}: ${grading[1]}`}
                                </ListGroupItem>
                              );
                            }
                          )}
                        </ListGroup>
                      </Col>
                    </Row>
                    <p style={{ whiteSpace: "pre-line" }}>{instructor.bio}</p>
                  </section>
                </>
              );
            } else {
              return null;
            }
          })}
      </Container>
      <section className="pb-4">
        <Container>
          <h3 className="text-center my-3 border-bottom border-warning pb-2">
            The japanese influence
          </h3>
          <p>
            Both shihan Kato and Shihan Kagawa have been instrumental in
            providing inspiration and direction to Simon. Their style of karate
            and philosophy runs deep in the approach that Simon takes to his own
            karate, and consequently the karate taught at the club.
          </p>
          <p>
            Sadly, Kato shihan is no longer with us. However, Kagawa shihan is
            the current chief instructor of the Japan Karate Shotorenmei (see
            below)
          </p>
          <Row className="my-3 text-center bg-primary p-3">
            <Col md={6} className="mb-3">
              <Col>
                <img src={katoSenseiImg} alt="kato-sensei" />
                <small className="text-white">
                  Kato Sadashige - 9th dan IJKA
                </small>
              </Col>
            </Col>
            <Col md={6}>
              <Col>
                <img src={kagawa2Img} alt="kagawa-sensei" />
                <small className="text-white">Kagawa Masao - 9th dan JKS</small>
              </Col>
            </Col>
            <Col md={6} className="mb-3">
              <Col>
                <img src={simonKato} alt="kato-sensei" />
                <small className="text-white">
                  Simon with Kato Shihan - (2007)
                </small>
              </Col>
            </Col>
            <Col md={6}>
              <Col>
                <img src={kagawa} alt="kagawa-sensei" />
                <small className="text-white">
                  Simon & Tom with Kagawa Shihan (2009)
                </small>
              </Col>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="pb-4">
        <Container>
          <h3 className="text-center my-3 border-bottom border-warning pb-2">
            What is the Japan Karate Shotorenmei?
          </h3>
          <div className="bg-primary p-3">
            <Video
              poster={poster3Img}
              mp4="https://york-karate-uploads.s3.eu-west-2.amazonaws.com/jksjapan.mp4"
            >
              Your browser does not support HTML video.
            </Video>
          </div>
          <p className="lead text-center">
            (The below is taken from{" "}
            <a
              href="https://jks.jp/en/about_en/"
              target="_blank"
              rel="noreferrer"
              className="text-warning text-underline"
            >
              <u>www.jks.jp</u>
            </a>
            )
          </p>
          <p>
            Japan Karate Shoto Federation owes its existence to three great
            founders: Funakoshi Gichin, Nakayama Masatoshi and Asai Tetsuhiko.
            Now, our predecessors' intentions have been taken over by our
            current chief instructor, Shihan Kagawa Masao. Thanks to his
            efforts, the Japan Karate Shoto Federation continuous to gain and
            prosper.
          </p>
          <p>
            Funakoshi Gichin, the founder of the Shotokan style of karate,
            brought the style from Okinawa to mainland Japan in 1922. He adapted
            the original Okinawan martial art of Tode Jutsu into karate-do to
            match the Japanese martial art standard of Budo and made it suitable
            for the university curriculum in mainland Japan.
          </p>
          <p>
            After the Second World War his disciple, Nakayama Masatoshi Sensei,
            had significantly developed the karate of Funakoshi Sensei.
            Repeating movements after the instructor was the basic method of
            Okinawan karate. To make this approach systematic, Nakayama Sensei
            standardized fundamental techniques, adopted scientifically based
            training methods and established competition rules. All those
            innovations created the basis of present day karate.
          </p>
          <p>
            The former JKS Chief Instructor, Asai Tetsuhiko Sensei, inherited
            modern karate from Nakayama Masatoshi Sensei and gave it a new
            perspective. In 2000, Asai Sensei established the Japan Karate Shoto
            Federation in order to further develop the Budo karate evolution. He
            created new unique katas, practiced only by JKS members. They are
            the Junro kata series, from Shodan to Godan, and 17 Koten kata. He
            also launched innovative wheelchair karate training methods for
            people with reduced mobility.
          </p>
          <p>
            Asai Sensei enriched Karate-do by intensive rotational movements and
            whip-like actions of the body and limbs. His vision of Budo karate
            has been developed through the Junro and Koten katas, which means
            powerful techniques through total control over body motion. Despite
            being seriously ill later in life, the 71 year old Asai Sensei was
            capable of demonstrating breath-taking speed and power. He claimed
            that even senior people with weaken muscular strength were able to
            produce explosive motions, whether it be a kick or a punch. On the
            passing of Asai Tetsuhiko Sensei, Masao Kagawa Shihan took over the
            responsibility of JKS Chief Instructor.
          </p>
          <p>
            The concept of Kagawa Shihan lies in the development of traditional
            Shotokan karate techniques based upon tried and tested methods used
            in national and international championships. Therefore, the
            fundamental Shotokan principles of dynamism and power were adapted
            for international competition practice. Through experience, this
            approach has resulted in a solid winning formula.
          </p>
          <p>
            Fused by Kagawa Shihan, the strength of Budo and the aspiration of
            tournament success underpin the core of modern Karate development.
          </p>
        </Container>
      </section>
    </div>
  );
};

export default AboutScreen;
