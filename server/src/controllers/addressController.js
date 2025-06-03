import Address from '../models/Address.js';

export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.params.userId });
    res.json(addresses);
  } catch {
    res.status(500).json({ message: 'Error fetching addresses' });
  }
};

export const addAddress = async (req, res) => {
  try {
    const address = new Address({ ...req.body, user: req.params.userId });
    await address.save();
    res.status(201).json(address);
  } catch {
    res.status(500).json({ message: 'Error adding address' });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndUpdate(
      { _id: req.params.addressId, user: req.params.userId },
      req.body,
      { new: true }
    );
    res.json(address);
  } catch {
    res.status(500).json({ message: 'Error updating address' });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    await Address.findOneAndDelete({ _id: req.params.addressId, user: req.params.userId });
    res.json({ message: 'Address deleted' });
  } catch {
    res.status(500).json({ message: 'Error deleting address' });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    // Unset previous default
    await Address.updateMany({ user: req.params.userId }, { isDefault: false });
    // Set new default
    const address = await Address.findOneAndUpdate(
      { _id: req.params.addressId, user: req.params.userId },
      { isDefault: true },
      { new: true }
    );
    res.json(address);
  } catch {
    res.status(500).json({ message: 'Error setting default address' });
  }
};
