import express from 'express';

import PAGE_TITLES from './config/page-titles';

import configAuth from '../config/auth';
import * as lang from '../i18n/lang.json';
import { Bins } from '../models/Bins';
import { Organization } from '../models/Organization';
import { Orders, orderStatuses } from '../models/Orders';
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

const allOrdersForOrgCb = successCb => (err, orders) => {
    if (err) {
        res.render('login', err);

        return;
    }

    successCb(orders);
};

const findsPlacesAndRender = cb => rawBins => {
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
        .then(cb);
};

const renderWithPage = (req, res, org) => {
    const page = req.params.page || 'dashboard';
    const title = PAGE_TITLES[page.toUpperCase()];

    const render = opts =>
        res.render('dashboard', {
            user: req.user,
            org,
            page,
            title,
            lang,
            ...opts
        });

    switch (page) {
        case 'dashboard':
            Orders.find({ organization: org._id }, allOrdersForOrgCb(orders => {
                const binsPromises = orders.map(order => Bins.findById(order.bin));
                Promise.all(binsPromises).then(findsPlacesAndRender(res => {
                    const bins = Object.values(res.bins || {});
                    let activeBins = [];
                    let emptyBins = 0;
                    let fullBins = 0;

                    bins.forEach(bin => {
                        if (bin.gathering_status != 'STATUS_INACTIVE') {
                            activeBins.push(bin);
                        }

                        switch (bin.gathering_status) {
                            case 'STATUS_ACTIVE':
                                emptyBins++;
                                break;
                            case 'STATUS_GATHERING':
                                fullBins++;
                                break;
                        }
                    });

                    render({
                        activeBins: activeBins.length,
                        gathering: {
                            emptyBins,
                            fullBins,
                            total: emptyBins + fullBins 
                        },
                        places: Object.values(
                            activeBins.map(bin => bin.place).reduce((acc, place) => ({
                                ...acc,
                                [`${place.latitude}:${place.longitude}`]: {
                                    lat: place.latitude,
                                    lng: place.longitude
                                }
                            }), {})
                        )
                    });
                }));
            }));
            break;
        case 'bins':
            Orders.find({ organization: org._id }, allOrdersForOrgCb(orders => {
                const binsPromises = orders.map(order => {
                    return Bins.findById(order.bin);
                });
                Promise.all(binsPromises).then(findsPlacesAndRender(res => {
                    render({
                        bins: Object.values(res.bins || {}),
                        canDelete: true
                    })
                }));
            }));
            break;
        case 'requests':
            Orders.find({ organization: org._id }, allOrdersForOrgCb(orders => {
                render({ orders, orderStatuses });
            }));
            break;
        default:
            render();
    }
};
const renderNewBin = (req, res, org) => {
    res.render('dashboard', {
        user: req.user,
        org,
        page: 'bin_request',
        title: PAGE_TITLES.BIN_REQUEST
    });
}
router.get('/', configAuth.ensureAuthenticated, dashCb(renderWithPage));
router.get('/data', configAuth.ensureAuthenticated, (req, res) =>  {
    Orders.find({ organization: req.user.organization }, allOrdersForOrgCb(orders => {
        const binsPromises = orders.map(order => Bins.findById(order.bin));
        Promise.all(binsPromises).then(findsPlacesAndRender(response => {
            const bins = Object.values(response.bins || {});
            let activeBins = [];
            let emptyBins = 0;
            let fullBins = 0;

            bins.forEach(bin => {
                if (bin.gathering_status != 'STATUS_INACTIVE') {
                    activeBins.push(bin);
                }

                switch (bin.gathering_status) {
                    case 'STATUS_ACTIVE':
                        emptyBins++;
                        break;
                    case 'STATUS_GATHERING':
                        fullBins++;
                        break;
                }
            });

            res.send({
                activeBins: activeBins.length,
                gathering: {
                    emptyBins,
                    fullBins,
                    total: emptyBins + fullBins
                },
                places: Object.values(
                    activeBins.map(bin => bin.place).reduce((acc, place) => ({
                        ...acc,
                        [`${place.latitude}:${place.longitude}`]: {
                            lat: place.latitude,
                            lng: place.longitude
                        }
                    }), {})
                )
            });
        }));
    }));
});
router.get('/:page', configAuth.ensureAuthenticated, dashCb(renderWithPage));
router.get('/bins/cadastrar', configAuth.ensureAuthenticated, dashCb(renderNewBin));

export default router;