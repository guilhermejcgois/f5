import express from 'express';
import gmaps from '@google/maps';
import configAuth from '../config/auth';
import { Places } from '../models/Places';

const router = express.Router();

router.get('/address', configAuth.ensureAuthenticated, (req, res) => {
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
            }
            res.send(response.json.results);
        });
    } else {
        const name = new RegExp(query);
        Places.find({ name }, (err, docs) => {
            res.send(docs);
        });
    }
});

export default router;
