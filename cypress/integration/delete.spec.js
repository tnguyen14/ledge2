import slugify from '@tridnguyen/slugify';
import { usd, fromUsd } from '@tridnguyen/money';
import {
  secondWeek,
  secondTransaction,
  weekStats4WeekAverageValue,
  deleteDialog
} from '../selectors.js';

describe('Delete', () => {
  it('a transaction', () => {
    cy.get(`${secondWeek} ${secondTransaction} [data-field=amount]`)
      .invoke('text')
      .as('amount');
    cy.get(`${secondWeek} ${secondTransaction} [data-field=merchant]`)
      .invoke('text')
      .as('merchant');
    cy.get(`${secondWeek} ${weekStats4WeekAverageValue}`).then(function (
      $average
    ) {
      const amount = fromUsd(this.amount);
      const merchant = slugify(this.merchant);
      const merchantsCount = this.accountMetaResponse.body.merchants_count;
      const merchantCount = merchantsCount[merchant];
      const sum = Number($average.data('sum'));
      cy.get(
        `${secondWeek} ${secondTransaction} [data-field=action] .remove`
      ).click();
      cy.get(deleteDialog)
        .should('be.visible')
        .find('button')
        .contains('Delete')
        .click();
      cy.wait(['@deleteTransaction', '@updateAccountMeta'], {
        timeout: 10000
      }).then(function (interceptions) {
        cy.get(secondWeek).should('not.contain', this.amount);
        cy.get(`${secondWeek} ${weekStats4WeekAverageValue}`).should(function (
          $newAverage
        ) {
          expect($newAverage.text()).to.equal(usd((sum - amount) / 4));
        });
        const updateAccountRequest = interceptions[1].request.body;
        if (merchantCount.count == 1) {
          expect(updateAccountRequest.merchants_count[merchant]).to.be.null;
        } else {
          expect(updateAccountRequest.merchants_count[merchant]).to.deep.equal({
            ...merchantCount,
            count: merchantCount.count - 1
          });
        }
      });
    });
  });
});
