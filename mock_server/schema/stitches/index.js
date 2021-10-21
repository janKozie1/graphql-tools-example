const { gql } = require("apollo-server");

const typeDefs = gql(`
  extend type Book {
    comments: [Comment!]!
  }

  extend type BookMutation {
    comment(contents: String!): Comment!
  }
`)

const resolvers = (store) => ({
  Book: {
    comments: () => {
      console.log("querying comments")

      return Array.from({length: 3}, () => store.get('Comment'))
    }
  },
  BookMutation: {
    comment: () => {
      console.log("commenting")

      return store.get('Comment')
    }
  }
})

module.exports = {
  typeDefs,
  resolvers
}
