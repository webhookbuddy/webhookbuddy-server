import { gql } from 'apollo-server-express';

export default gql`
  type Read {
    createdAt: DateTime!
    reader: User!
  }
`;
