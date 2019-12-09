import express from 'express';
import configAuth from '../config/auth';
import { Organization } from '../models/Organization';

const router = express.Router();

router.post('/credit-card', configAuth.ensureAuthenticated, (req, res) => {
    const payment_info = req.body;
    if (!payment_info.name) {
        res.status(402);
        res.send('Name field is required');
        return;
    }

    if (!payment_info.number) {
        res.status(402);
        res.send('Credit card number field is required');
        return;
    }

    if (!payment_info.validity) {
        res.status(402);
        res.send('Validity date field is required');
        return;
    }

    if (!payment_info.cvv) {
        res.status(402);
        res.send('CVV number field is required');
        return;
    }

    const updateQuery = { $set: { payment_info, payed: true } };

    return Organization.findByIdAndUpdate(req.user.organization, updateQuery, (err, org) => {
        if (err) {
            res.status(500);
            res.send({err,org});

            return;
        }

        res.render('modals/payment_confirm', {
            layout: 'layouts/modal',
            modalId: 'payment_confirm'
        });
    });
});

export default router;


