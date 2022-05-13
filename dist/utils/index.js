"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.verifyAuthToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
var verifyAuthToken = function (req, res, next) {
    try {
        var authorizationHeader = req.headers.authorization;
        var token = authorizationHeader.split(' ')[1];
        var decoded = jsonwebtoken_1["default"].verify(token, process.env.TOKEN_SECRET);
        console.log("Decoded = ", decoded);
        //(<any>decoded).user
        req.body.user = decoded.user;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).send("invalid token with " + error.message);
    }
};
exports.verifyAuthToken = verifyAuthToken;
