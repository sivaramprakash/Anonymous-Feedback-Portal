import express from 'express';
import { adminLogin, adminLogout, adminRegister, getAdminProfile } from '../../controllers/admin/admin.auth.controller.js';

const adminAuthRouter = express.Router();

adminAuthRouter.post("/login",adminLogin);
adminAuthRouter.post("/register",adminRegister);
adminAuthRouter.post("/logout",adminLogout);
adminAuthRouter.get("/getAdmin",getAdminProfile);

export default adminAuthRouter;