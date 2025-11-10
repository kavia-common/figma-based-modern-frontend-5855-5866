const express = require('express');
const healthController = require('../controllers/health');
const authController = require('../controllers/auth');

const router = express.Router();
// Health endpoint

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Mock login
 *     description: |
 *       Stub endpoint that accepts email and password and always returns a mock token and user object.
 *       Intended for frontend integration during development.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successful mock login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: ZXhhbXBsZS10b2tlbg==
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 6a9a3a3e-7b55-46a8-8e41-2e3a98e3a5fa
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: user@example.com
 *                     name:
 *                       type: string
 *                       example: Mock User
 */
router.post('/auth/login', authController.login.bind(authController));

module.exports = router;
