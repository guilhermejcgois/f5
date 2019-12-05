import express from 'express';
import PAGE_TITLES from './config/page-titles';

const router = express.Router();

router.get('/', (req, res) => res.redirect('app/login'));
router.get('/login', (req, res) => res.render('login', { title: PAGE_TITLES.LOGIN }));
router.get('/cadastro', (req, res) => res.render('register', { title: PAGE_TITLES.REGISTER }));
router.get('/esqueci-minha-senha', (req, res) => res.render('forgot-password', { title: PAGE_TITLES.FORGOT_PASS }));

export default router;


