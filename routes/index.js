import express from 'express';
import configAuth from '../config/auth';
import { Organization } from '../models/Organization';

const router = express.Router();

router.get('/', (req, res) => res.redirect('login'));
router.get('/login', (req, res) => res.render('login'));
router.get('/cadastro', (req, res) => res.render('register'));
router.get('/esqueci-minha-senha', (req, res) => res.render('forgot-password'));

router.get('/dashboard', configAuth.ensureAuthenticated, (req, res) => {
  Organization.findById(req.user.organization, (err, org) => {
    if (err) {
      res.render('login', err);

      return;
    }

    res.render('dashboard', {
      org
    });
  });
});


export default router;


