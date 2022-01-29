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
                const userCreated = new User({
                    username: username,
                    password: hashPassword
                });
                userCreated.save()
                    .then((userFromDb) => {
                        req.session.currentUser = userFromDb.username;
                        console.log(req.session.currentUser);
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

router.post('/login', (req, res, next) => {
    const {username, password} = req.body

    User.findOne({username})
        .then(user => {
            if (!user) {
                res.status(403).json({message: 'User does not exist'})
                return next(new Error('No user with that username'))
            }
            
            if (bcryptjs.compareSync(password, user.password) !== true) {
                res.status(401).json({message: 'Wrong password'})
                return next(new Error('Wrong credentials'))
            } else {
                req.session.currentUser = user.username
                res.status(200).json(user)
            }
        })
        .catch(next)
});

router.post('/edit', (req, res, next) => {
    if (req.session.currentUser) {
        const {username, campus, course} = req.body;

        User.findOneAndUpdate({username}, {username, campus, course}, {new:true})
            .then((userFromDb) => {
                res.status(200).json(userFromDb)
                return;
            })
            .catch(error => {
                res.status(400).json({message: `Error editing user, error: ${error}`})
            })
    } else {
        res.status(403).json({message: 'You have to be logged in to edit'});
        return;
    }
})

router.post('/logout', (req, res, next) => {
    req.session.destroy()
    res.status(200).json({message: 'Your are now logged out.'})
});
   
router.get('/loggedin', (req, res, next) => {
    if (req.session.currentUser) {
        res.status(200).json(req.session.currentUser);
        return;
    }
    res.status(403).json({ message: 'Unauthorized' });
    return;
});


module.exports = router;