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

    // use .contains to wait for the select values to be populated
    cy.get('select[name=category]')
      .contains('Dine Out')
      .should('have.value', 'dineout');
    cy.get('select[name=source]')
      .contains('Chase Sapphire')
      .should('have.value', 'chase-sapphire');

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
});
