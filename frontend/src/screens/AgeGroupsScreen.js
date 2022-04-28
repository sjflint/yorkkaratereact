import React from "react";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import juniorClassIMG from "../img/juniorclass.jpg";
import georgeIMG from "../img/George.jpg";
import BeltCard from "../components/BeltCard";

const AgeGroupsScreen = () => {
  return (
    <Container className="mt-3">
      <h3 className="text-center border-bottom border-warning pb-1">
        Age groups & belt levels
      </h3>
      <Tabs defaultActiveKey="under9" className="mb-1 justify-content-center">
        <Tab eventKey="under9" title="Under 9 years old" className="mb-3">
          <Row className="align-items-start">
            <Col md="6">
              <p className="lead border-bottom border-warning pb-2">
                Suitable for any level of child under 9 years old. Training will
                progress your child to Yellow belt level
              </p>
              <p>
                Let your little dragon learn the art of Shotokan Karate through
                a fun, step-by-step training style suited to younger children.
                It's no secret that children learn differently from adults.
              </p>
              <p>
                Here at JKS York Karate Club, we understand that children as
                young as 4 years old can learn karate but that they need to do
                so in a fashion that will engage them and leave them wanting to
                learn more. All instructors have completed child protection
                courses, are CRB checked and emergency first aid trained. This
                means that you know your child is in safe hands! The syllabus
                includes learning the basic punches, kicks and blocks that are
                essential to karate, but also to learn about self-discipline,
                focus, concentration and respect. These skills are at the heart
                of martial arts training and we make sure they are brought to
                the fore. We will also teach your child about balance, speed,
                teamwork and other life skills that are crucial to their
                development.
              </p>
            </Col>
            <Col md="6" className="bg-primary p-2">
              <img src={juniorClassIMG} alt="" />
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="9-15years" title="9 - 15 year old" className="mb-3">
          <Row className="align-items-start">
            <Col md="6">
              <p className="lead border-bottom border-warning pb-2">
                York Karate Club will allow your child to develop through the
                belt system to reach whatever goal they set for themselves.
              </p>
              <p>
                Karate is a great way for children to develop and learn some of
                the most important life principles, such as dedication, hard
                work and discipline. It also allows them to feel confident in
                themselves and trust their own abilities
              </p>
              <p>
                Whether your child is just looking for a hobby, or to be the
                next World Champion, we have plenty to offer. The martial arts
                are great for confidence, for releasing steam and just being
                able to enjoy exercising! Your child can take karate as
                seriously as they want, either as a fun after school activity or
                with the intention of reaching black belt and beyond.
              </p>
            </Col>
            <Col md="6" className="bg-primary p-2">
              <img src={georgeIMG} alt="" />
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="Adult" title="Adult" className="mb-3">
          <p className="lead border-bottom border-warning pb-2">
            York Karate Dojo is a great place to either start your karate
            training, or restart it after being out of action for a few years.
          </p>
          <p>
            The first thing to know about karate is it's great fun! Learning a
            martial art is very rewarding and in time, you begin to appreciate
            all of it's nuances, intricacies and challenges.
          </p>
          <p>
            It is great fitness as you use your entire body and every muscle,
            not to mention practical and relevant in our modern society. We also
            teach karate with a view to it's traditions and more subtle
            philosophical underpinnings.
          </p>
        </Tab>
        <Tab eventKey="beltLevel" title="Belt Levels" className="mb-3">
          <h5>Belt levels</h5>
          <p className="lead border-bottom border-warning pb-2">
            Belt colours are used in karate to designate progress. The coveted
            black belt, of course, being the ambition of every new starter
          </p>
          <Row>
            <BeltCard grade="beginner" beltColor="White" />
            <BeltCard grade="15th Kyu" beltColor="White-Red" />
            <BeltCard grade="14th Kyu" beltColor="White-Black" />
            <BeltCard grade="13th Kyu" beltColor="Orange" />
            <BeltCard grade="12th Kyu" beltColor="Orange-White" />
            <BeltCard grade="11th Kyu" beltColor="Orange-Yellow" />
            <BeltCard grade="10th Kyu" beltColor="Orange-Black" />
            <BeltCard grade="9th Kyu" beltColor="Red" />
            <BeltCard grade="8th Kyu" beltColor="Red-Black" />
            <BeltCard grade="7th Kyu" beltColor="Yellow" />
            <BeltCard grade="6th Kyu" beltColor="Green" />
            <BeltCard grade="5th Kyu" beltColor="Purple" />
            <BeltCard grade="4th Kyu" beltColor="Purple-White" />
            <BeltCard grade="3th Kyu" beltColor="Brown" />
            <BeltCard grade="2th Kyu" beltColor="Brown-White" />
            <BeltCard grade="1st Kyu" beltColor="Brown-Double-White" />
            <BeltCard grade="1st dan" beltColor="Black" />
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AgeGroupsScreen;
