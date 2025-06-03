import express from 'express';
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/addressController.js';

const router = express.Router();

router.get('/:userId', getAddresses);
router.post('/:userId', addAddress);
router.put('/:userId/:addressId', updateAddress);
router.delete('/:userId/:addressId', deleteAddress);
router.put('/:userId/:addressId/default', setDefaultAddress);

export default router;
