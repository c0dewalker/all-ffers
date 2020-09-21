const cheerio = require('cheerio');
const needle = require('needle');
const tress = require('tress');

const Offer = require('../../models/offer.js');

function scrapeFreelance() {
  const freelanceUrl = 'https://freelance.ru/projects/?spec=4';
  const results = [];

  const queue = tress((url, callback) => {
    needle('get', url)
      .then((data) => data.body)
      .then((html) => {
        console.log(`PARSING: ${url}`);

        const $ = cheerio.load(html);

        $('div.projects div.public').each((i, el) => {
          const $element = $(el);

          const relPath = $element.find('a.descr').attr('href');

          if (relPath) {
            const linkToOffer = `https://freelance.ru${relPath}`;

            queue.push(linkToOffer);
          }
        });


        const title = $('#col_center > div > div.container.pshow > div > div.project_div.col-lg-pull-4.col-lg-8.col-md-pull-5.col-md-7.proj-right-column > div > div > h1')
          .text();
        const description = $('#proj_table > tbody > tr:nth-child(2) > td > p')
          .text();
        const budget = $('#col_center > div > div.container.pshow > div > div.col-lg-push-8.col-lg-4.col-md-push-7.col-md-5.proj-left-column > div > div:nth-child(1) > div > table > tbody > tr:nth-child(1) > td:nth-child(2)')
          .text();
        const publishedAt = $('#col_center > div > div.container.pshow > div > div.col-lg-push-8.col-lg-4.col-md-push-7.col-md-5.proj-left-column > div > div:nth-child(1) > div > table > tbody > tr:nth-child(5) > td:nth-child(2)').
          text();

        const offer = {
          title,
          description: description.replace(/(\t|\r|\n)/gm, ' ').split(' ').filter((el) => el !== '').join(' '),
          budget,
          publishedAt: new Date(publishedAt),
          publishedAtTS: Date.parse(publishedAt),
          url,
        };

        results.push(offer);

        const nextPagePath = $('#col_center > div > div:nth-child(2) > div > div > ul').find('a[title="на следующую страницу"]')
          .attr('href');

        if (nextPagePath) {
          const nextPageUrl = `https://freelance.ru${nextPagePath}`;

          queue.push(nextPageUrl);
        }

        callback();
      })
      .catch((err) => console.log('Error! From Queue!', err));
  }, 10);

  // эта функция выполнится, когда в очереди закончатся ссылки
  queue.drain = () => {
    const offers = results.filter((el) => el.title !== '' && el.description !== '');

    offers.forEach(async (el) => {
      const offerInDb = await Offer.findOne({ url: el.url });

      if (!offerInDb) {
        const newOffer = new Offer({
          title: el.title,
          description: el.description,
          hasProjectBudget: el.budget.match(/\d/gmi) !== null,
          hasHourlyRate: false,
          budget: el.budget.match(/\d/gmi) !== null ? el.budget.match(/\d/gmi).join('') : 'Цена договорная',
          publishedAt: `${el.publishedAt.getDate()}.${el.publishedAt.getMonth() + 1}.${el.publishedAt.getFullYear()}`,
          publishedAtTS: el.publishedAtTS,
          url: el.url,
          from: 'freelance',
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
  queue.push(freelanceUrl);
}

module.exports = scrapeFreelance;
