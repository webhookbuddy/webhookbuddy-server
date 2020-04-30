import 'mocha';
import { expect } from 'chai';
import * as proxyquire from 'proxyquire';

describe('processWebhook', () => {
  it('should return newly created webhook', async () => {
    const processWebhook = proxyquire('./processWebhook', {
      '../models/endpoint': {
        findByReferenceId: () => ({
          id: 1,
        }),
      },
      '../models/webhook': {
        insert: () => ({ id: 1 }),
      },
    }).default;

    const result = await processWebhook({
      referenceId: '123',
      contentType: 'application/json',
    });

    expect(result).to.have.property('id');
    expect(result.id).to.equal(1);
  });

  // I tried, but could not test the 'throw' scenario
});
