import { makeExecutableSchema } from 'graphql-tools';

import resolvers from './resolvers';

const schema = `
type Movie {
  movieId: String!
  title: String
  year: Int
  plot: String
  poster: String
  imdbRating: Float
  genres: [String]
  similar: [Movie]
}

type Query {
  movies(subString: String!, limit: Int!): [Movie]
}

schema {
  query: Query
}
`;

let exeSchema =
    makeExecutableSchema({
        typeDefs: schema,
        resolvers,
    });

console.log(exeSchema);
export default exeSchema;

