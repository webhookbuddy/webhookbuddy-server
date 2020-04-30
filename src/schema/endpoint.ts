import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    endpoint(id: ID!): Endpoint
    endpoints: [Endpoint!]!
  }

  extend type Mutation {
    createEndpoint(
      input: CreateEndpointInput!
    ): CreateEndpointPayload!
    deleteEndpoint(
      input: DeleteEndpointInput!
    ): DeleteEndpointPayload!
    addForwardUrl(input: AddForwardUrlInput!): AddForwardUrlPayload!
  }

  type Endpoint {
    id: ID!
    createdAt: DateTime!
    referenceId: String!
    name: String!
    forwardUrls: [ForwardUrl!]!
  }

  type ForwardUrl {
    id: ID!
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

  input AddForwardUrlInput {
    url: String!
  }

  type AddForwardUrlPayload {
    forwardUrl: ForwardUrl!
  }
`;
