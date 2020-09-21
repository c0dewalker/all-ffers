const cheerio = require('cheerio');
const needle = require('needle');
const tress = require('tress');

const Offer = require('../../models/offer.js');

function scrapeWeblancer() {
  const weblancerUrl = 'https://www.weblancer.net/jobs/veb-programmirovanie-31/';
  const results = [];

  const queue = tress((url, callback) => {
    needle('get', url)
      .then((data) => data.body)
      .then((html) => {
        console.log(`PARSING: ${url}`);

        const $ = cheerio.load(html);

        if ($('#tab_pane-main > div.page_content.landing > div.cols_table.no_hover.header > div > div > b').text() === '') {
          $('div.cols_table div.click_container-link').each((i, el) => {
            const $element = $(el);

            const relPath = $element.find('div.col-sm-10 div.title a').attr('href');

            if (relPath) {
              const linkToOffer = `https://www.weblancer.net${relPath}`;

              queue.push(linkToOffer);
            }
          });
        }

        const title = $('body > div.main-wrapper > main > div.page_header > div.wrapper.cols_table.no_hover > div > div > h1').text();
        const description = $('#tab_pane-main > div.page_content.landing > div:nth-child(3) > div > div.col-12.text_field > p').text();
        const budget = $('body > div.main-wrapper > main > div.page_header > div.wrapper.cols_table.no_hover > div > div > div > span.title.amount > span').text();
        const publishedAtTS = $('#tab_pane-main > div.page_content.landing > div:nth-child(3) > div > div:nth-child(1) > div.float-right.text-muted.hidden-xs-down > span').attr('data-timestamp') * 1000;

        const offer = {
          title: title.slice(0, title.indexOf('–') - 1),
          description: description.replace(/(\r|\n)/gm, ' ').split(' ').filter((el) => el !== '').join(' '),
          budget,
          publishedAtTS,
          publishedAt: new Date(publishedAtTS),
          url,
        };

        results.push(offer);

        const nextPagePath = $('#tab_pane-main > div.page_content.d-flex.flex-column > div.pagination_box > div > div.col.text-center > a.active')
          .next().attr('href');

        if (nextPagePath) {
          const nextPageUrl = `https://www.weblancer.net${nextPagePath}`;

          queue.push(nextPageUrl);
        }

        callback();
      })
      .catch((err) => console.log('Error! From Queue!', err));
  }, 10);

  // эта функция выполнится, когда в очереди закончатся ссылки
  queue.drain = () => {
    const offers = results.filter((el) => el.title !== 'Фриланс: веб-программирован' && el.description !== '');

    offers.forEach(async (el) => {
      const offerInDb = await Offer.findOne({ url: el.url });

      if (!offerInDb) {
        const newOffer = new Offer({
          title: el.title,
          description: el.description,
          hasProjectBudget: el.budget.match(/\d/gi) !== null,
          hasHourlyRate: false,
          budget: el.budget.match(/\d/gi) !== null ? el.budget : 'Цена договорная',
          publishedAt: `${el.publishedAt.getDate()}.${el.publishedAt.getMonth() + 1}.${el.publishedAt.getFullYear()}`,
          publishedAtTS: el.publishedAtTS,
          url: el.url,
          from: 'weblancer',
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
  queue.push(weblancerUrl);
}

module.exports = scrapeWeblancer;
