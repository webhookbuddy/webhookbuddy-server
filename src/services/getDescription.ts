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

const tryGetArray = (entity: any) =>
  Array.isArray(entity.body_json)
    ? `${entity.body_json.length} messages`
    : null;

const getDescription = (entity: any) =>
  tryGetStripe(entity) ?? tryGetArray(entity) ?? entity.method;

export default getDescription;
