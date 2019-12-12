import express from 'express';
import { ContactUs } from '../models/ContactUs';

const router = express.Router();

router.post('/', (req, res) => {
    new ContactUs(req.body).save().then(() => {
        res.redirect('/contato');
    });
});

export default router;