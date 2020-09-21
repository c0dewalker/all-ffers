const express = require('express');
const router = express.Router();

const scrapeHabr = require('../website_scrapers/scrapers/habr-scraper.js');
const scrapeWeblancer = require('../website_scrapers/scrapers/weblancer-scraper.js');
const scrapePchel = require('../website_scrapers/scrapers/pchel-scraper.js');
const scrapeFreelance = require('../website_scrapers/scrapers/freelance-scraper.js');
const scrapeFreelancehunt = require('../website_scrapers/scrapers/freelancehunt-scraper.js');

router.get('/:website',(req, res) => {

  const {website} = req.params;

  const scrapers = {
    habr: scrapeHabr,
    weblancer: scrapeWeblancer,
    pchel: scrapePchel,
    freelance: scrapeFreelance,
    freelancehunt: scrapeFreelancehunt
  };

  if (website in scrapers === false)
    res.json({message: 'Wrong website name!'});

  try {
    scrapers[website]();
  } catch (err) {
    res.status(500).send({message: `Error Form Server! ${err}`});
  }
});

module.exports = router;
