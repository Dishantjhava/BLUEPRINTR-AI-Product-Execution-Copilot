const Project = require('../models/Project.model');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { name, description, blueprintId } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const project = new Project({
      userId: req.user._id,
      name,
      description: description || '',
      blueprintId: blueprintId || null
    });

    await project.save();
    res.status(201).json({ success: true, project });
  } catch (error) {
    console.error('Create Project Error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

// @desc    Get all projects for the authenticated user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('blueprintId', 'title idea');

    res.json({ success: true, projects });
  } catch (error) {
    console.error('Get Projects Error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// @desc    Get a single project by ID (ownership already verified by middleware)
// @route   GET /api/projects/:id
// @access  Private + Ownership
const getProject = async (req, res) => {
  try {
    // req.resource is set by the checkOwnership middleware
    const project = await req.resource.populate('blueprintId');
    res.json({ success: true, project });
  } catch (error) {
    console.error('Get Project Error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

// @desc    Update a project (ownership already verified by middleware)
// @route   PUT /api/projects/:id
// @access  Private + Ownership
const updateProject = async (req, res) => {
  try {
    const { name, description, status, blueprintId } = req.body;
    const project = req.resource;

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (status !== undefined) project.status = status;
    if (blueprintId !== undefined) project.blueprintId = blueprintId;

    await project.save();
    res.json({ success: true, project });
  } catch (error) {
    console.error('Update Project Error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

// @desc    Delete a project (ownership already verified by middleware)
// @route   DELETE /api/projects/:id
// @access  Private + Ownership
const deleteProject = async (req, res) => {
  try {
    await req.resource.deleteOne();
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete Project Error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

module.exports = { createProject, getProjects, getProject, updateProject, deleteProject };
