import asyncHandler from "express-async-handler";
import { genericEmail } from "../emailTemplates/genericEmail.cjs";
import Event from "../models/eventModel.cjs";
import Member from "../models/memberModel.cjs";
import dotenv from "dotenv";

dotenv.config();

// @desc Fetch all events
// @route GET /api/events
// @access Public
const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({}).sort({ dateOfEvent: 1 });

  const toPast = Number(req.params.toPast) || 1;

  let today = new Date();

  // allow members to see their grading scores
  today.setDate(today.getDate() - toPast);

  today = Date.parse(new Date(today));

  const filteredEvents = events.filter((event) => {
    const eventDate = Date.parse(event.dateOfEvent);
    return eventDate > today;
  });

  res.json(filteredEvents);
});

// @desc Fetch single event
// @route GET /api/event
// @access Public
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    res.json(event);
  } else {
    res.status(404);
    throw new Error("Event not found");
  }
});

// @desc Delete event
// @route DELETE /api/events/:id
// @access Private/Admin
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    await event.remove();
    res.json({ message: "Event removed" });
  } else {
    res.status(404);
    throw new Error("Event not found");
  }
});

// @desc Create event
// @route POST /api/events
// @access Private/Admin
const createEvent = asyncHandler(async (req, res) => {
  const event = new Event({
    image: req.body.image,
    title: req.body.title,
    author: req.body.author,
    dateOfEvent: req.body.dateOfEvent,
    location: req.body.location,
    description: req.body.description,
    register: req.body.register,
  });

  const createdEvent = await event.save();

  const dateOfEvent = new Date(event.dateOfEvent).toLocaleDateString("en-GB");

  // send email to all members
  const members = await Member.find({ ddsuccess: true });
  if (members) {
    let recipients = "";
    members.forEach((member) => {
      recipients = `${recipients}${member.email};${member.secondaryEmail};`;
    });
    console.log(recipients);
    genericEmail({
      recipientEmail: recipients,
      recipientName: "Club Member",
      subject: event.title,
      message: `<h4>${event.title}</h4>
    <p>Date: ${dateOfEvent}.</p>
    <p>Location: ${event.location}.</p>
    ${event.description}
    `,
      link: `${process.env.DOMAIN_LINK}/event/${event._id}`,
      linkText: "View more details / Register",
      image: event.image,
      attachments: [],
    });
  }

  res.status(201).json(createdEvent);
});

// @desc Update event
// @route PUT /api/events/:id
// @access Private/Admin
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.body.id);

  if (event) {
    event.title = req.body.title;
    event.author = req.body.author;
    event.dateOfEvent = req.body.dateOfEvent;
    event.location = req.body.location;
    event.description = req.body.description;
    event.register = req.body.register;

    const updatedEvent = await event.save();
    res.status(201).json(updatedEvent);
  } else {
    res.status(404);
    throw new Error("Event not found");
  }
});

// @desc delete participant
// @route DELETE /api/events/:id/delete
// @access Private/Admin
const deleteParticipant = asyncHandler(async (req, res) => {
  const event = await Event.findById({ _id: req.body.eventId });
  if (event) {
    const newParticipants = event.participants.filter(
      (participant) => participant._id != req.body.id
    );
    event.participants = newParticipants;
    event.save();
    console.log("deleted from grading");
    res.status(201).json("Participant removed sucessfully");
  } else {
    res.status(404);
    throw new Error("Event not found");
  }
});

export {
  getEvents,
  getEventById,
  deleteEvent,
  createEvent,
  updateEvent,
  deleteParticipant,
};
