import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import {
    deleteContent, getContentTree,
    getFolderContent,
    getRootContent,
    submitContent,
    updateContent,
    getContent, updateIcon, getContentIcon
} from "../controllers/content.controller.js";

const router = express.Router();


//GET Routes
router.get('/desktop', getRootContent);
router.get('/folder/:parentID', getFolderContent);
router.get('/tree', getContentTree);
router.get('/:id', getContent);
router.get('/:id/icon', getContentIcon);

//POST Routes
router.post('/desktop', authMiddleware, submitContent);
router.post('/folder/:parentID', authMiddleware, submitContent);

//DELETE Routes
router.delete('/delete/:id', authMiddleware, deleteContent);

//PATCH Routes
router.patch('/update/:id', authMiddleware, updateContent);
router.patch('/icon/update/:id', authMiddleware, updateIcon);

export default router;