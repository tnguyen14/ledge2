import { display } from './display.spec.js';
import { add } from './add.spec.js';
import { amount, merchant } from './update.spec.js';
import { remove } from './delete.spec.js';

describe('Ledge', () => {
  it('Display logged in content', display);
  it('Add a transaction', add);
  it('Update transaction amount', amount);
  it('Update transaction merchant', merchant);
  it('Delete a transaction', remove);
});
