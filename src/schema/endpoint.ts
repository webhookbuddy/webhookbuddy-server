import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    endpoint(id: ID!): Endpoint
    endpoints: [Endpoint!]!
  }

  extend type Mutation {
    createEndpoint(input: CreateEndpointInput): CreateEndpointPayload!
    deleteEndpoint(input: DeleteEndpointInput): DeleteEndpointPayload!
  }

  type Endpoint {
    id: ID!
    createdAt: DateTime!
    referenceId: String!
    name: String!
    forwardUrls: [ForwardUrl!]!
  }

  type ForwardUrl {
    url: String!
  }

  input CreateEndpointInput {
    name: String!
  }

  type CreateEndpointPayload {
    endpoint: Endpoint!
  }

  input DeleteEndpointInput {
    id: ID!
  }

  type DeleteEndpointPayload {
    affectedRows: Int!
  }
`;
