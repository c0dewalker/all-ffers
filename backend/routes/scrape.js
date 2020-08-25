const express = require('express');

const scrapeHabr = require('../lib/scrapers/habr-scraper.js');
const scrapeWeblancer = require('../lib/scrapers/weblancer-scraper.js');
const scrapePchel = require('../lib/scrapers/pchel-scraper.js');
const scrapeFreelance = require('../lib/scrapers/freelance-scraper.js');
const scrapeFreelancehunt = require('../lib/scrapers/freelancehunt-scraper.js');

const router = express.Router();

router.get('/:website', async (req, res) => {
  const { website } = req.params;

  switch (website) {
    case 'habr':
      try {
        scrapeHabr();
      } catch (err) {
        res.json({ message: `Error Form Server! ${err}` });
      }
      break;
    case 'weblancer':
      try {
        scrapeWeblancer();
      } catch (err) {
        res.json({ message: `Error Form Server! ${err}` });
      }
      break;
    case 'pchel':
      try {
        scrapePchel();
      } catch (err) {
        res.json({ message: `Error Form Server! ${err}` });
      }
      break;
    case 'freelance':
      try {
        scrapeFreelance();
      } catch (err) {
        res.json({ message: `Error Form Server! ${err}` });
      }
      break;
    case 'freelancehunt':
      try {
        scrapeFreelancehunt();
      } catch (err) {
        res.json({ message: `Error Form Server! ${err}` });
      }
      break;
    default:
      res.json({ message: 'Wrong website name!' });
  }
});

module.exports = router;
