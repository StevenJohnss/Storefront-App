"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var users_1 = __importDefault(require("./handlers/users"));
var orders_route_1 = __importDefault(require("./handlers/orders_route"));
var products_route_1 = __importDefault(require("./handlers/products_route"));
var app = (0, express_1["default"])();
var address = "localhost:3000";
var corsOptions = {
    origin: 'http://someotherdomain.com',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various
};
app.use((0, cors_1["default"])(corsOptions));
// app.use(articles)
app.use(body_parser_1["default"].json());
app.get('/', function (req, res) {
    res.send('Hello World!');
});
(0, users_1["default"])(app);
(0, orders_route_1["default"])(app);
(0, products_route_1["default"])(app);
app.listen(3000, function () {
    console.log("starting app on: ".concat(address));
});
exports["default"] = app;
