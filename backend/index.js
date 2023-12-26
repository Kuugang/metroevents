const express = require('express') 
const dotenv = require('dotenv').config();
const cors = require('cors')
const app = express() 
const cookieParser = require('cookie-parser');
// const port = 6969
const bodyParser = require("body-parser")

// const connection = require("./config/dbConfig")
// const helmet = require("helmet")

// app.use(cors({
//   origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
//   credentials: true,
//   exposedHeaders: ['Authorization'],
// }));


// app.use(express.static('uploads'));
// app.use('/uploads', express.static('uploads'));

// app.use(cookieParser());
// app.use(helmet())
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json())

// app.use("/", require("./routes/mainRoutes"));

//   app.listen(port, () => {
//   console.log(`Server listening on port ${port}`)
// })