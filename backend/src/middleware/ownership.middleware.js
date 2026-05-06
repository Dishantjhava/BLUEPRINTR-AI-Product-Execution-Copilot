const mongoose = require('mongoose');

/**
 * Ownership middleware factory.
 * Returns middleware that loads a document by :id param from the given Model,
 * verifies that the authenticated user owns it, and attaches it to req.resource.
 *
 * Usage:
 *   router.get('/:id', protect, checkOwnership(Project), controller.getOne);
 *
 * @param {mongoose.Model} Model - The Mongoose model to look up
 * @returns {Function} Express middleware
 */
const checkOwnership = (Model) => {
  return async (req, res, next) => {
    try {
      const { id } = req.params;

      // Validate that the id is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid resource ID' });
      }

      const resource = await Model.findById(id);

      if (!resource) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      // Compare the resource's userId with the authenticated user's id
      if (resource.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Access denied — you do not own this resource' });
      }

      // Attach the already-loaded document so controllers don't re-query
      req.resource = resource;
      next();
    } catch (error) {
      console.error('Ownership Middleware Error:', error);
      res.status(500).json({ error: 'Server error during ownership check' });
    }
  };
};

module.exports = { checkOwnership };
