const pg = require("pg");

const { Pool } = pg;

let poolSettings;
process.env.NODE_ENV === "development"
  ? (poolSettings = {
      user: "postgres",
      host: "localhost", // Replace with your PostgreSQL server's host
      database: "metroevents",
      password: "root",
      port: 5432, // Replace with your PostgreSQL server's port if it's different
      // ssl: { rejectUnauthorized: false },
    })
  : (poolSettings = {
      connectionString: process.env.POSTGRES_URL + "?sslmode=require",
    });

const pool = new Pool(poolSettings);

async function queryDatabase(query, values = []) {
  return new Promise((resolve, reject) => {
    pool.query(query, values, function (error, results) {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

async function createUsersTable() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        firstname VARCHAR,
        lastname VARCHAR,
        username VARCHAR UNIQUE,
        password VARCHAR,
        privilege VARCHAR(20) CHECK (privilege IN ('user', 'organizer', 'admin')),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await queryDatabase(createTableQuery);
  } catch (error) {
    console.error("Error creating users table:", error);
  }
}

async function createBlackListTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS blacklist(
        id SERIAL PRIMARY KEY,
        token VARCHAR
      ) 
    `;
    await queryDatabase(query);
  } catch (error) {
    console.error("Error creating blacklist table:", error);
  }
}

async function createRequestsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS requests(
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type INTEGER,
        message VARCHAR,
        UNIQUE (user_id, type)
      )
    `;
    await queryDatabase(query);
  } catch (error) {
    console.error("Error creating requests table:", error);
  }
}

async function createEventTypesTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS event_types(
        id SERIAL PRIMARY KEY,
        event_name VARCHAR,
        CONSTRAINT unique_event_name UNIQUE (event_name)
      )
    `;
    await queryDatabase(query);
  } catch (error) {
    console.error("Error creating event_types table:", error);
  }
}

async function createEventsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS events(
        id SERIAL PRIMARY KEY,
        organizer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR,
        description VARCHAR,
        venue VARCHAR,
        image VARCHAR,
        type VARCHAR references event_types(event_name) ON DELETE CASCADE ON UPDATE CASCADE,
        event_type_id INTEGER REFERENCES event_types(id) ON DELETE CASCADE,
        datetime TIMESTAMP,
        is_cancelled BOOLEAN,
        cancellation_reason VARCHAR,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await queryDatabase(query);
  } catch (error) {
    console.error("Error creating events table:", error);
  }
}

async function createEventParticipantsTable() {
  try {
    let query = `
    DO $$ BEGIN
      CREATE TYPE participant_status AS ENUM ('pending', 'accepted', 'rejected');
    EXCEPTION
      WHEN duplicate_object THEN null; 
    END $$; 
      `;
    await queryDatabase(query);
  } catch (error) {
    console.error("Error creating participant_status TYPE", error);
  }

  try {
    query = `
      CREATE TABLE IF NOT EXISTS event_participants(
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        status participant_status DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_event_user_combination UNIQUE (event_id, user_id)
      )
    `;
    await queryDatabase(query);
  } catch (error) {
    console.error("Error creating event_types table:", error);
  }
}

async function createVotesTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS votes(
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        vote BOOLEAN
      )
    `;
    await queryDatabase(query);
  } catch (error) {
    console.error("Error creating event_types table:", error);
  }
}

async function createReviewsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS reviews(
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        review VARCHAR,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await queryDatabase(query);
  } catch (error) {
    console.error("Error creating reviews table:", error);
  }
}

async function createNotificationTypesTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS notification_types(
        id SERIAL PRIMARY KEY,
        type VARCHAR UNIQUE
      )
    `;
    await queryDatabase(query);
  } catch (error) {
    console.error("Error creating reviews table:", error);
  }
}

async function createNotificationsTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS notifications(
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        notification VARCHAR,
        type INTEGER REFERENCES notification_types(id) ON DELETE CASCADE,
        read BOOLEAN DEFAULT false,
        CONSTRAINT unique_notif_type_for_user UNIQUE (user_id, type)
      )
    `;
    await queryDatabase(query);
  } catch (error) {
    console.error("Error creating reviews table:", error);
  }
}

async function initializeDB() {
  return new Promise((resolve, reject) => {
    pool.connect(async (err) => {
      if (err) {
        console.error("Error connecting to database", err);
        reject(err);
      } else {
        try {
          await createUsersTable();
          await createEventTypesTable();
          await createEventsTable();
          await createBlackListTable();
          await createRequestsTable();
          await createEventParticipantsTable();
          await createVotesTable();
          await createReviewsTable();
          await createNotificationTypesTable();
          await createNotificationsTable();
          console.log("Connected to database");
          resolve("Database initialized successfully");
        } catch (error) {
          console.error("Error creating tables", error);
          reject(error);
        }
      }
    });
  });
}

module.exports = {
  pool,
  initializeDB,
  queryDatabase,
};
