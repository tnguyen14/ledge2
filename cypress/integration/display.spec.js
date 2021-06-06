import {
  firstWeek,
  currentMonthAverageValue,
  weekStats4WeekAverageValue
} from '../selectors.js';

describe('Display', () => {
  it('logged in content', () => {
    cy.contains('Add a new transaction');
    cy.contains('Weekly Averages');

    cy.get('select[name=category]').should('have.value', 'dineout');
    cy.get('select[name=source]').should('have.value', 'chase-sapphire');

    cy.get(currentMonthAverageValue).invoke('text').as('currentMonthAverage');

    cy.get(firstWeek).scrollIntoView();
    cy.get(`${firstWeek} ${weekStats4WeekAverageValue}`).should(function (
      $4weekAverage
    ) {
      expect($4weekAverage.text()).to.equal(this.currentMonthAverage);
    });
  });
});
