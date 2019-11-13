import escapeRegExp from 'escape-string-regexp';
import express from 'express';
import gmaps from '@google/maps';
import configAuth from '../config/auth';
import { Bins } from '../models/Bins';
import { Orders } from '../models/Orders';
import { Organization } from '../models/Organization';
import { Places } from '../models/Places';

const router = express.Router();

router.get('/delete/:id', configAuth.ensureAuthenticated, (req, res) => {
    const { id } = req.params;

    Organization.findById(req.user.organization, (err, org) => {
        if (err) {
            res.render('login', err);

            return;
        }

        res.render('dashboard', {
            modalId: 'confirm-delete-modal',
            org,
            page: 'requests',
            op: 'DELETE',
            data: {
                id
            }
        });
    });
});

router.delete('/:id', configAuth.ensureAuthenticated, (req, res) => {
    const { id } = req.params;

    const deleteCb = () => res.render('modals/request_delete_confirm', {
        layout: 'modals/layout'
    });

    Orders.findByIdAndDelete(id).then(deleteCb);
});

export default router;
