import { display } from './display.spec.js';
import { add } from './add.spec.js';
import { amount, merchant } from './update.spec.js';
import { remove } from './delete.spec.js';
import { loginButton } from '../selectors';

describe('Ledge', () => {
  before(() => {
    cy.visit('/');
    cy.get('body').then(($body) => {
      if ($body.find(loginButton).length) {
        cy.log('Login required - performing login');
        cy.login();
        cy.saveLocalStorage();
        cy.reload();
      }
    });
  });
  it('Display logged in content', display);
  it('Add a transaction', add);
  it('Update transaction amount', amount);
  it('Update transaction merchant', merchant);
  it('Delete a transaction', remove);
});
