const express = require('express');
const Offer = require('../models/offer.js');

const router = express.Router();

router.get('/', async (req, res) => {
  const offers = await Offer.find();

  res.json({ offers });
});

module.exports = router;
