// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
import 'cypress-localstorage-commands';
import { loginButton, weeks } from '../selectors';

// -- This is a parent command --
Cypress.Commands.add('login', () => {
  cy.get(loginButton).click();

  cy.get('.auth0-lock-input-username .auth0-lock-input')
    .clear()
    .type(Cypress.env('TEST_USER'));

  cy.get('.auth0-lock-input-password .auth0-lock-input')
    .clear()
    .type(Cypress.env('TEST_PASSWORD'));
  cy.get('.auth0-lock-submit').click();
  // wait for callback
  cy.get(weeks, { timeout: 10000 });
});

//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
