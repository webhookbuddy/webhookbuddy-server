import { gql } from 'apollo-server-express';

export default gql`
  extend type Mutation {
    addForward(input: AddForwardInput): AddForwardPayload!
  }

  type Forward {
    id: ID!
    createdAt: DateTime!
    user: User!
    url: String!
    method: String!
    statusCode: Int!
    success: Boolean!
    headers: [KeyValue!]!
    query: [KeyValue!]!
    contentType: String
    body: String
  }

  input AddForwardInput {
    webhookId: ID!
    url: String!
    method: String!
    statusCode: Int!
    headers: [KeyValueInput!]!
    query: [KeyValueInput!]!
    body: String
  }

  type AddForwardPayload {
    forward: Forward!
    webhook: Webhook!
  }
`;
