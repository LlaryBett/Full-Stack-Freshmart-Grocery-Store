import Promo from '../models/Promo.js';

// Get all promos
export const getPromos = async (req, res) => {
  try {
    const promos = await Promo.find();
    res.json(promos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching promos' });
  }
};

// Create a promo
export const createPromo = async (req, res) => {
  try {
    const promo = new Promo(req.body);
    await promo.save();
    res.status(201).json(promo);
  } catch (error) {
    res.status(400).json({ message: 'Error creating promo' });
  }
};

// Update a promo
export const updatePromo = async (req, res) => {
  try {
    const promo = await Promo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!promo) return res.status(404).json({ message: 'Promo not found' });
    res.json(promo);
  } catch (error) {
    res.status(400).json({ message: 'Error updating promo' });
  }
};

// Delete a promo
export const deletePromo = async (req, res) => {
  try {
    const promo = await Promo.findByIdAndDelete(req.params.id);
    if (!promo) return res.status(404).json({ message: 'Promo not found' });
    res.json({ message: 'Promo deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting promo' });
  }
};
