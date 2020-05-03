import { PubSub } from 'apollo-server';

import * as WEBHOOK_EVENTS from './webhook';

export const EVENTS = {
  WEBHOOK: WEBHOOK_EVENTS,
};

export default new PubSub();
