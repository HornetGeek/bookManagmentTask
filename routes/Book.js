import express from "express";

import {
  getAllBooks,
  addBook,
  editBookById,
  deleteBookByid,
  searchBook,
} from "../handlers/books/index.js";
import { rateLimitMiddleware } from "../middelware/ratelimit.js";

const router = express.Router();

router.get("/", rateLimitMiddleware, getAllBooks);

router.post("/", addBook);

router.put("/:id", editBookById);

router.delete("/:id", rateLimitMiddleware, deleteBookByid);

router.get("/search", searchBook);

export default router;
