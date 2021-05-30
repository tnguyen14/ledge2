import slugify from '@tridnguyen/slugify';
import { usd, fromUsd, fromCents } from '@tridnguyen/money';
import {
  secondWeek,
  firstTransaction,
  secondTransaction,
  amountField,
  merchantField,
  submitButton,
  weekStats4WeekAverageValue
} from '../selectors.js';

export function amount() {
  cy.get(`${secondWeek} ${firstTransaction} [data-field=amount]`)
    .as('amount')
    .invoke('text')
    .as('firstTransactionAmount');
  cy.get(`${secondWeek} ${weekStats4WeekAverageValue}`).then(function (
    $average
  ) {
    const amount = fromUsd(this.firstTransactionAmount);
    cy.log(`Old amount is ${amount}`);
    const sum = Number($average.data('sum'));
    cy.log(`sum of 4 weeks ${sum}`);
    cy.get(`${secondWeek} ${firstTransaction}`)
      .scrollIntoView()
      .should('be.visible');
    cy.get(
      `${secondWeek} ${firstTransaction} [data-field=action] .edit`
    ).click();
    cy.get(submitButton).contains('update');
    cy.get(amountField)
      .clear()
      .type(fromCents(amount + 4020));
    cy.get(submitButton).click();
    cy.wait('@updateTransaction').then((interception) => {
      const updateTransactionRequest = interception.request.body;
      expect(updateTransactionRequest).to.have.property(
        'amount',
        amount + 4020
      );

      cy.get(secondWeek).scrollIntoView();

      cy.get('@amount').should(($newAmount) => {
        expect($newAmount.text()).to.equal(usd(amount + 4020));
      });
      cy.get(`${secondWeek} ${weekStats4WeekAverageValue}`).should(
        ($newAverage) => {
          expect($newAverage.text()).to.equal(usd((sum + 4020) / 4));
        }
      );
    });
  });
}

export function merchant() {
  const newMerchant = 'Test Merchant';
  cy.get(`${secondWeek} ${secondTransaction} [data-field=merchant]`)
    .as('merchant')
    .invoke('text')
    .as('oldMerchant');
  cy.get(
    `${secondWeek} ${secondTransaction} [data-field=action] .edit`
  ).click();
  cy.get(submitButton).contains('update');
  cy.get(merchantField).clear().type(newMerchant);
  cy.get(submitButton).click();
  cy.wait(['@updateTransaction', '@updateAccountMeta'], {
    timeout: 10000
  }).then(function (interceptions) {
    const updateTransactionRequest = interceptions[0].request.body;
    expect(updateTransactionRequest).to.have.property('merchant', newMerchant);

    cy.get(`${secondWeek} ${secondTransaction} [data-field=merchant]`).should(
      ($merchant) => {
        expect($merchant.text()).to.equal(newMerchant);
      }
    );
    const updateAccountRequest = interceptions[1].request.body;
    const merchantsCount = this.accountMetaResponse.body.merchants_count;
    const oldMerch = slugify(this.oldMerchant);
    const newMerch = slugify(newMerchant);
    const oldMerchantCount = merchantsCount[oldMerch];

    if (oldMerchantCount.count == 1) {
      expect(updateAccountRequest.merchants_count[oldMerch]).to.be.null;
    } else {
      expect(updateAccountRequest.merchants_count[oldMerch]).to.deep.equal({
        ...oldMerchantCount,
        count: oldMerchantCount.count - 1
      });
    }
    expect(updateAccountRequest.merchants_count[newMerch]).to.deep.equal({
      count: 1,
      values: [newMerchant]
    });
  });
}
