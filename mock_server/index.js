const { ApolloServerPluginLandingPageGraphQLPlayground } = require('apollo-server-core');
const { ApolloServer } = require('apollo-server-express');
const express = require('express');

const { getSchema } = require('./schema');

const port = '5000'

const app = express();

Promise.all([getSchema()])
  .then(async ([schema ]) => {
    const server = new ApolloServer({
      context: ({ req }) => ({
        authorization: req.headers.authorization,
      }),
      schema: schema,
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });

    await server.start();
    server.applyMiddleware({ app, path: '/mock' });

    app.listen(port, () => {
      console.log(`🚀 Admin Server ready at http://localhost:${port}/mock`);
    });
  }).catch((err) => { console.error(err); });
