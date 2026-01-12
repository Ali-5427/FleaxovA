const express = require('express');
const {
    getServices,
    getService,
    createService,
    updateService,
    deleteService
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of services
 */
router.get('/', getServices);

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 minimum: 1
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Service created
 *       401:
 *         description: Not authorized
 */
router.get('/:id', getService);
router.post('/', protect, authorize('student', 'freelancer', 'admin'), createService);
router.put('/:id', protect, authorize('student', 'freelancer', 'admin'), updateService);
router.delete('/:id', protect, authorize('student', 'freelancer', 'admin'), deleteService);

module.exports = router;
