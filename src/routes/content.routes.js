import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
    deleteContent,
    getFolderContent,
    getRootContent,
    submitContent,
    updateContent
} from "../controllers/content.controller.js";

const router = express.Router();

//GET Routes
router.get('/desktop', getRootContent);
router.get('/folder/:parentID', getFolderContent);

//POST Routes
router.post('/desktop', authMiddleware, submitContent);
router.post('/folder/:parentID', authMiddleware, submitContent);

//DELETE Routes
router.delete('/delete/:id', authMiddleware, deleteContent);

//PATCH Routes
router.patch('/update/:id', authMiddleware, updateContent);

export default router;