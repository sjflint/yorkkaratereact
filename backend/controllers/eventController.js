import asyncHandler from "express-async-handler";
import Event from "../models/eventModel.js";

// @desc Fetch all events
// @route GET /api/events
// @access Public
const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({}).sort({ dateOfEvent: 1 });
  res.json(events);
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
    image: "/img/default-profile.jpg",
    title: req.body.title,
    author: req.body.author,
    dateOfEvent: req.body.dateOfEvent,
    location: req.body.location,
    description: req.body.description,
    register: "/event",
  });

  const createdEvent = await event.save();
  res.status(201).json(createdEvent);
});

// @desc Update event
// @route PUT /api/events/:id
// @access Private/Admin
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  const { title, author, dateOfEvent, location, description } = req.body;

  if (event) {
    event.image = image;
    event.title = title;
    event.author = author;
    event.dateOfEvent = dateOfEvent;
    event.location = location;
    event.description = description;
    event.register = register;

    const updatedEvent = await event.save();
    res.status(201).json(updatedEvent);
  } else {
    res.status(404);
    throw new Error("Event not found");
  }
});

export { getEvents, getEventById, deleteEvent, createEvent, updateEvent };
