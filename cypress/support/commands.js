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

// -- This is a parent command --
Cypress.Commands.add('login', () => {
  cy.request('POST', `https://${Cypress.env('AUTH0_DOMAIN')}/oauth/token`, {
    client_id: Cypress.env('CYPRESS_AUTH0_CLIENT_ID'),
    client_secret: Cypress.env('CYPRESS_AUTH0_CLIENT_SECRET'),
    audience: 'https://lists.cloud.tridnguyen.com',
    grant_type: 'client_credentials'
  }).then((response) => {
    cy.setLocalStorage('id_token', response.body.access_token);
    cy.setLocalStorage(
      'expires_at',
      JSON.stringify(response.body.expires_in * 1000 + Date.now())
    );
  });
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
