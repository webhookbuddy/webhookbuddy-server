import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    webhook(id: ID!): Webhook
    webhooks(endpointId: ID!, after: Int): WebhookConnection!
  }

  extend type Mutation {
    readWebhook(input: ReadWebhookInput!): Webhook!
    deleteWebhook(input: DeleteWebhookInput!): Boolean!
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

  input DeleteWebhookInput {
    id: ID!
  }
`;
