const router = require('express').Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');

const saltRounds = 10;
const salt = bcryptjs.genSaltSync(saltRounds);

router.get('/auth/signup', (req, res, next) => {
    res.status(200).json({message: 'Signup page'})
})

router.post('/signup', (req, res, next) => {
    const {username, password} = req.body

    if (!username || !password) {
        res.status(400).json({message: 'Provide username and password'});
        return;
    }

    User.findOne({ username })
        .then(foundUser => {
            if (foundUser) {
                res.status(403).json({message: 'User already exists'});
            } else {
                const hashPassword = bcryptjs.hashSync(password, salt);
                User.create(username, hashPassword)
                    .then(userFromDb => {
                        res.status(201).json({message: 'User correctly created'})
                    })
                    .catch(error => {
                        res.status(400).json({message: `Saving user to database went wrong, error: ${error}`})
                    })
            }
        })  
        .catch(error => {
            res.status(400).json({message: `Error validating user, error: ${error}`})
        })
})

module.exports = router;