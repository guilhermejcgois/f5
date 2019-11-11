import express from 'express';
import configAuth from '../config/auth';
import { Organization } from '../models/Organization';

const router = express.Router();

router.get('/', (req, res) => res.redirect('login'));
router.get('/login', (req, res) => res.render('login'));
router.get('/cadastro', (req, res) => res.render('register'));
router.get('/esqueci-minha-senha', (req, res) => res.render('forgot-password'));

const dashCb = (renderFn) => (req, res) => {
  Organization.findById(req.user.organization, (err, org) => {
    if (err) {
      res.render('login', err);

      return;
    }

    renderFn(req, res, org);    
  });
};
const renderWithPage = (req, res, org) => {
  const page = req.params.page || 'dashboard';
  res.render('dashboard', {
    org,
    page
  });
};
const renderNewBin = (req, res, org) => {
  res.render('dashboard', {
    org,
    page: 'bin_request'
  });
}
router.get('/dashboard', configAuth.ensureAuthenticated, dashCb(renderWithPage));
router.get('/dashboard/:page', configAuth.ensureAuthenticated, dashCb(renderWithPage));
router.get('/dashboard/bins/cadastrar', configAuth.ensureAuthenticated, dashCb(renderNewBin));


export default router;


