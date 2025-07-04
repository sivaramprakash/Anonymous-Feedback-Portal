import express from "express";
import {
  addBatch,
  deleteBatch,
  getAllBatches,
  getBatchByFaculty,
  getBatchById,
  updateBatch,
} from "../../controllers/admin/batch.controller.js";

const batchRouter = express.Router();

batchRouter.post("/addBatch", addBatch);
batchRouter.get("/getBatch/:id", getBatchById);
batchRouter.get("/getAllBatches", getAllBatches);
batchRouter.put("/updateBatch/:id", updateBatch);
batchRouter.delete("/deleteBatch/:id", deleteBatch);
batchRouter.get("/getBatchByFaculty/:id", getBatchByFaculty);

export default batchRouter;
