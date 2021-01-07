import { fromUsd } from '@tridnguyen/money';

const SERVER_URL = 'https://api.tridnguyen.com/lists/ledge/tri';
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
    cy.get('.stats .averages .stat:first-of-type td:nth-of-type(2)').then(
      ($currentMonth) => {
        const currentMonthAverage = $currentMonth.text();
        cy.get(
          '.transactions .weekly:first-of-type .stats .stat:last-of-type td:nth-of-type(2)'
        ).should(($4weekAverage) => {
          expect($4weekAverage.text()).to.equal(currentMonthAverage);
        });
      }
    );
  });

  it('Add a transaction', () => {
    cy.wait('@accountMeta').then((interception) => {
      const merchantCount = interception.response.body.merchants_count.amazon;
      cy.contains('Finished loading 25 weeks', { timeout: 10000 });

      cy.get(
        '.account-stats .averages .stat:first-of-type td:nth-of-type(2)'
      ).as('currentMonthAverageValue');

      cy.get('@currentMonthAverageValue').then(($stat) => {
        cy.log($stat);
        cy.log($stat.text());
        const average = fromUsd($stat.text());

        cy.get('input[name=amount]').type('50');
        cy.get('input[name=merchant]').type('Amazon');
        cy.get('select[name=category]').select('shopping');
        cy.get('select[name=source]').select('visa-0162');
        cy.get('button[type=submit]').click();
        cy.wait(['@addTransaction', '@updateAccountMeta']).then(
          (interceptions) => {
            const addTransactionRequest = interceptions[0].request.body;
            expect(addTransactionRequest).to.have.property(
              'merchant',
              'Amazon'
            );
            expect(addTransactionRequest).to.have.property('amount', 5000);
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
            cy.get(
              '.transactions .weekly:first-of-type tbody .transaction:first-of-type'
            ).as('firstTransaction');
            cy.get('@firstTransaction')
              .find('[data-field=merchant]')
              .should(($merchant) => {
                expect($merchant.text()).to.equal('Amazon');
              });
            cy.get('@firstTransaction')
              .find('[data-field=amount]')
              .should(($amount) => {
                expect($amount.text()).to.equal('$50.00');
              });
            cy.get('@firstTransaction')
              .find('[data-field=source]')
              .should(($source) => {
                expect($source.text()).to.equal('Amazon');
              });
            cy.get('@firstTransaction')
              .find('[data-field=category]')
              .should(($category) => {
                expect($category.text()).to.equal('Shopping');
              });
            cy.get('@currentMonthAverageValue').should(($newStat) => {
              const newAverage = fromUsd($newStat.text());
              expect(newAverage).to.equal(average + 5000 / 4);
            });
          }
        );
      });
    });
  });
});
