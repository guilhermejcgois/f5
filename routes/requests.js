import express from 'express';

import PAGE_TITLES from './config/page-titles';

import configAuth from '../config/auth';
import * as lang from '../i18n/lang.json';
import { Bins } from '../models/Bins';
import { Places } from '../models/Places';
import { Orders, orderStatuses } from '../models/Orders';
import { Organization } from '../models/Organization';

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
            title: PAGE_TITLES.REQUESTS,
            user: req.user,
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
        layout: 'layouts/modal',
        modalId: 'confirmed-delete-modal',
        user: req.user,
        title: PAGE_TITLES.REQUESTS
    });

    Orders.findByIdAndDelete(id).then(deleteCb);
});

router.get('/:id', configAuth.ensureAuthenticated, (req, res) => {
    const { id } = req.params;
    let status;
    let size;

    Orders.findById(id).then(function (order) {
        status = order.status
        return Bins.findById(order.bin);
    }).then(function (bin) {
        size = bin.size;
        return Places.findById(bin.place);
    }).then(function (place) {
        res.render('modals/request_info', {
            layout: 'layouts/modal',
            modalId: 'info-modal',
            user: req.user,
            title: PAGE_TITLES.REQUESTS,
            lang,
            orderStatuses,
            data: {
                address: place.address,
                id,
                size,
                status
            }
        });
    });
});

export default router;
