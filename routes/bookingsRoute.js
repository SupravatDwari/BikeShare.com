const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const Bike = require("../models/bikeModel");
const { v4: uuidv4 } = require("uuid");

router.post("/bookBike", async (req, res) => {
  const { token } = req.body;
  try {
    const payment = true

    if (payment) {
      const newbooking = new Booking(req.body);
      await newbooking.save();

      const bike = await Bike.findOne({ _id: req.body.bike });

      if (!bike) {
        throw new Error(`Bike with id ${req.body.bike} not found`);
      }

      if (!Array.isArray(bike.bookedTimeSlots)) {
        bike.bookedTimeSlots = [];
      }

      bike.bookedTimeSlots.push(req.body.bookedTimeSlots);
      await bike.save();

      res.send("Your booking is successfull");
    } else {
      return res.status(400).json(error);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});


router.get("/getallbookings", async (req, res) => {

  try {

    const bookings = await Booking.findOne().populate('bike')
    res.send(bookings)

  } catch (error) {
    console.log(error)
    return res.status(400).json(error);
  }

});


module.exports = router;