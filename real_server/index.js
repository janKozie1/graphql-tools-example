const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.

const books = [
  {
    id: '1',
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    id: '2',
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

const typeDefs = gql`
  type Book {
    id: String
    title: String!
    author: String!
  }

  type Query {
    books: [Book]
  }

  type BookMutation {
    delete: Book
    update(title: String, author: String): Book!
  }

  type Mutation {
    book(bookId: String!): BookMutation!
  }
`;

const resolvers = {
  Query: {
    books: () => books,
  },
  BookMutation: {
    update: (_, {title, author}, ___, info) => {
      const bookToUpdate = books.find((book) => book.id === info.variableValues.bookId);

      if (bookToUpdate) {
        bookToUpdate.author = author ?? bookToUpdate.author;
        bookToUpdate.title = title ?? bookToUpdate.title;
      };

      return bookToUpdate ?? null
    },
    delete: (_, __, ___, info) => {
      const bookToRemove = books.find((book) => book.id === info.variableValues.bookId);

      if (bookToRemove) {
        books.splice(books.indexOf(bookToRemove))
      }

      return bookToRemove ?? null;
    },
  },
  Mutation: {
    book: () => ({
      __typename: 'BookMutation'
    })
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
