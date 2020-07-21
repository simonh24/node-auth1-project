const bcryptjs = require("bcryptjs");
const router = require("express").Router();

const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {
    let creds = req.body;
    const rounds = 4;

    const hash = bcryptjs.hashSync(creds.password, rounds);

    creds.password = hash;

    Users.add(creds)
        .then(saved => {
            res.status(201).json({ data: saved });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
            ``;
        });
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    Users.findBy({ username })
        .then(users => {
            const user = users[0];

            if (user && bcryptjs.compareSync(password, user.password)) {
                req.session.loggedIn = true;
                req.session.username = user.username;

                res.status(200).json({ message: "welcome!", session: req.session });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});

module.exports = router;
