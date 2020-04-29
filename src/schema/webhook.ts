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

  type Webhook {
    id: ID!
    createdAt: DateTime!
    ipAddress: String!
    method: String!
    headers: [KeyValue!]!
    query: [KeyValue!]!
    contentType: String
    body: String
    forwards: [Forward!]!
  }

  type KeyValue {
    key: String!
    value: String
  }

  type Forward {
    id: ID!
    createdAt: DateTime!
    url: String!
    method: String!
    statusCode: Int!
    headers: [KeyValue!]!
    query: [KeyValue!]!
    contentType: String
    body: String
  }

  type WebhookConnection {
    nodes: [Webhook!]!
    pageInfo: PageInfo!
  }

  input ReadWebhookInput {
    id: Int!
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
`;
