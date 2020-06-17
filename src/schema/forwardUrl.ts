import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    forwardUrls(endpointId: ID!): [ForwardUrl!]!
  }

  extend type Mutation {
    addForwardUrl(input: AddForwardUrlInput!): AddForwardUrlPayload!
  }

  type ForwardUrl {
    id: ID!
    createdAt: DateTime!
    endpointId: ID!
    url: String!
  }

  input AddForwardUrlInput {
    endpointId: ID!
    url: String!
  }

  type AddForwardUrlPayload {
    forwardUrl: ForwardUrl!
  }
`;
