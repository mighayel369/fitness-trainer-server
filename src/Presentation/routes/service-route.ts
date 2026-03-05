import express from "express";
import { container } from "tsyringe";
import { ServiceController } from "Presentation/controllers/service-controller";
import { authorizeRoles } from "Presentation/middleware/authMiddleware";
import { UserRole } from "utils/Constants";
import { upload } from "Presentation/middleware/upload"; 

const router = express.Router();
const serviceController = container.resolve(ServiceController);


router.get('/list', serviceController.getPublicServicesList);


router.get('/:id', 
    authorizeRoles(UserRole.ADMIN, UserRole.TRAINER), 
    serviceController.getServiceDetails
);


router.post('/', 
    authorizeRoles(UserRole.ADMIN), 
    upload.single('servicePic'), 
    serviceController.createService
);

router.get('/admin/all', 
    authorizeRoles(UserRole.ADMIN), 
    serviceController.getAllServicesAdmin
);

router.put('/:id', 
    authorizeRoles(UserRole.ADMIN), 
    upload.single('servicePic'), 
    serviceController.updateServiceDetails
);

router.patch('/:id/status', 
    authorizeRoles(UserRole.ADMIN), 
    serviceController.toggleServiceStatus
);

router.delete('/:id', 
    authorizeRoles(UserRole.ADMIN), 
    serviceController.removeService
);

export default router;