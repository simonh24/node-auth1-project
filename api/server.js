const express = require("express");
const bcryptjs = require("bcryptjs");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const usersRouter = require("../users/users-router.js");
const authRouter = require("../auth/auth-router.js");
const dbConnection = require("../database/connection.js");
const authenticate = require("../auth/authenticate-middleware.js");

const server = express();

const sessionConfiguration = {
    name: "monster", // default value is sid
    secret: "secret stuff",
    cookie: {
        maxAge: 1000 * 60 * 10,
        secure: false,
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: true,
    store: new KnexSessionStore({
        knex: dbConnection,
        tablename: "sessions",
        sidfieldname: "sid",
        createtable: true,
        clearInterval: 1000 * 60 * 30,
    }),
};

server.use(session(sessionConfiguration));
server.use(express.json());
server.use("/api/users", authenticate, usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
    res.json({ message: "server is up" });
});

module.exports = server;