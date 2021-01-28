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
        '@noCallThru': true,
      },
      '../models/webhook': {
        insert: () => ({ id: 1 }),
        '@noCallThru': true,
      },
      '../subscriptions': {
        default: {
          publish: () => {},
        },
        EVENTS: {
          WEBHOOK: {
            CREATED: 'WEBHOOK_CREATED',
          },
        },
        '@noCallThru': true, // Without this, it times out with this error: Error: Timeout of 2000ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves.
      },
    }).default;

    const result = await processWebhook({
      referenceId: '123',
      contentType: 'application/json',
      rawHeaders: ['user-agent', 'Chrome', 'accept', 'anything'],
    });

    expect(result).to.have.property('id');
    expect(result.id).to.equal(1);
  });

  // I tried, but could not test the 'throw' scenario
});
