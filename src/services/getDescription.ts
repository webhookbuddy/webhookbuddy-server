import mapToKeyValue from './mapToKeyValue';

const getStripeCustomer = entity =>
  `${
    entity.body_json?.data?.object?.customer ??
    (entity.body_json?.data?.object?.object === 'customer'
      ? entity.body_json.data.object.id
      : '')
  }`;

const tryGetStripe = (entity: any) =>
  mapToKeyValue(entity.headers).find(
    o =>
      o.key.toLowerCase() === 'user-agent' &&
      o.value.toLowerCase().startsWith('stripe'),
  )
    ? `${getStripeCustomer(entity)} ${entity.body_json?.type}`
    : null;

const tryGetSendgrid = (entity: any) =>
  mapToKeyValue(entity.headers).find(
    o =>
      o.key.toLowerCase() === 'user-agent' &&
      o.value === 'SendGrid Event API',
  ) && Array.isArray(entity.body_json)
    ? entity.body_json.length > 5
      ? `${entity.body_json.length} messages: ${entity.body_json
          .map(o => o.event)
          .slice(0, 3)
          .join(',')}...`
      : entity.body_json.map(o => o.event).join(',')
    : null;

const tryGetArray = (entity: any) =>
  Array.isArray(entity.body_json)
    ? `${entity.body_json.length} messages`
    : null;

const getDescription = (entity: any) =>
  tryGetStripe(entity) ??
  tryGetSendgrid(entity) ??
  tryGetArray(entity) ??
  entity.method;

export default getDescription;
