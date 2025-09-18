const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config(); // load env variables

module.exports = new Pool();
