import mapToKeyValue from './mapToKeyValue';

const getStripeCustomer = (entity: any) =>
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
    ? `${getStripeCustomer(entity)} ${entity.body_json?.type}`.trim()
    : null;

const tryGetSendgrid = (entity: any) =>
  mapToKeyValue(entity.headers).find(
    o =>
      o.key.toLowerCase() === 'user-agent' &&
      o.value === 'SendGrid Event API',
  ) && Array.isArray(entity.body_json)
    ? entity.body_json.length > 5
      ? `${entity.body_json.length} messages: ${entity.body_json
          .map((o: any) => o.event)
          .slice(0, 3)
          .join(',')}...`
      : entity.body_json.map((o: any) => o.event).join(',')
    : null;

const tryGetEventbrite = (entity: any) =>
  mapToKeyValue(entity.headers).find(
    o => o.key.toLowerCase() === 'x-eventbrite-event',
  )?.value;

const getMailgunRecipient = (entity: any) =>
  (entity.body_json?.['event-data']?.recipient ?? '').split('@')[0];

const getMailgunEvent = (entity: any) =>
  entity.body_json?.['event-data']?.event ?? '';

const tryGetMailgun = (entity: any) =>
  mapToKeyValue(entity.headers).find(
    o =>
      o.key.toLowerCase() === 'user-agent' &&
      o.value.toLowerCase().startsWith('mailgun'),
  )
    ? `${getMailgunRecipient(entity)} ${getMailgunEvent(
        entity,
      )}`.trim()
    : null;

const tryGetArray = (entity: any) =>
  Array.isArray(entity.body_json)
    ? `${entity.body_json.length} messages`
    : null;

const getDescription = (entity: any) =>
  tryGetStripe(entity) ??
  tryGetSendgrid(entity) ??
  tryGetEventbrite(entity) ??
  tryGetMailgun(entity) ??
  tryGetArray(entity) ??
  entity.method;

export default getDescription;
