import express from 'express';
import { UserController } from 'Presentation/controllers/user-controller';
import { container } from 'tsyringe';
import { authorizeRoles } from "Presentation/middleware/authMiddleware";
import { UserRole } from "utils/Constants";
import { upload } from 'Presentation/middleware/upload';

const router = express.Router();
const userController = container.resolve(UserController);


router.get(
    '/admin/all', 
    authorizeRoles(UserRole.ADMIN), 
    userController.AdminFindAllUsers
);

router.get(
    '/admin/details/:id', 
    authorizeRoles(UserRole.ADMIN), 
    userController.FindUserDetailsForAdmin
);

router.patch(
    '/admin/update-status/:id', 
    authorizeRoles(UserRole.ADMIN), 
    userController.UpdateUserStatus
);





router.get(
    '/profile/full', 
    authorizeRoles(UserRole.USER), 
    userController.getFullUserData
);

router.put(
    '/profile/update', 
    authorizeRoles(UserRole.USER), 
    userController.updateUserData
);

router.patch(
    '/profile/image', 
    authorizeRoles(UserRole.USER), 
    upload.single('profilePic'), 
    userController.updateProfilePicture
);

export default router;