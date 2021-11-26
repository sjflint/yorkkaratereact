import asyncHandler from "express-async-handler";
import Event from "../models/eventModel.cjs";

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
    image: req.body.image,
    title: req.body.title,
    author: req.body.author,
    dateOfEvent: req.body.dateOfEvent,
    location: req.body.location,
    description: req.body.description,
    register: req.body.register,
  });

  const createdEvent = await event.save();
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

export { getEvents, getEventById, deleteEvent, createEvent, updateEvent };
