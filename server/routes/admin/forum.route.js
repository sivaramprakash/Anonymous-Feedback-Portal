import express from "express";
import {
  addForumPost,
  addMessageToForumPost,
  addReplyToMessage,
  approveForumPost,
  deleteForumPost,
  dislikeForumPost,
  getAllForumPosts,
  getForumPostById,
  getForumPostsByUser,
  getForumsByFaculty,
  likeForumPost,
} from "../../controllers/admin/forum.controller.js";

const forumRouter = express.Router();

forumRouter.get("/getAllForums", getAllForumPosts);
forumRouter.get("/getForumById/:id", getForumPostById);
forumRouter.post("/addForum", addForumPost);
forumRouter.delete("/deleteForum/:id", deleteForumPost);
forumRouter.delete("/deleteForumPost/:id", deleteForumPost);
forumRouter.get("/getForumPostsByStudent/:batch", getForumPostsByUser);
forumRouter.get("/getForumsByFaculty/:id", getForumsByFaculty);
forumRouter.post("/addMessage/:id", addMessageToForumPost);
forumRouter.patch("/likeMessage/:id", likeForumPost);
forumRouter.patch("/dislikeMessage/:id", dislikeForumPost);
forumRouter.post("/addReply/:id", addReplyToMessage);
forumRouter.patch("/approval/:id", approveForumPost);

export default forumRouter;
