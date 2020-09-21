const cheerio = require('cheerio');
const needle = require('needle');
const tress = require('tress');

const Offer = require('../../models/offer.js');

function scrapeFreelancehunt() {
  const freelancehuntUrl = 'https://freelancehunt.com/projects/skill/veb-programmirovanie/99.html';
  const results = [];

  const queue = tress((url, callback) => {
    needle('get', url)
      .then((data) => data.body)
      .then((html) => {
        console.log(`PARSING: ${url}`);

        const $ = cheerio.load(html);

        $('#projects-html > table > tbody > tr').each((i, el) => {
          const $element = $(el);

          const linkToOffer = $element.find('td.left a').attr('href');

          if (linkToOffer) queue.push(linkToOffer);
        });

        const title = $('body > div.main_content > div.container > div > div:nth-child(2) > div > h1 > span.visible-xs > span')
          .text();
        const description = $('#project-description > span')
          .text();
        const budget = $('body > div.main_content > div.container > div > div:nth-child(2) > div > span.price-tag.pull-right.with-tooltip > span')
          .text();
        const publishedAtTS = $('body > div.main_content > div.container > div > div:nth-child(5) > div.col-md-3 > div:nth-child(3) > div > div > div:nth-child(2) > span')
          .attr('data-timestamp');

        const offer = {
          title,
          description: description.replace(/(\r|\n)/gm, ' ').split(' ').filter((el) => el !== '').join(' '),
          budget: budget.trim(),
          publishedAtTS: publishedAtTS * 1000,
          publishedAt: new Date(publishedAtTS * 1000),
          url,
        };

        results.push(offer);

        const nextPagePath = $('body > div.main_content > div.container > div > div:nth-child(3) > div.col-md-9.col-md-push-3 > div.pagination > ul > li:nth-child(8) > a')
          .attr('href');

        if (nextPagePath) {
          const nextPageUrl = `https://freelancehunt.com${nextPagePath}`;

          queue.push(nextPageUrl);
        }

        callback();
      })
      .catch((err) => console.log('Error! From Queue!', err));
  }, 10);

  // эта функция выполнится, когда в очереди закончатся ссылки
  queue.drain = () => {
    const offers = results.filter((el) => el.description !== '' && el.title !== '');

    offers.forEach(async (el) => {
      const offerInDb = await Offer.findOne({ url: el.url });

      if (!offerInDb) {
        const newOffer = new Offer({
          title: el.title,
          description: el.description,
          hasProjectBudget: el.budget !== '',
          hasHourlyRate: false,
          budget: el.budget !== '' ? el.budget : 'Цена договорная',
          publishedAtTS: el.publishedAtTS,
          publishedAt: `${el.publishedAt.getDate()}.${el.publishedAt.getMonth() + 1}.${el.publishedAt.getFullYear()}`,
          url: el.url,
          from: 'freelancehunt',
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
  queue.push(freelancehuntUrl);
}

module.exports = scrapeFreelancehunt;
