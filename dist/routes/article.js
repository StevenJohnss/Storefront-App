"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var articles = express_1["default"].Router();
articles.get('/articles', function (_req, res) {
    try {
        res.send('this is the INDEX route');
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
});
articles.get('/articles/:id', function (_req, res) {
    try {
        res.send('this is the SHOW route');
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
});
articles.post('/articles', function (req, res) {
    var article = {
        title: req.body.title,
        content: req.body.content
    };
    try {
        res.send('this is the CREATE route');
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
});
articles.put('/articles/:id', function (req, res) {
    var article = {
        id: req.params.id,
        title: req.body.title,
        content: req.body.content
    };
    try {
        res.send('this is the EDIT route');
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
});
articles["delete"]('/articles/:id', function (_req, res) {
    try {
        res.send('this is the DELETE route');
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
});
exports["default"] = articles;
