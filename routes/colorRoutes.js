const express = require('express');
const routerColors = express.Router();
const colorController = require('../controllers/colorController');

// Endpoint to save or update a color
routerColors.post('/save-colors', colorController.saveColor);

// Endpoint to fetch all colors
routerColors.get('/get-colors', colorController.getColors);

module.exports = {routerColors};
