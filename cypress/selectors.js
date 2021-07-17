export const loginButton = '.login button';

export const newTransactionForm = '.new-transaction';
const accountStats = '.account-stats';
const accountStatsTabsSelector = `${accountStats} .tabs-selector`;
export const accountStatsWeeklyAveragesSelector = `${accountStatsTabsSelector} .weekly-averages`;
export const accountStatsAverages = `${accountStats} .averages`;
const currentMonthAverage = `${accountStatsAverages} .stat:first-of-type`;
export const currentMonthAverageValue = `${currentMonthAverage} td:nth-of-type(2)`;

const weeks = '.transactions .weeks';
export const firstWeek = `${weeks} .weekly:first-of-type`;
export const secondWeek = `${weeks} .weekly:nth-of-type(2)`;
export const firstTransaction =
  '.weekly-transactions .transaction:first-of-type';
export const secondTransaction =
  '.weekly-transactions .transaction:nth-of-type(2)';

const weekStats = '.week-stats';
const weekStats4WeekAverage = `${weekStats} .stat[data-cat=4-week-average]`;
export const weekStats4WeekAverageValue = `${weekStats4WeekAverage} td:nth-of-type(2)`;

export const amountField = 'input[name=amount]';
export const merchantField = 'input[name=merchant]';
export const submitButton = 'button[type=submit]';

export const deleteDialog = '[data-cy=delete-dialog]';
