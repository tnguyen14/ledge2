import { display } from '../tests/display.js';
import { add } from '../tests/add.js';
import { amount, merchant } from '../tests/update.js';
import { remove } from '../tests/delete.js';

describe('Ledge', () => {
  it('Display logged in content', display);
  it('Add a transaction', add);
  it('Update transaction amount', amount);
  it('Update transaction merchant', merchant);
  it('Delete a transaction', remove);
});
