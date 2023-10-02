import { Router } from "express";
import { body , param } from "express-validator";
import userController from "../controllers/UserController";
import authHandler from "../middlewares/AuthHandler";

const router = Router();

/**
 * @swagger
 * /api/registration:
 *   post:
 *     description: User registration
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Registration successful
 */
router.post(
    "/registration" ,
    body( "email" ).isEmail() ,
    body( "password" ).isLength( { min : 3 , max : 32 } ) ,
    userController.registration
);

/**
 * @swagger
 * /api/login:
 *   post:
 *     description: User login
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Login successful
 */
router.post( "/login" , userController.login );

/**
 * @swagger
 * /api/logout:
 *   post:
 *     description: User logout
 *     responses:
 *       '200':
 *         description: Logout successful
 *     security:
 *       - BearerAuth: []
 */
router.post( "/logout" , authHandler , userController.logout );

/**
 * @swagger
 * /api/activate/{link}:
 *   get:
 *     description: Activate user account
 *     parameters:
 *       - in: path
 *         name: link
 *         schema:
 *           type: string
 *         required: true
 *         description: Activation link
 *     responses:
 *       '200':
 *         description: Account activation successful
 */
router.get( "/activate/:link" , userController.activate );

/**
 * @swagger
 * /api/refresh:
 *   get:
 *     description: Refresh user tokens
 *     responses:
 *       '200':
 *         description: Token refresh successful
 *     security:
 *       - BearerAuth: []
 */
router.get( "/refresh" , userController.refresh );

/**
 * @swagger
 * /api/users:
 *   get:
 *     description: Get all users
 *     responses:
 *       '200':
 *         description: OK
 *     security:
 *       - BearerAuth: []
 */
router.get( "/users" , authHandler , userController.getUsers );

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     description: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       '200':
 *         description: OK
 *     security:
 *       - BearerAuth: []
 */
router.get( "/users/:userId" , authHandler , userController.getUserById );

/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     description: Update a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User updated successfully
 *     security:
 *       - BearerAuth: []
 */
router.put(
    "/users/:userId" ,
    authHandler ,
    param( "userId" ).isMongoId() ,
    body( "email" ).isEmail() ,
    body( "password" ).isLength( { min : 3 , max : 32 } ) ,
    userController.updateUser
);

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     description: Delete a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *     security:
 *       - BearerAuth: []
 */
router.delete( "/users/:userId" , authHandler , userController.deleteUser );

export default router;