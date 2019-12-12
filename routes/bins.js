import escapeRegExp from 'escape-string-regexp';
import express from 'express';
import gmaps from '@google/maps';
import configAuth from '../config/auth';
import { Bins } from '../models/Bins';
import { Orders } from '../models/Orders';
import { Organization } from '../models/Organization';
import { Places } from '../models/Places';

const router = express.Router();

const layout = 'layouts/modal';
const modalId = 'bin-delete-modal';

router.get('/:id', configAuth.ensureAuthenticated, (req, res) => {
    res.render('modals/bin_delete', {
        layout,
        modalId,
        id: req.params.id
    });
});

router.delete('/:id', configAuth.ensureAuthenticated, (req, res) => {
    const { id } = req.params;

    const deleteCb = function () {
        res.render('modals/bin_delete_confirm', {
            layout,
            modalId
        });
    };

    Orders.findOneAndDelete({ bin: id })
        .then(function () { Bins.findByIdAndDelete(id) })
        .then(deleteCb);
});

router.get('/search/address', configAuth.ensureAuthenticated, (req, res) => {
    const query = req.query.q;
    if (process.env.USE_GOOGLE_PLACES_API) {
        const googleMapsClient = gmaps.createClient({
            key: process.env.GMAPS_API_KEY
        });
        googleMapsClient.places({
            query
        }, function (err, response) {
            if (err) {
                res.status(500);
                res.send(err);
                return;
            }
            res.send(response.json.results);
        });
    } else {
        const name = new RegExp(escapeRegExp(query));
        Places.find({ name }, (err, docs) => {
            res.send(docs);
        });
    }
});

router.post('/register', configAuth.ensureAuthenticated, (req, res) => {
    const { address, size } = req.body;
    if (!address) {
        res.status(402);
        res.send('Address field is required');
        return;
    }
    
    if (!size) {
        res.status(402);
        res.send('Size field is required');
        return;
    }

    let bin;
    let order;
    return Organization.findById(req.user.organization, function (err, org) {
        if (err) {
            res.render('login', err);

            return;
        }

        Places.findById(address, function (err, place) {
            if (err) {
                res.status(500);
                res.send(err);
                return;
            }
            if (!place) {
                res.status(404);
                res.send('Place not found');
                return;
            }
            bin = new Bins({
                place,
                size: size.toUpperCase()
            });
            org.bins.push(bin);
            return bin.save();
        })
        .then(function () {
            order = new Orders({
                bin,
                organization: org
            });
            return order.save();
        })
        .then(function () { org.save() })
        .then(function () {
            res.render('modals/request_register_confirm', {
                layout,
                data: {
                    orderId: order._id,
                    address: bin.place.address,
                    size: bin.size
                }
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500);
            res.send(err);
        });
    });
});

export default router;
