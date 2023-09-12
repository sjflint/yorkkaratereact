import { useEffect } from "react";
import { Container, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { listFinancials } from "../actions/financialActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const FaqScreen = () => {
  const dispatch = useDispatch();

  const financialList = useSelector((state) => state.financialList);
  const {
    loading: financialsLoading,
    financials,
    error: financialsError,
  } = financialList;

  useEffect(() => {
    dispatch(listFinancials());
  }, [dispatch]);

  return (
    <div>
      <Container className="mt-3">
        <h3 className="text-center border-bottom border-warning pb-1">
          Frequently Asked Questions
        </h3>
        <p className="small text-center">
          Please read the below before attending your first session.
        </p>
        <div
          sm={4}
          className="bg-warning p-5 text-white d-flex align-items-center justify-content-center"
        >
          <h5 className="text-white">What age can children start?</h5>
        </div>

        <ListGroup>
          <ListGroup.Item>
            Our 'Junior' class is for children under 9 years of age.
          </ListGroup.Item>
          <ListGroup.Item>
            We don't have a set minimum age at which children can start
            training. A lot depends on the individual child. However, around 5
            is a good age to start.
          </ListGroup.Item>
        </ListGroup>

        {financialsLoading ? (
          <Loader variant="warning" />
        ) : (
          financialsError && <Message>{financialsError}</Message>
        )}
        {financials && financials.baseLevelTrainingFees && (
          <>
            <div
              sm={4}
              className="bg-primary p-5 text-white d-flex align-items-center justify-content-center"
            >
              <h5 className="text-white">How much to join?</h5>
            </div>

            <ListGroup>
              <ListGroup.Item>
                Training Fees to train once a week are{" "}
                {Number(financials.baseLevelTrainingFees / 100).toLocaleString(
                  "en-GB",
                  {
                    style: "currency",
                    currency: "GBP",
                  }
                )}{" "}
                per month (paid by direct debit)
              </ListGroup.Item>
              <ListGroup.Item>
                There is a one-off joining fee of{" "}
                {Number(financials.joiningFee / 100).toLocaleString("en-GB", {
                  style: "currency",
                  currency: "GBP",
                })}{" "}
              </ListGroup.Item>
              <ListGroup.Item>
                We sell karate suits if you would like to buy one. Please see
                our{" "}
                <Link to="/shop" className="text-warning">
                  shop
                </Link>{" "}
                for options.
              </ListGroup.Item>
              <ListGroup.Item>
                Membership to the the Japan Karate Shotorenmei (which includes
                membership to the national governing body, the English Karate
                Federation). This is a one-off payment per year. Please visit
                their website for current prices/details{" "}
                <a
                  href="https://www.jksengland.com/home"
                  target="_blank"
                  rel="noreferrer"
                  className="text-warning"
                >
                  www.jksengland.com
                </a>
              </ListGroup.Item>
            </ListGroup>

            <div
              sm={4}
              className="bg-warning p-5 text-white d-flex align-items-center justify-content-center"
            >
              <h5 className="text-white">Where/when are the classes?</h5>
            </div>

            <ListGroup>
              <ListGroup.Item>
                Beginners are split by age. We have juniors, who we class as
                anyone under 9, and Novices are 9 and over. We have classes for
                intermediate and advanced too, if you are an experienced
                karateka moving clubs.
              </ListGroup.Item>
              <ListGroup.Item>
                Our timetable shows when and where the classes are taking place.
                Please take a look at our{" "}
                <Link to="/timetable" className="text-warning">
                  timetable page here
                </Link>
              </ListGroup.Item>
              <ListGroup.Item>
                We have a handy class finder on our{" "}
                <Link to="timetable" className="text-warning">
                  timetable page
                </Link>{" "}
                to help you find the right class for you.
              </ListGroup.Item>
            </ListGroup>

            <div
              sm={4}
              className="bg-primary p-5 d-flex align-items-center justify-content-center"
            >
              <h5 className="text-white">
                What do I need to bring/wear for the trial?
              </h5>
            </div>

            <ListGroup>
              <ListGroup.Item>
                Just wear any sports type clothing that will be easy to move in.
                Tracksuit bottoms and a t-shirt would be perfect.
              </ListGroup.Item>
              <ListGroup.Item>
                Perhaps some water to stay hydrated.
              </ListGroup.Item>
            </ListGroup>

            <div
              sm={4}
              className="bg-warning p-5 d-flex align-items-center justify-content-center"
            >
              <h5 className="text-white">Can I watch my child do the class?</h5>
            </div>

            <ListGroup>
              <ListGroup.Item>Yes, you can.</ListGroup.Item>
              <ListGroup.Item>
                Parents are not generally permitted to stay and watch classes,
                for a number of reasons. However, I would encourage parents to
                stay for the trial session to help and support.
              </ListGroup.Item>
            </ListGroup>

            <div
              sm={4}
              className="bg-primary p-5 d-flex align-items-center justify-content-center"
            >
              <h5 className="text-white">
                I really want to start but I'm not sure I'm fit enough?
              </h5>
            </div>

            <ListGroup>
              <ListGroup.Item>
                That's fine. The Novice classes are suitable for all fitness
                levels and through your karate training, you will regain your
                fitness.
              </ListGroup.Item>
              <ListGroup.Item>
                Waiting until you are fit enough to start training is like
                waiting to learn to play the piano until you know how to play
                the piano. You will improve your fitness only by training.
              </ListGroup.Item>
            </ListGroup>

            <div
              sm={4}
              className="bg-warning p-5 d-flex align-items-center justify-content-center"
            >
              <h5 className="text-white">
                I want my child to learn discipline and self-defence, not to be
                violent.
              </h5>
            </div>

            <ListGroup>
              <ListGroup.Item>
                Karate is first, and foremost, about self-discipline and
                control. This is the essence of karate as a martial art, over a
                'combat sport'.
              </ListGroup.Item>
              <ListGroup.Item>
                Karate will teach your child some practical techniques for self
                defence and give them the confidence to be able to use them.
              </ListGroup.Item>
              <ListGroup.Item>
                From the 20 guiding principles of karate, principle 1 states
                that 'Karate begins, and ends, with respect'.
              </ListGroup.Item>
            </ListGroup>

            <div
              sm={4}
              className="bg-primary p-5 d-flex align-items-center justify-content-center"
            >
              <h5 className="text-white">Do you enter competitions?</h5>
            </div>

            <ListGroup>
              <ListGroup.Item>
                Yes we do. We have a very active squad that competes around the
                country and at natioanl and international level.
              </ListGroup.Item>
              <ListGroup.Item>
                Competitions are great fun and can provide focus and motivation
                for training, particularly for children.
              </ListGroup.Item>
              <ListGroup.Item>
                You will have the opportunity to join the York Karate Squad
                after you have completed a few gradings (belt tests).
              </ListGroup.Item>
            </ListGroup>
          </>
        )}
      </Container>
    </div>
  );
};

export default FaqScreen;
