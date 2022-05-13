"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var dotenv_1 = __importDefault(require("dotenv"));
var pg_1 = require("pg");
dotenv_1["default"].config();
var _a = process.env, POSTGRES_HOST = _a.POSTGRES_HOST, POSTGRES_DB = _a.POSTGRES_DB, POSTGRES_TEST_DB = _a.POSTGRES_TEST_DB, POSTGRES_USER = _a.POSTGRES_USER, POSTGRES_PASSWORD = _a.POSTGRES_PASSWORD, NODE_ENV = _a.NODE_ENV, DB_PORT = _a.DB_PORT;
console.log("my enviroment is ", NODE_ENV, typeof (NODE_ENV));
var database = (NODE_ENV === 'test') ? POSTGRES_TEST_DB : POSTGRES_DB;
var client = new pg_1.Pool({
    host: POSTGRES_HOST,
    database: database,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    port: DB_PORT
});
exports["default"] = client;
