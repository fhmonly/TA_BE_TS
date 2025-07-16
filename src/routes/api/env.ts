import express from 'express'
import { matchedData } from 'express-validator';
import { updateBackendUrl } from '../../repository/envRepository';
var router = express.Router();

router.get('/python_url/:value', async (req, res) => {
    const {
        value
    } = matchedData(req)
    await updateBackendUrl(value)
    res.json({
        success: true,
        python_url: value
    })
});

export default router