import { Router } from 'express';
const router = Router();
import { genSalt, hash as _hash } from 'bcryptjs';
import { authenticate } from 'passport';

// Bin model
import { Bin } from '../models/Bins';

// User model
import User, { findOne } from '../models/User';

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2, latitude, longitude } = req.body;
    let errors = [];

    // Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check if passwords match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // Check pass length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // Validation passed
        findOne({ email: email })
            .then(user => {
                if (user) {
                    // User exists
                    errors.push({ msg: 'Email is already taken' });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newBin = new Bin({
                        coords: {
                            latitude,
                            longitude
                        }
                    });
                    const newUser = new User({
                        name,
                        email,
                        password,
                        bins: [
                            newBin
                        ]
                    });

                    // Hash Password
                    genSalt(10, (err, salt) =>
                        _hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            // Set password to hash
                            newUser.password = hash;
                            // Save user
                            newBin.save()
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in :D');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        }))
                }
            });
    }

});

// Local Handle
router.post('/login', (req, res, next) => {
    authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);

});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You have logged out');
    res.redirect('/login');
});

export default router;
