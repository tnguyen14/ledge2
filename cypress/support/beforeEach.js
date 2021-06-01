const SERVER_URL = Cypress.env('SERVER_URL');

/**
 * Disable css smooth scroll, that doesn't plays nice with cypress.
 * See https://github.com/cypress-io/cypress/issues/3200
 */
const disableSmoothScroll = () => {
  cy.document().then((document) => {
    const node = document.createElement('style');
    node.innerHTML = 'html { scroll-behavior: inherit !important; }';
    document.body.appendChild(node);
  });
};

beforeEach(() => {
  cy.viewport('macbook-16');
  cy.log(`Timezone offset ${new Date().getTimezoneOffset()}`);
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

  cy.reload();
  disableSmoothScroll();
  cy.wait('@accountMeta').then((interception) => {
    cy.wrap(interception.response).as('accountMetaResponse');
  });
  cy.contains('Finished loading transactions', { timeout: 15000 });
});
