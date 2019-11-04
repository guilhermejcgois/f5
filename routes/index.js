import { Router } from 'express';
import configAuth from '../config/auth';

const router = Router();

router.get('/', (req, res) => res.redirect('login'));
router.get('/login', (req, res) => res.render('login'));
router.get('/cadastro', (req, res) => res.render('register'));
router.get('/esqueci-minha-senha', (req, res) => res.render('forgot-password'));

router.get('/dashboard', configAuth.ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    name: req.user.name
  }));


export default router;


