import { Col, Container, ListGroup, Row } from "react-bootstrap";
import cameronKankuImg from "../img/cameron1.jpg";
import simonProfileImg from "../img/simon-profile.jpg";
import simonMedalImg from "../img/simon-medal.jpg";
import katoSenseiImg from "../img/katosensei.jpg";
import kagawa2Img from "../img/kagawa2.jpg";
import Parralax from "../components/Parralax";
import Video from "../components/Video";
import poster3Img from "../img/poster3.png";
import jksjapanMp4 from "../img/jksjapan.mp4";
import jksjapanWebmHd from "../img/jksjapan.webmhd.webm";
import Meta from "../components/Meta";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";

const AboutScreen = () => {
  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Meta title="York Karate | About" />
          <Container>
            <h3 className="text-center border-bottom border-warning pb-1">
              About York Karate Dojo
            </h3>

            <section className="pb-4 border-bottom border-warning">
              <p>
                York karate Dojo was formed when Sensei Simon Flint departed
                Haxby Karate Club to establish himself as a full-time karate
                instructor. York Karate Dojo was formed in April 2012 and in
                only a few months, the club had grown to include nearly 200
                members training every week. To this day, the club is the
                largest in the city and the most successful in terms of black
                belt grading success and medal wins at both national and
                international level.
              </p>

              <Row className="text-center bg-primary align-items-center">
                <Col md={6}>
                  <ListGroup className="px-3 py-2">
                    <h4 className="text-white">
                      The aims of York Karate Dojo are:
                    </h4>
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
                      Encourage its members to participate in competitions and
                      will support any members who aspire to represent their
                      country.
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={6} className="p-4 bg-primary">
                  <img src={cameronKankuImg} alt="about-York-Karate" />
                </Col>
              </Row>
            </section>
            <section className="pb-4 border-bottom border-warning">
              <h3 className="text-center my-3">
                Sensei Simon Flint - Club founder and instructor
              </h3>
              <Row className="no-gutters my-3 bg-primary p-3">
                <Col md={5}>
                  <img
                    src={simonProfileImg}
                    alt="simon-profile"
                    className="rounded-0"
                  />
                </Col>
                <Col md={7}>
                  <img
                    src={simonMedalImg}
                    alt="simon-medal"
                    className="rounded-0"
                  />
                </Col>
              </Row>

              <p>
                Simon started training in karate at the age of 8. His training
                was sporadic during his teenage years but on returning from
                university, he restarted karate with renewed zeal. He graded to
                shodan (1st level black belt) at the age of 23, under the
                examination of sensei Sadashige Kato (9th dan).
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
                    <small className="text-white">
                      Kagawa Masao - 9th dan JKS
                    </small>
                  </Col>
                </Col>
              </Row>
              <p>
                At the age of 25, Simon graded to nidan (2nd level) and then
                sandan (3rd level) at the age of 28. Both gradings were
                conducted by the JKS World Chief Instructor Sensei Masao Kagawa.
                At 32, Simon travelled to Tokyo, Japan, and completed his yondan
                (4th level) black belt grading under a panel of the most senior
                JKS instructors in the world.
              </p>
              <p>
                On returning to karate training in his early twenties, Simon
                entered the world of sport karate and represents JKS England. He
                competed at the JKS World Championships in 2011. Simon also
                competed in many national championships, reaching the finals at
                the JKS National championships and winning bronze medal at the
                JKS Ireland championships.
              </p>
              <p>
                Simon has been teaching karate for over a decade and York Karate
                Dojo has quickly established a reputation for producing students
                with exceptional technical ability, boasting an unequalled 100%
                pass rate for black belt gradings and training elite level
                competitors. One student from York Karate Dojo, Harry
                Hardcastle, is a current member of the Karate All Styles England
                Squad, the first from York to ever reach such a standard.
              </p>
            </section>
          </Container>
          <Parralax image={"parralax1.jpg"} />
          <section className="pb-4 border-bottom border-top border-warning">
            <Container>
              <h3 className="text-center my-3">
                What is the Japan Karate Shotorenmei?
              </h3>
              <div className="bg-primary p-3">
                <Video
                  poster={poster3Img}
                  mp4={jksjapanMp4}
                  webmhd={jksjapanWebmHd}
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
                founders: Funakoshi Gichin, Nakayama Masatoshi and Asai
                Tetsuhiko. Now, our predecessors' intentions have been taken
                over by our current chief instructor, Shihan Kagawa Masao.
                Thanks to his efforts, the Japan Karate Shoto Federation
                continuous to gain and prosper.
              </p>
              <p>
                Funakoshi Gichin, the founder of the Shotokan style of karate,
                brought the style from Okinawa to mainland Japan in 1922. He
                adapted the original Okinawan martial art of Tode Jutsu into
                karate-do to match the Japanese martial art standard of Budo and
                made it suitable for the university curriculum in mainland
                Japan.
              </p>
              <p>
                After the Second World War his disciple, Nakayama Masatoshi
                Sensei, had significantly developed the karate of Funakoshi
                Sensei. Repeating movements after the instructor was the basic
                method of Okinawan karate. To make this approach systematic,
                Nakayama Sensei standardized fundamental techniques, adopted
                scientifically based training methods and established
                competition rules. All those innovations created the basis of
                present day karate.
              </p>
              <p>
                The former JKS Chief Instructor, Asai Tetsuhiko Sensei,
                inherited modern karate from Nakayama Masatoshi Sensei and gave
                it a new perspective. In 2000, Asai Sensei established the Japan
                Karate Shoto Federation in order to further develop the Budo
                karate evolution. He created new unique katas, practiced only by
                JKS members. They are the Junro kata series, from Shodan to
                Godan, and 17 Koten kata. He also launched innovative wheelchair
                karate training methods for people with reduced mobility.
              </p>
              <p>
                Asai Sensei enriched Karate-do by intensive rotational movements
                and whip-like actions of the body and limbs. His vision of Budo
                karate has been developed through the Junro and Koten katas,
                which means powerful techniques through total control over body
                motion. Despite being seriously ill later in life, the 71 year
                old Asai Sensei was capable of demonstrating breath-taking speed
                and power. He claimed that even senior people with weaken
                muscular strength were able to produce explosive motions,
                whether it be a kick or a punch. On the passing of Asai
                Tetsuhiko Sensei, Masao Kagawa Shihan took over the
                responsibility of JKS Chief Instructor.
              </p>
              <p>
                The concept of Kagawa Shihan lies in the development of
                traditional Shotokan karate techniques based upon tried and
                tested methods used in national and international championships.
                Therefore, the fundamental Shotokan principles of dynamism and
                power were adapted for international competition practice.
                Through experience, this approach has resulted in a solid
                winning formula.
              </p>
              <p>
                Fused by Kagawa Shihan, the strength of Budo and the aspiration
                of tournament success underpin the core of modern Karate
                development.
              </p>
            </Container>
          </section>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default AboutScreen;
