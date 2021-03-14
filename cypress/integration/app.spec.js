import { usd, fromUsd, fromCents } from '@tridnguyen/money';
import slugify from '@tridnguyen/slugify';
import moment from 'moment-timezone';

// selectors
const accountStats = '.account-stats';
const accountStatsAverages = `${accountStats} .averages`;
const currentMonthAverage = `${accountStatsAverages} .stat:first-of-type`;
const currentMonthAverageValue = `${currentMonthAverage} td:nth-of-type(2)`;

const firstWeek = '.transactions .weeks .weekly:first-of-type';
const secondWeek = '.transactions .weeks .weekly:nth-of-type(2)';
const firstTransaction = '.weekly-transactions .transaction:first-of-type';
const secondTransaction = '.weekly-transactions .transaction:nth-of-type(2)';

const weekStats = '.week-stats';
const weekStats4WeekAverage = `${weekStats} .stat[data-cat=average-past-4-weeks]`;
const weekStats4WeekAverageValue = `${weekStats4WeekAverage} td:nth-of-type(2)`;

const amountField = 'input[name=amount]';
const merchantField = 'input[name=merchant]';
const submitButton = 'button[type=submit]';

const SERVER_URL = Cypress.env('SERVER_URL');
describe('Ledge', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.intercept(`${SERVER_URL}/meta`).as('accountMeta');
    cy.intercept(`${SERVER_URL}/items?*`).as('weeks');

    // request payload
    /*
    {
      "description": "",
      "merchant": "Amazon",
      "category": "dineout",
      "source": "chase-sapphire",
      "date": "2021-01-07T04:11:00.000Z",
      "amount": 5000,
      "span": 1,
      "id":"1609992660000"
    }
    */
    cy.intercept('POST', `${SERVER_URL}/items`, '{"success": true}').as(
      'addTransaction'
    );

    cy.intercept('PATCH', `${SERVER_URL}/items/*`, '{"success": true}').as(
      'updateTransaction'
    );

    cy.intercept('DELETE', `${SERVER_URL}/items/*`, '{"success": true}').as(
      'deleteTransaction'
    );

    // request payload
    /*
    {
      "merchants_count": {
        "market-cafe": {
          "count": 1,
          "values": ["Market Cafe]
        }
      }
    }
    */
    cy.intercept('PATCH', `${SERVER_URL}/meta`, '{"success": true}').as(
      'updateAccountMeta'
    );

    // block all potentially destructive requests
    cy.intercept('POST', '*', '{"success": true}');
    cy.intercept('PATCH', '*', '{"success": true}');
    cy.intercept('DELETE', '*', '{"success": true}');

    cy.visit('/');
  });

  it('Show login button, perform login', () => {
    cy.contains('Log In');
    cy.login();
    cy.saveLocalStorage();
  });

  it('Display logged in content', () => {
    cy.contains('Add a new transaction');
    cy.contains('Weekly Averages');

    // account meta is loaded on the form
    cy.wait('@accountMeta');
    cy.get('select[name=category]').should('have.value', 'dineout');
    cy.get('select[name=source]').should('have.value', 'chase-sapphire');

    // weekly averages are loaded and match
    cy.wait('@weeks');
    cy.get(currentMonthAverageValue).then(($currentMonth) => {
      const currentMonthAverage = $currentMonth.text();
      cy.get(`${firstWeek} ${weekStats4WeekAverageValue}`).should(
        ($4weekAverage) => {
          expect($4weekAverage.text()).to.equal(currentMonthAverage);
        }
      );
    });
  });

  it('Add a transaction', () => {
    cy.wait('@accountMeta').then((interception) => {
      const merchantCount = interception.response.body.merchants_count.amazon;
      cy.contains('Finished loading transactions', { timeout: 15000 });

      cy.get(currentMonthAverageValue).then(($stat) => {
        const average = fromUsd($stat.text());

        cy.get(amountField).type('50.80');
        cy.get(merchantField).type('Amazon');
        cy.get('select[name=category]').select('shopping');
        cy.get('select[name=source]').select('visa-0162');
        cy.get(submitButton).click();
        cy.wait(['@addTransaction', '@updateAccountMeta']).then(
          (interceptions) => {
            const addTransactionRequest = interceptions[0].request.body;
            expect(addTransactionRequest).to.have.property(
              'merchant',
              'Amazon'
            );
            expect(addTransactionRequest).to.have.property('amount', 5080);
            expect(addTransactionRequest).to.have.property(
              'category',
              'shopping'
            );
            expect(addTransactionRequest).to.have.property(
              'source',
              'visa-0162'
            );
            expect(addTransactionRequest).to.have.property('span', 1);
            expect(addTransactionRequest).to.have.property('id');
            expect(addTransactionRequest).to.have.property('date');

            const updateAccountRequest = interceptions[1].request.body;
            expect(updateAccountRequest.merchants_count.amazon).to.deep.equal({
              ...merchantCount,
              count: merchantCount.count + 1
            });
            const displayDate = moment().format('ddd');
            cy.get(
              `${firstWeek} .weekly-transactions .transaction[data-day=${displayDate}]`
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
              const newAverage = fromUsd($newStat.text());
              expect(newAverage).to.equal(average + 5080 / 4);
            });
          }
        );
      });
    });
  });

  it('Update a transaction - amount', () => {
    cy.contains('Finished loading transactions', { timeout: 15000 });
    cy.get(`${secondWeek} ${firstTransaction} [data-field=amount]`).then(
      ($amount) => {
        const amount = fromUsd($amount.text());
        cy.get(`${secondWeek} ${weekStats4WeekAverageValue}`).then(
          ($average) => {
            const sum = Number($average.data('sum'));
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

              cy.get(
                `${secondWeek} ${firstTransaction} [data-field=amount]`
              ).should(($amount) => {
                expect($amount.text()).to.equal(usd(amount + 4020));
              });
              cy.get(`${secondWeek} ${weekStats4WeekAverageValue}`).should(
                ($average) => {
                  expect($average.text()).to.equal(usd((sum + 4020) / 4));
                }
              );
            });
          }
        );
      }
    );
  });

  it('Update a transaction - merchant', () => {
    cy.wait('@accountMeta').then((interception) => {
      const merchantsCount = interception.response.body.merchants_count;
      const newMerchant = 'Test Merchant';
      cy.contains('Finished loading transactions', { timeout: 15000 });
      cy.get(`${secondWeek} ${secondTransaction} [data-field=merchant]`).then(
        ($merchant) => {
          const oldMerchant = $merchant.text();
          cy.get(
            `${secondWeek} ${secondTransaction} [data-field=action] .edit`
          ).click();
          cy.get(submitButton).contains('update');
          cy.get(merchantField).clear().type(newMerchant);
          cy.get(submitButton).click();
          cy.wait(['@updateTransaction', '@updateAccountMeta'], {
            timeout: 10000
          }).then((interceptions) => {
            const updateTransactionRequest = interceptions[0].request.body;
            expect(updateTransactionRequest).to.have.property(
              'merchant',
              newMerchant
            );

            cy.get(
              `${secondWeek} ${secondTransaction} [data-field=merchant]`
            ).should(($merchant) => {
              expect($merchant.text()).to.equal(newMerchant);
            });
            const updateAccountRequest = interceptions[1].request.body;
            const oldMerch = slugify(oldMerchant);
            const newMerch = slugify(newMerchant);
            const oldMerchantCount = merchantsCount[oldMerch];

            if (oldMerchantCount.count == 1) {
              expect(updateAccountRequest.merchants_count[oldMerch]).to.be.null;
            } else {
              expect(
                updateAccountRequest.merchants_count[oldMerch]
              ).to.deep.equal({
                ...oldMerchantCount,
                count: oldMerchantCount.count - 1
              });
            }
            expect(
              updateAccountRequest.merchants_count[newMerch]
            ).to.deep.equal({
              count: 1,
              values: [newMerchant]
            });
          });
        }
      );
    });
  });

  it('Delete a transaction', () => {
    cy.wait('@accountMeta').then((interception) => {
      const merchantsCount = interception.response.body.merchants_count;
      cy.contains('Finished loading transactions', { timeout: 15000 });
      cy.get(`${secondWeek} ${secondTransaction} [data-field=amount]`).then(
        ($amount) => {
          const amount = fromUsd($amount.text());
          cy.get(
            `${secondWeek} ${secondTransaction} [data-field=merchant]`
          ).then(($merchant) => {
            const merchant = slugify($merchant.text());
            const merchantCount = merchantsCount[merchant];
            cy.get(`${secondWeek} ${weekStats4WeekAverageValue}`).then(
              ($average) => {
                const sum = Number($average.data('sum'));
                cy.get(
                  `${secondWeek} ${secondTransaction} [data-field=action] .remove`
                ).click();
                cy.get('.delete-dialog').should('be.visible');
                cy.get('.delete-dialog button').contains('Delete').click();
                cy.wait(['@deleteTransaction', '@updateAccountMeta']).then(
                  (interceptions) => {
                    cy.get(secondWeek).should('not.contain', $amount.text());
                    cy.get(
                      `${secondWeek} ${weekStats4WeekAverageValue}`
                    ).should(($average) => {
                      expect($average.text()).to.equal(usd((sum - amount) / 4));
                    });
                    const updateAccountRequest = interceptions[1].request.body;
                    if (merchantCount.count == 1) {
                      expect(updateAccountRequest.merchants_count[merchant]).to
                        .be.null;
                    } else {
                      expect(
                        updateAccountRequest.merchants_count[merchant]
                      ).to.deep.equal({
                        ...merchantCount,
                        count: merchantCount.count - 1
                      });
                    }
                  }
                );
              }
            );
          });
        }
      );
    });
  });
});
