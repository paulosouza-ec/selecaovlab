import { Router } from 'express';
import { getMarathons, createMarathon, deleteMarathon } from '../controllers/marathonController';
import { protect } from '../middleware/authMiddleware';

const router = Router();
router.use(protect); // Protege todas as rotas abaixo

router.route('/').get(getMarathons).post(createMarathon);
router.route('/:id').delete(deleteMarathon);

export default router;