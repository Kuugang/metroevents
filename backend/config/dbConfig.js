const mysql = require('mysql2');


const dbConfig = process.env.NODE_ENV === "production"
  ? {
      uri : process.env.DB_URI, 
    }
  : {
      user: "root",
      database: "metroevents",
      host: "localhost" 
    };

const connection = mysql.createConnection(dbConfig);


connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database', err);
  } else {
    console.log('Connected to database');
  }
});

module.exports = connection