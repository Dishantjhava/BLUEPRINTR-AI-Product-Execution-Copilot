const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { checkOwnership } = require('../middleware/ownership.middleware');
const Blueprint = require('../models/Blueprint.model');
const {
  createBlueprint,
  getBlueprints,
  getBlueprint,
  updateBlueprint,
  deleteBlueprint
} = require('../controllers/blueprint.controller');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Collection routes (ownership enforced by controller scoping to req.user._id)
router.post('/', createBlueprint);
router.get('/', getBlueprints);

// Single-resource routes (ownership enforced by middleware)
router.get('/:id', checkOwnership(Blueprint), getBlueprint);
router.put('/:id', checkOwnership(Blueprint), updateBlueprint);
router.delete('/:id', checkOwnership(Blueprint), deleteBlueprint);

module.exports = router;
