import express from 'express'
import  {
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
} from '../controllers/NewsControllers.js'

const router = express.Router();

// Route to get all news items
router.get("/", getAllNews);

// Route to create a new news item with file upload
router.post("/",  createNews);

// Route to update a news item by ID with optional file upload
router.put("/:id", updateNews);

// Route to delete a news item by ID
router.delete("/:id", deleteNews);

export default router;