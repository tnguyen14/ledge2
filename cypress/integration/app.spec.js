const SERVER_URL = 'https://api.tridnguyen.com/lists/ledge/tri';
describe('Open app', () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.visit('/');
  });
  it('Show login button, perform login', () => {
    cy.contains('Log In');
    cy.login();
    cy.saveLocalStorage();
  });
  it('Display logged in content', () => {
    cy.intercept(`${SERVER_URL}/meta`).as('accountMeta');
    cy.intercept(`${SERVER_URL}/items?*`).as('weeks');

    // reload the page to capture network requests
    cy.visit('/');

    cy.contains('Add a new transaction');
    cy.contains('Weekly Averages');

    // account meta is loaded on the form
    cy.wait('@accountMeta');
    cy.get('select[name=category]').should('have.value', 'dineout');
    cy.get('select[name=source]').should('have.value', 'chase-sapphire');
  });
});
