import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    webhook(id: ID!): Webhook
    webhooks(endpointId: ID!, after: Int): WebhookConnection!
  }

  extend type Mutation {
    readWebhook(input: ReadWebhookInput!): ReadWebhookPayload!
    deleteWebhook(input: DeleteWebhookInput!): DeleteWebhookPayload!
  }

  extend type Subscription {
    webhookCreated(endpointId: ID!): CreateWebhookPayload!
    webhookUpdated(endpointId: ID!): UpdateWebhookPayload!
  }

  type Webhook {
    id: ID!
    createdAt: DateTime!
    description: String!
    ipAddress: String!
    method: String!
    headers: [KeyValue!]!
    query: [KeyValue!]!
    contentType: String
    body: String
    read: Boolean!
    forwards: [Forward!]!
  }

  type WebhookConnection {
    nodes: [Webhook!]!
    pageInfo: PageInfo!
  }

  input ReadWebhookInput {
    id: ID!
  }

  type ReadWebhookPayload {
    webhook: Webhook!
  }

  input DeleteWebhookInput {
    id: ID!
  }

  type DeleteWebhookPayload {
    affectedRows: Int!
  }

  type CreateWebhookPayload {
    webhook: Webhook!
    endpoint: Endpoint!
  }

  type UpdateWebhookPayload {
    webhook: Webhook!
    endpoint: Endpoint!
  }
`;
