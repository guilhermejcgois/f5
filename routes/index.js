import express from 'express';
import configAuth from '../config/auth';
import { Organization } from '../models/Organization';

const router = express.Router();

router.get('/', (req, res) => res.redirect('login'));
router.get('/login', (req, res) => res.render('login'));
router.get('/cadastro', (req, res) => res.render('register'));
router.get('/esqueci-minha-senha', (req, res) => res.render('forgot-password'));

const dashCb = (req, res) => {
  Organization.findById(req.user.organization, (err, org) => {
    if (err) {
      res.render('login', err);

      return;
    }

    const page = req.param('page') || 'dashboard';
    res.render('dashboard', {
      org,
      page
    });
  });
};
router.get('/dashboard', configAuth.ensureAuthenticated, dashCb);
router.get('/dashboard/:page', configAuth.ensureAuthenticated, dashCb);


export default router;


