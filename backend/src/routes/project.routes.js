const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { checkOwnership } = require('../middleware/ownership.middleware');
const Project = require('../models/Project.model');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject
} = require('../controllers/project.controller');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Collection routes (ownership enforced by controller scoping to req.user._id)
router.post('/', createProject);
router.get('/', getProjects);

// Single-resource routes (ownership enforced by middleware)
router.get('/:id', checkOwnership(Project), getProject);
router.put('/:id', checkOwnership(Project), updateProject);
router.delete('/:id', checkOwnership(Project), deleteProject);

module.exports = router;
