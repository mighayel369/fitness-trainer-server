import express from "express";
import { container } from "tsyringe";
import { ProgramsController } from "Presentation/controllers/programs-controller"; 
import { authorizeRoles } from "Presentation/middleware/authMiddleware";
import { UserRole } from "utils/Constants";
import { upload } from "Presentation/middleware/upload"; 

const router = express.Router();
const programsController = container.resolve(ProgramsController);


router.get('/explore', 
    programsController.discoverPublicPrograms
);


router.get('/details/:id', 
    authorizeRoles(UserRole.ADMIN, UserRole.TRAINER), 
    programsController.getProgramFullDetails
);


router.post('/onboard', 
    authorizeRoles(UserRole.ADMIN), 
    upload.single('programPic'), 
    programsController.onboardNewProgram
);

router.get('/inventory', 
    authorizeRoles(UserRole.ADMIN), 
    programsController.getAdminProgramInventory
);

router.patch('/modify/:id', 
    authorizeRoles(UserRole.ADMIN), 
    upload.single('programPic'), 
    programsController.modifyProgramSpecifications
);

router.patch('/visibility/:id', 
    authorizeRoles(UserRole.ADMIN), 
    programsController.toggleProgramVisibility
);

router.delete('/archive/:id', 
    authorizeRoles(UserRole.ADMIN), 
    programsController.archiveProgram
);

export default router;