const Blueprint = require('../models/Blueprint.model');

// @desc    Create a new blueprint
// @route   POST /api/blueprints
// @access  Private
const createBlueprint = async (req, res) => {
  try {
    const { idea, solution, title, projectId, folder } = req.body;

    if (!idea || !solution) {
      return res.status(400).json({ error: 'Idea and solution are required' });
    }

    const blueprint = new Blueprint({
      userId: req.user._id,
      idea,
      solution,
      title: title || solution?.product_summary?.title || 'Untitled Blueprint',
      projectId: projectId || null,
      folder: folder || null
    });

    await blueprint.save();
    res.status(201).json({ success: true, blueprint });
  } catch (error) {
    console.error('Create Blueprint Error:', error);
    res.status(500).json({ error: 'Failed to create blueprint' });
  }
};

// @desc    Get all blueprints for the authenticated user
// @route   GET /api/blueprints
// @access  Private
const getBlueprints = async (req, res) => {
  try {
    const filter = { userId: req.user._id };

    // Optional filtering by folder
    if (req.query.folder) {
      filter.folder = req.query.folder;
    }

    const blueprints = await Blueprint.find(filter)
      .sort({ createdAt: -1 })
      .select('-solution'); // Exclude heavy solution payload for list view

    res.json({ success: true, blueprints });
  } catch (error) {
    console.error('Get Blueprints Error:', error);
    res.status(500).json({ error: 'Failed to fetch blueprints' });
  }
};

// @desc    Get a single blueprint by ID (ownership already verified by middleware)
// @route   GET /api/blueprints/:id
// @access  Private + Ownership
const getBlueprint = async (req, res) => {
  try {
    res.json({ success: true, blueprint: req.resource });
  } catch (error) {
    console.error('Get Blueprint Error:', error);
    res.status(500).json({ error: 'Failed to fetch blueprint' });
  }
};

// @desc    Update a blueprint (ownership already verified by middleware)
// @route   PUT /api/blueprints/:id
// @access  Private + Ownership
const updateBlueprint = async (req, res) => {
  try {
    const { title, folder, solution, projectId } = req.body;
    const blueprint = req.resource;

    if (title !== undefined) blueprint.title = title;
    if (folder !== undefined) blueprint.folder = folder;
    if (solution !== undefined) blueprint.solution = solution;
    if (projectId !== undefined) blueprint.projectId = projectId;

    await blueprint.save();
    res.json({ success: true, blueprint });
  } catch (error) {
    console.error('Update Blueprint Error:', error);
    res.status(500).json({ error: 'Failed to update blueprint' });
  }
};

// @desc    Delete a blueprint (ownership already verified by middleware)
// @route   DELETE /api/blueprints/:id
// @access  Private + Ownership
const deleteBlueprint = async (req, res) => {
  try {
    await req.resource.deleteOne();
    res.json({ success: true, message: 'Blueprint deleted successfully' });
  } catch (error) {
    console.error('Delete Blueprint Error:', error);
    res.status(500).json({ error: 'Failed to delete blueprint' });
  }
};

module.exports = { createBlueprint, getBlueprints, getBlueprint, updateBlueprint, deleteBlueprint };
