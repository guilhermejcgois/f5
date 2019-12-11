import express from 'express';
const router = express.Router();
import { genSalt, hash as _hash } from 'bcryptjs';
import passport from 'passport';

import { Organization } from '../models/Organization';
import { User } from '../models/User';

// Register Handle
router.post('/register', (req, res, next) => {
    const { name, email, password, confirm_password, address, cnpj, accept } = req.body;
    let errors = [];

    // Check required fields
    if (!name || !email || !password || !confirm_password || !address || !cnpj) {
        errors.push({ msg: 'Preencha todos os campos por favor' });
    }

    // Check if passwords match
    if (password !== confirm_password) {
        errors.push({ msg: 'As senhas não conferem' });
    }

    // Check pass length
    if (password.length < 6) {
        errors.push({ msg: 'A senha precisa ter pelo menos 6 caracteres' });
    }

    if (!accept || accept != 'on') {
        errors.push({ msg: 'É obrigatório aceitar nossos termos' });
    }

    const renderError = () => {
        res.render('register', {
            errors,
            name,
            email,
            address,
            cnpj
        });
    };

    if (errors.length > 0) {
        renderError();
    } else {
        let organization;

        // Validation passed
        const hashCb = (user) => (err, hash) => {
            if (err) throw err;
            // Set password to hash
            user.password = hash;
            user.organization.save()
                .then(() => user.save())
                .then(() => {
                    passport.authenticate('local', {
                        successRedirect: '/app/dashboard',
                        failureRedirect: '/app/login',
                        failureFlash: true
                    })(req, res, next);
                })
                .catch(err => console.error(err));
        };
        const genSaltCb = (user) => (err, salt) =>
            _hash(user.password, salt, hashCb(user));
        const thenUser = user => {
            if (user) {
                // User exists
                errors.push({ msg: 'Email já cadastrado' });
                renderError();
            } else {
                user = new User({
                    email,
                    password,
                    organization: organization
                });

                // Hash Password
                genSalt(10, genSaltCb(user));
            }
        };
        const thenOrg = org => {
            if (org) {
                errors.push({ msg: 'Organização já cadastrada' });
                renderError();
            } else {
                organization = new Organization({
                    name,
                    address,
                    cnpj
                });

                User.findOne({ email }).then(thenUser);
            }
        };

        Organization.findOne({ name }).then(thenOrg);    
    }

});

// Local Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/app/dashboard',
        failureRedirect: '/app/login',
        failureFlash: true
    })(req, res, next);

});

router.get('/login', (req, res) => res.redirect('/app/login'));

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You have logged out');
    res.status(200);
    res.send('Logged out');
});

router.post('/organization', (req, res) => {
    const { name, address, cnpj, logo } = req.body;

    const updateOrgQuery = { $set: { } };
    if (name) {
        updateOrgQuery.$set.name = name;
    }
    if (address) {
        updateOrgQuery.$set.address = address;
    }
    if (cnpj) {
        updateOrgQuery.$set.cnpj = cnpj;
    }
    if (logo) {
        // updateOrgQuery.$set.logo = new Buffer(logo.split(",")[1], "base64");
        // updateOrgQuery.$set.logo = new Buffer(logo, 'binary').toString('base64');
    }

    Organization.findByIdAndUpdate(req.user.organization, updateOrgQuery, (err, org) => {
        if (err) {
            res.status(500);
            res.send({ err, org });

            return;
        }

        res.render('modals/profile_updated', {
            layout: 'layouts/modal',
            modalId: 'profile_updated'
        });
    });
});

export default router;
