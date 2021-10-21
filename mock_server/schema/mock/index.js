const { gql } = require("apollo-server");
const faker = require('faker')

const typeDefs = gql(`
  type Comment {
    id: String!
    contents: String!
  }

  type CommentMutation {
    update(contents: String!): Comment!
  }

  type Mutation {
    comment(commentId: String!): CommentMutation
  }

  type Query {
    comments: [Comment!]!
  }
`)


const mocks = {
  Comment: {
    id: () => faker.datatype.uuid(),
    contents: () => faker.random.words(2),
  }
}

const resolvers = (store) => ({
  Query: {
    comments: () => Array.from({length: 3}, () => store.get('Comment'))
  },
  CommentMutation: {
    update: () => store.get('Comment')
  },
  Mutation: {
    comment: () => ({
      __typename: 'CommentMutation'
    })
  },
})

module.exports = {
  typeDefs,
  mocks,
  resolvers
}
