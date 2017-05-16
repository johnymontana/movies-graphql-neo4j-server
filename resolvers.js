let neo4j = require('neo4j-driver').v1;
let driver = neo4j.driver("bolt://54.236.8.156:33471", neo4j.auth.basic("neo4j", "carburetor-requirement-kick"));

const resolveFunctions = {
  Query: {
    movies(_, params) {
      let session = driver.session();
      let query = "MATCH (movie:Movie) WHERE movie.title CONTAINS $subString RETURN movie LIMIT $limit;"
      return session.run(query, params)
        .then( result => { return result.records.map(record => { return record.get("movie").properties })})
    },
  },
  Movie: {
    similar(movie) {
      let session = driver.session(),
          params = {movieId: movie.movieId},
          query = `
            MATCH (m:Movie) WHERE m.movieId = $movieId
            MATCH (m)-[:IN_GENRE]->(g:Genre)<-[:IN_GENRE]-(movie:Movie)
            WITH movie, COUNT(*) AS score
            RETURN movie ORDER BY score DESC LIMIT 3
          `
      return session.run(query, params)
        .then( result => { return result.records.map(record => { return record.get("movie").properties })})
    },
    genres(movie) {
      let session = driver.session(),
          params = {movieId: movie.movieId},
          query = `
            MATCH (m:Movie)-[:IN_GENRE]->(g:Genre)
            WHERE m.movieId = $movieId
            RETURN g.name AS genre;
          `
      return session.run(query, params)
        .then( result => { return result.records.map(record => { return record.get("genre") })})
    }
  },
};

export default resolveFunctions;
