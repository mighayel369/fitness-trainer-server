import express from 'express';
import { TrainerController } from 'Presentation/controllers/trainer-controller';
import { container } from 'tsyringe';
import { authorizeRoles } from "Presentation/middleware/authMiddleware";
import { UserRole } from "utils/Constants";
import { upload } from 'Presentation/middleware/upload';

const router = express.Router();
const trainerController = container.resolve(TrainerController);


router.get('/explore', trainerController.getPublicTrainerList);
router.get('/explore/:id', trainerController.getPublicTrainerDetails);


router.get('/profile', 
    authorizeRoles(UserRole.TRAINER), 
    trainerController.getOwnProfile
);
router.put('/profile', 
    authorizeRoles(UserRole.TRAINER), 
    upload.none(),
    trainerController.updateOwnProfile
);
router.patch('/profile/avatar', 
    authorizeRoles(UserRole.TRAINER), 
    upload.single('profilePic'), 
    trainerController.updateOwnAvatar
);

router.get('/admin/list/verified', 
    authorizeRoles(UserRole.ADMIN), 
    trainerController.getVerifiedTrainers
);
router.get('/admin/list/pending', 
    authorizeRoles(UserRole.ADMIN), 
    trainerController.getPendingTrainers
);
router.get('/admin/details/:id', 
    authorizeRoles(UserRole.ADMIN), 
    trainerController.getTrainerDetailsAdmin
);
router.patch('/admin/status/:id', 
    authorizeRoles(UserRole.ADMIN), 
    trainerController.updateAccountStatus
);

router.patch('/verify-trainer-action/:id',
    authorizeRoles(UserRole.ADMIN),
    trainerController.handleTrainerApproval
)


export default router;