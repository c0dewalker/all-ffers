const cheerio = require('cheerio');
const needle = require('needle');
const tress = require('tress');

const Offer = require('../../models/offer.js');

function scrapePchel() {
  const pchelUrl = 'https://pchel.net/jobs/programming/';
  const results = [];

  const queue = tress((url, callback) => {
    needle('get', url)
      .then((data) => data.body)
      .then((html) => {
        console.log(`PARSING: ${url}`);

        const $ = cheerio.load(html);

        if ($('body > div.main-wrapper > main > section.section-offers > div > div > div.project-bot > a.btn.btn-green').text() === '') {
          $('div.project-block').each((i, el) => {
            const $element = $(el);

            const relPath = $element.find('div.project-block-cont div.project-title a').attr('href');

            if (relPath) {
              const linkToOffer = `https://pchel.net${relPath}`;

              queue.push(linkToOffer);
            }
          });
        }

        const title = $('body > div.main-wrapper > main > section.page-top > div > h1').text();
        const description = $('body > div.main-wrapper > main > section.section-offers > div > div > div.project-mid > dl:nth-child(1) > dd')
          .text();
        const budget = $('body > div.main-wrapper > main > section.section-offers > div > div > div.project-top > div.project-nums > div span')
          .text().trim().slice(2);
        // let currency = '';
        // if (budget.includes('грн')) currency = '₴';
        // else if (budget.includes('руб')) currency = '₽';
        const publishedAt = $('body > div.main-wrapper > main > section.section-offers > div > div > div.project-top > div.project-data > div.date')
          .text().trim();
        const inWork = $('body > div.main-wrapper > main > section:nth-child(4) > div > div > div.project-top > div.project-data > div.stat.orange')
          .text();

        const offer = {
          title,
          description,
          budget,
          // currency,
          publishedAt,
          url,
          inWork,
        };

        results.push(offer);

        const nextPagePath = $('body > div.main-wrapper > main > section.project-section.project-section3 > div > div.pagenavi > a.next')
          .attr('href');

        if (nextPagePath) {
          const nextPageUrl = `https://pchel.net${nextPagePath}`;

          queue.push(nextPageUrl);
        }

        callback();
      })
      .catch((err) => console.log('Error! From Queue!', err));
  }, 10);

  // эта функция выполнится, когда в очереди закончатся ссылки
  queue.drain = () => {
    const offers = results.filter((el) => el.description !== '' && el.publishedAt !== '' && el.inWork === '');

    offers.forEach(async (el) => {
      const offerInDb = await Offer.findOne({ url: el.url });

      if (!offerInDb) {
        const newOffer = new Offer({
          title: el.title,
          description: el.description,
          hasProjectBudget: el.budget !== '',
          hasHourlyRate: false,
          budget: el.budget === '' ? 'Цена договорная' : el.budget,
          // currency: el.currency,
          publishedAt: el.publishedAt,
          url: el.url,
          from: 'pchel',
        });

        try {
          newOffer.save();
          console.log(`SAVED: ${el}`);
        } catch (err) {
          console.log('Save Error!', err);
        }
      } else {
        console.log('OFFER ALREADY IN DB: ', offerInDb);
      }
    });
  };

  // добавляем в очередь ссылку на первую страницу списка
  queue.push(pchelUrl);
}

module.exports = scrapePchel;
