const parseDate = (date) => {
  const dateArr = date.split(' ');
  const months = {
    января: '01',
    февраля: '02',
    марта: '03',
    апреля: '04',
    мая: '05',
    июня: '06',
    июля: '07',
    августа: '08',
    сентября: '09',
    октября: '10',
    ноября: '11',
    декабря: '12',
  };

  const monthName = dateArr[1];
  const monthNum = months[monthName];

  dateArr.splice(1, 1, monthNum);
  const dateToParse = [dateArr[1], dateArr[0], dateArr[2], dateArr[3]].join(' ');

  return Date.parse(dateToParse);
};

module.exports = parseDate;
