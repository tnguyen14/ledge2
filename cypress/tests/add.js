import { fromUsd } from '@tridnguyen/money';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { TIMEZONE, DISPLAY_DAY_FORMAT } from '../../src/util/constants';

import {
  amountField,
  merchantField,
  submitButton,
  currentMonthAverageValue,
  firstWeek
} from '../selectors.js';

export function add() {
  const merchantCount = this.accountMetaResponse.body.merchants_count.amazon;

  cy.get(currentMonthAverageValue).invoke('text').as('currentMonthAverage');

  cy.get(amountField).type('50.80');
  cy.get(merchantField).type('Amazon');
  cy.get('select[name=category]').select('shopping');
  cy.get('select[name=source]').select('visa-0162');
  cy.get(submitButton).click();
  cy.wait(['@addTransaction', '@updateAccountMeta']).then(function (
    interceptions
  ) {
    const addTransactionRequest = interceptions[0].request.body;
    expect(addTransactionRequest).to.have.property('merchant', 'Amazon');
    expect(addTransactionRequest).to.have.property('amount', 5080);
    expect(addTransactionRequest).to.have.property('category', 'shopping');
    expect(addTransactionRequest).to.have.property('source', 'visa-0162');
    expect(addTransactionRequest).to.have.property('span', 1);
    expect(addTransactionRequest).to.have.property('id');
    expect(addTransactionRequest).to.have.property('date');

    const updateAccountRequest = interceptions[1].request.body;
    expect(updateAccountRequest.merchants_count.amazon).to.deep.equal({
      ...merchantCount,
      count: merchantCount.count + 1
    });

    cy.get(firstWeek).scrollIntoView();

    const today = utcToZonedTime(new Date(), TIMEZONE);
    const displayDay = format(today, DISPLAY_DAY_FORMAT);
    cy.get(
      `${firstWeek} .weekly-transactions .transaction[data-day=${displayDay}]`
    ).as('transaction');
    cy.get('@transaction')
      .find('[data-field=merchant]')
      .should(($merchant) => {
        expect($merchant.text()).to.contains('Amazon');
      });
    cy.get('@transaction')
      .find('[data-field=amount]')
      .should(($amount) => {
        expect($amount.text()).to.contains('$50.80');
      });
    cy.get('@transaction')
      .find('[data-field=source]')
      .should(($source) => {
        expect($source.text()).to.contains('Amazon');
      });
    cy.get('@transaction')
      .find('[data-field=category]')
      .should(($category) => {
        expect($category.text()).to.contains('Shopping');
      });
    cy.get(currentMonthAverageValue).should(($newStat) => {
      const oldAverage = fromUsd(this.currentMonthAverage);
      const newAverage = fromUsd($newStat.text());
      expect(newAverage).to.equal(oldAverage + 5080 / 4);
    });
  });
}
