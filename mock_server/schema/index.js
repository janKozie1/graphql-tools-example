const { print } = require('graphql');
const { introspectSchema } = require('@graphql-tools/wrap');
const { stitchSchemas } = require('@graphql-tools/stitch');
const { fetch } = require('cross-fetch');

const { typeDefs: mockTypeDefs, resolvers: mockResolvers, mocks } = require('./mock');
const { typeDefs: stitchTypeDefs, resolvers: stitchResolvers } = require('./stitches');
const { createMockStore, addMocksToSchema } = require('@graphql-tools/mock');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const getSchema = async () => {
  const executor = async (...args) => {
    const [{ document, variables }] = args;
    const query = print(document);

    const fetchResult = await fetch('http://localhost:4000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    const result = await fetchResult.json();

    return result;
  };


  const remoteSchema = {
    schema: await introspectSchema(executor),
    executor,
  };

  const mockSchemaBase = makeExecutableSchema({
    typeDefs: mockTypeDefs,
  })

  const mockStore = createMockStore({
    schema: mockSchemaBase,
    mocks,
  })

  const mockSchema = addMocksToSchema({
    schema: mockSchemaBase,
    store: mockStore,
    resolvers: mockResolvers,
  })

  return stitchSchemas({
    subschemas: [
      remoteSchema,
      {
        schema: mockSchema
      }
    ],
    typeDefs: stitchTypeDefs,
    resolvers: stitchResolvers(mockStore)
  })
}

module.exports = {
  getSchema
}
