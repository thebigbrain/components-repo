const graphqlHTTP = require('express-graphql');
const {buildSchema} = require('graphql');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  rollDice: function ({numDice, numSides}) {
    let output = [];
    for (let i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  }
};

module.exports = {
  default: graphqlHTTP({schema: schema, rootValue: root, graphiql: true})
};
