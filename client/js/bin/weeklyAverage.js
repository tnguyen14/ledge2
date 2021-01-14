require('dotenv').config();

const moment = require('moment-timezone');
const { getJson } = require('simple-fetch');
const qs = require('qs');
const { usd } = require('@tridnguyen/money');

const TIMEZONE = 'America/New_York';

function sum(nums) {
  if (!Array.isArray(nums)) {
    console.log(`${nums} is not array`);
    return 0;
  }
  return nums.reduce(function (subtotal, num) {
    return subtotal + num;
  }, 0);
}

async function getWeeklyAverage(start, end) {
  const startMonday = start.isoWeekday(1).startOf('day');
  const endMonday = end.isoWeekday(8).startOf('day');
  const numWeeks = endMonday.diff(startMonday, 'week');

  const query = qs.stringify({
    where: [
      {
        field: 'date',
        op: '>=',
        value: startMonday.toISOString()
      },
      {
        field: 'date',
        op: '<',
        value: endMonday.toISOString()
      }
    ]
  });

  const transactions = await getJson(`${window.SERVER_URL}/items?${query}`, {
    headers: {
      Authorization: `Bearer ${window.AUTH_TOKEN}`
    }
  });
  const total = sum(transactions.map((t) => t.amount));
  const average = total / numWeeks;
  console.log(`Getting average for
${startMonday.toISOString()} - ${endMonday.toISOString()} (${numWeeks} weeks)`);

  return usd(average);
}

async function year(y) {
  const now = moment().tz(TIMEZONE);
  const start = moment(`${y}-01-01`).tz(TIMEZONE);
  let end = moment(`${y}-12-31`).tz(TIMEZONE);
  if (now.isBefore(end)) {
    end = now;
  }
  return await getWeeklyAverage(start, end);
}

year('2019').then(console.log, console.error);
year('2020').then(console.log, console.error);
// getWeeklyAverage(moment('2020-03-16').tz(TIMEZONE), moment().tz(TIMEZONE)).then(console.log, console.error);
