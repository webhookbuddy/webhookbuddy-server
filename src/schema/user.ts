import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    me: User
    user(id: ID!): User
  }

  extend type Mutation {
    register(input: RegisterInput): Token!
    login(input: LoginInput!): Token!
  }

  type User {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    firstName: String
    lastName: String
    email: String
  }

  input RegisterInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Token {
    token: String!
  }
`;
