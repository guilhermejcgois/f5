import express from 'express';

import configAuth from '../config/auth';
import * as lang from '../i18n/lang.json';
import { Bins } from '../models/Bins';
import { Organization } from '../models/Organization';
import { Orders } from '../models/Orders';
import { Places } from '../models/Places';

const router = express.Router();

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

    const render = opts =>
        res.render('dashboard', {
            user: req.user,
            org,
            page,
            lang,
            ...opts
        });

    switch (page) {
        case 'bins':
            const findsPlacesAndRender = rawBins => {
                const firstPromise = Promise.resolve({ bins: {}, places: {} });
                const placeIsCached = (state, placeId) => !!state.places[placeId];
                const reduceBins = async (previousPromise, rawBin) => {
                    const state = await previousPromise;
                    if (!rawBin.place) { return Promise.resolve(state); }

                    if (placeIsCached(state, rawBin.place)) {
                        state.bins[rawBin._id] = {
                            ...rawBin._doc,
                            place: state.places[rawBin.place]
                        };
                        return Promise.resolve(state);
                    }

                    return Places.findById(rawBin.place).then(place => {
                        if (!place) { return state; }

                        state.places[place._id] = place;
                        state.bins[rawBin._id] = {
                            ...rawBin._doc,
                            place
                        };

                        return state;
                    });
                };
                rawBins.filter(rb => !!rb)
                    .reduce(reduceBins, firstPromise)
                    .then(res => render({ bins: Object.values(res.bins || {}) }));
            };
            const allOrdersForOrgCb = (err, orders) => {
                if (err) {
                    res.render('login', err);

                    return;
                }
                const binsPromises = orders.map(order => Bins.findById(order.bin));
                Promise.all(binsPromises).then(findsPlacesAndRender);
            };
            Orders.find({ organization: org._id }, allOrdersForOrgCb);
            break;
        case 'requests':
            Orders.find({ organization: org._id }, (err, orders) => {
                if (err) {
                    res.render('login', err);

                    return;
                }
                const orderStatuses = [
                    'ORDER_OPENED',
                    'ORDER_CONFIRMED',
                    'ORDER_WAITING',
                    'ORDER_DISPATCHED',
                    'ORDER_FINISHED'
                ];

                render({ orders, orderStatuses });
            });
            break;
        default:
            render();
    }
};
const renderNewBin = (req, res, org) => {
    res.render('dashboard', {
        org,
        page: 'bin_request'
    });
}
router.get('/', configAuth.ensureAuthenticated, dashCb(renderWithPage));
router.get('/:page', configAuth.ensureAuthenticated, dashCb(renderWithPage));
router.get('/bins/cadastrar', configAuth.ensureAuthenticated, dashCb(renderNewBin));

export default router;