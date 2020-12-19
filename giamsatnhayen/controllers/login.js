const DB = require('./db');
const CONSTANTS = require('../constants');



const conn = DB.connect(
    CONSTANTS.HOST,
    CONSTANTS.USER_NAME,
    CONSTANTS.PASSWORD,
    CONSTANTS.DATABASE_NAME);
conn.query('CREATE DATABASE TEST', (err, result) => {
    if (err) throw err;
    console.log(result);
})