const cheerio = require('cheerio');
const tress = require('tress');
const fetch = require('node-fetch');
const parseDate = require('../parse-date.js');

const Offer = require('../../models/offer.js');

function scrapeHabr() {
  const habrUrl = 'https://freelance.habr.com/tasks?_=1596613017168&categories=development_all_inclusive%2Cdevelopment_backend%2Cdevelopment_frontend%2Cdevelopment_prototyping%2Cdevelopment_ios%2Cdevelopment_android%2Cdevelopment_desktop%2Cdevelopment_bots%2Cdevelopment_games%2Cdevelopment_1c_dev%2Cdevelopment_scripts%2Cdevelopment_voice_interfaces%2Cdevelopment_other';
  const results = [];

  const queue = tress((url, callback) => {
    fetch(url)
      .then((data) => data.text())
      .then((html) => {
        console.log(`PARSING: ${url}`);

        const $ = cheerio.load(html);

        $('.content-list__item').each((i, el) => {
          const $element = $(el);

          const relPath = $element.find('article div header div.task__title a').attr('href');
          const linkToOffer = `https://freelance.habr.com${relPath}`;

          queue.push(linkToOffer);
        });

        const title = $('body > div.layout > main > section > div > div > div > div.task.task_detail > h2').text();
        const description = $('body > div.layout > main > section > div > div > div > div.task.task_detail > div.task__description').text();
        const budget = $('body > div.layout > main > section > div > div > div > div.task.task_detail > div.task__finance > span').text();
        const publishedAt = $('body > div.layout > main > section > div > div > div > div.task.task_detail > div.task__meta').text();
        const isArchived = !($('body > div.layout > div > div > div > div').text() === '');

        const tags = [];
        $('body > div.layout > main > section > div > div > div > div.task.task_detail > div.task__tags > ul li.tags__item').each((i, el) => {
          const $element = $(el);

          const tag = $element.find('a').text();

          tags.push(tag);
        });

        const offer = {
          title: title.replace(/(\r|\n)/gm, ' ').split(' ').filter((el) => el !== '').join(' '),
          description: description.replace(/(\r|\n)/gm, ' ').split(' ').filter((el) => el !== '').join(' '),
          budget: budget.replace(/(\r|\n)/gm, ''),
          publishedAtTS: parseDate(publishedAt.replace(/(\r|\n)/gm, '')),
          publishedAt: new Date(parseDate(publishedAt.replace(/(\r|\n)/gm, ''))),
          tags,
          url,
          isArchived,
        };

        results.push(offer);

        const nextPagePath = $('#pagination > div > a.next_page').attr('href');

        if (nextPagePath) {
          const nextPageUrl = `https://freelance.habr.com${nextPagePath}`;

          queue.push(nextPageUrl);
        }

        callback();
      })
      .catch((err) => console.log('Error!', err));
  }, 10);

  // эта функция выполнится, когда в очереди закончатся ссылки
  queue.drain = () => {
    const offers = results.filter((el) => el.title !== '' && el.title !== 'Архив' && !el.isArchived);

    offers.forEach(async (el) => {
      const offerInDb = await Offer.findOne({ url: el.url });

      if (!offerInDb) {
        const newOffer = new Offer({
          title: el.title,
          description: el.description,
          hasProjectBudget: el.budget.match(/\d/gi) !== null && el.budget.includes('проект'),
          hasHourlyRate: el.budget.match(/\d/gi) !== null && el.budget.includes('час'),
          budget: el.budget.match(/\d/gi) !== null ? el.budget.match(/\d/gi).join('') : 'Цена договорная',
          publishedAt: `${el.publishedAt.getDate()}.${el.publishedAt.getMonth() + 1}.${el.publishedAt.getFullYear()}`,
          publishedAtTS: el.publishedAtTS,
          tags: el.tags,
          url: el.url,
          from: 'habr freelance',
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
  queue.push(habrUrl);
}

module.exports = scrapeHabr;
