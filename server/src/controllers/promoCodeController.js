import PromoCode from '../models/PromoCode.js';
import { sendPromoEmail } from '../utils/emailService.js';
import PromoSubscriber from '../models/PromoSubscriber.js';
import PromoEvent from '../models/PromoEvent.js';
import User from '../models/User.js'; // Make sure you have a User model
import { createNotification } from './notificationController.js';

export const validatePromoCode = async (req, res) => {
  try {
    const { code, orderAmount, email } = req.body;

    // Find promo code and handle maxUses logic correctly
    const promoCode = await PromoCode.findOne({
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    });

    if (!promoCode) {
      return res.status(400).json({ message: 'Invalid or expired promo code' });
    }

    // Check maxUses logic in code
    if (promoCode.maxUses !== null && promoCode.usedCount >= promoCode.maxUses) {
      return res.status(400).json({ message: 'Promo code usage limit reached' });
    }

    if (orderAmount < promoCode.minOrderAmount) {
      return res.status(400).json({ 
        message: `Minimum order amount of ksh ${promoCode.minOrderAmount} required`
      });
    }

    // Send confirmation email if email is provided
    if (email) {
      try {
        await sendPromoEmail(
          email,
          promoCode.code,
          promoCode.discountType === 'percentage' 
            ? `${promoCode.discountAmount}%`
            : `ksh ${promoCode.discountAmount}`,
          promoCode.validUntil
        );
      } catch (emailError) {
        console.error('Error sending promo email:', emailError);
      }
    }

    res.json({ 
      message: 'Promo code applied successfully',
      promoCode: {
        code: promoCode.code,
        discountType: promoCode.discountType,
        discountAmount: promoCode.discountAmount
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error validating promo code' });
  }
};

export const subscribePromo = async (req, res) => {
  const { email, eventName } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  try {
    // Store the subscriber if not already present
    await PromoSubscriber.updateOne(
      { email },
      { $setOnInsert: { email } },
      { upsert: true }
    );

    // Find an active promo event (by name if provided, else pick any active event)
    let event;
    if (eventName) {
      event = await PromoEvent.findOne({ name: eventName, isActive: true });
    } else {
      event = await PromoEvent.findOne({ isActive: true });
    }
    if (!event) {
      return res.status(404).json({ message: 'No active promo event found' });
    }

    // Generate a random 6-character alphanumeric promo code
    const code = Array.from({ length: 6 }, () =>
      Math.random().toString(36).charAt(2 + Math.floor(Math.random() * 24)).toUpperCase()
    ).join('');
    const validFrom = new Date();
    const validUntil = new Date(Date.now() + (event.durationDays || 7) * 24 * 60 * 60 * 1000);

    // Store the promo code in the database
    await PromoCode.create({
      code,
      discountType: event.discountType,
      discountAmount: event.discountAmount,
      minOrderAmount: 0,
      maxUses: 1,
      usedCount: 0,
      validFrom,
      validUntil,
      isActive: true
    });

    // Send the promo code to the user
    await sendPromoEmail(
      email,
      code,
      event.discountType === 'percentage'
        ? `${event.discountAmount}%`
        : `ksh ${event.discountAmount}`,
      validUntil
    );
    res.json({
      message: `Subscribed successfully! Check your email for your promo code: ${code}`,
      campaign: event.description
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to subscribe for promo codes' });
  }
};

/**
 * Assign a promo code to a user based on a specific event/achievement.
 * Call this function from anywhere in your backend when a user qualifies for an event.
 * @param {Object} params - { email, eventName }
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const assignPromoForEvent = async ({ email, eventName }) => {
  if (!email || !eventName) {
    return { success: false, message: 'Email and event name are required' };
  }
  try {
    // Store the subscriber if not already present
    await PromoSubscriber.updateOne(
      { email },
      { $setOnInsert: { email } },
      { upsert: true }
    );

    // Find the matching active promo event
    const event = await PromoEvent.findOne({ name: eventName, isActive: true });
    if (!event) {
      return { success: false, message: 'No active promo event found for this achievement' };
    }

    // Generate a random 6-character alphanumeric promo code
    const code = Array.from({ length: 6 }, () =>
      Math.random().toString(36).charAt(2 + Math.floor(Math.random() * 24)).toUpperCase()
    ).join('');
    const validFrom = new Date();
    const validUntil = new Date(Date.now() + (event.durationDays || 7) * 24 * 60 * 60 * 1000);

    // Store the promo code in the database
    await PromoCode.create({
      code,
      discountType: event.discountType,
      discountAmount: event.discountAmount,
      minOrderAmount: 0,
      maxUses: 1,
      usedCount: 0,
      validFrom,
      validUntil,
      isActive: true
    });

    // Send the promo code to the user
    await sendPromoEmail(
      email,
      code,
      event.discountType === 'percentage'
        ? `${event.discountAmount}%`
        : `ksh ${event.discountAmount}`,
      validUntil
    );

    return { success: true, message: `Promo code ${code} sent for event: ${eventName}` };
  } catch (err) {
    return { success: false, message: 'Failed to assign promo code for event' };
  }
};

/**
 * Assign a "WELCOME" promo code only if the user has never received one before.
 * This should be called after a user's first order, even if they have not subscribed.
 * @param {string} email
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const assignWelcomePromoIfFirstTime = async (email) => {
  if (!email) {
    return { success: false, message: 'Email is required' };
  }
  try {
    // Check if this user has already received a welcome promo code
    const existingWelcomePromo = await PromoCode.findOne({
      discountType: 'percentage',
      discountAmount: 10,
      minOrderAmount: 0,
      maxUses: 1,
      isActive: true,
      // Optionally, you can add a label or eventName field to PromoCode for more robust filtering
      // eventName: 'WELCOME'
      // You may also want to check for codes sent to this email, if you store that info
    });

    if (existingWelcomePromo) {
      return { success: false, message: 'Welcome promo already assigned' };
    }

    // Find the active welcome promo event
    const event = await PromoEvent.findOne({ name: 'WELCOME', isActive: true });
    if (!event) {
      return { success: false, message: 'No active welcome promo event found' };
    }

    // Generate a random 6-character alphanumeric promo code
    const code = Array.from({ length: 6 }, () =>
      Math.random().toString(36).charAt(2 + Math.floor(Math.random() * 24)).toUpperCase()
    ).join('');
    const validFrom = new Date();
    const validUntil = new Date(Date.now() + (event.durationDays || 7) * 24 * 60 * 60 * 1000);

    // Store the promo code in the database
    await PromoCode.create({
      code,
      discountType: event.discountType,
      discountAmount: event.discountAmount,
      minOrderAmount: 0,
      maxUses: 1,
      usedCount: 0,
      validFrom,
      validUntil,
      isActive: true
    });

    // Send the promo code to the user
    await sendPromoEmail(
      email,
      code,
      event.discountType === 'percentage'
        ? `${event.discountAmount}%`
        : `ksh ${event.discountAmount}`,
      validUntil
    );

    return { success: true, message: `Welcome promo code ${code} sent` };
  } catch (err) {
    return { success: false, message: 'Failed to assign welcome promo code' };
  }
};

// CRUD for PromoEvent

// Create
export const createPromoEvent = async (req, res) => {
  try {
    const event = await PromoEvent.create(req.body);

    // Notify all users about the new promo event using the notification system
    const users = await User.find({ email: { $exists: true, $ne: '' } });
    const promoMessage = `New Promo: ${event.name} - ${event.description} (${event.discountType === 'percentage' ? event.discountAmount + '%' : 'Ksh ' + event.discountAmount} off)`;
    for (const user of users) {
      // Only send one notification per user, not both push and email
      // Remove one of the following lines to avoid duplicates:
      await createNotification(user._id, 'promo', promoMessage, 'push');
      // await createNotification(user._id, 'promo', promoMessage, 'email');
    }

    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to create promo event' });
  }
};

// Read all
export const getPromoEvents = async (req, res) => {
  try {
    const events = await PromoEvent.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch promo events' });
  }
};

// Read one
export const getPromoEvent = async (req, res) => {
  try {
    const event = await PromoEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Promo event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch promo event' });
  }
};

// Update
export const updatePromoEvent = async (req, res) => {
  try {
    const event = await PromoEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Promo event not found' });
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message || 'Failed to update promo event' });
  }
};

// Delete
export const deletePromoEvent = async (req, res) => {
  try {
    const event = await PromoEvent.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Promo event not found' });
    res.json({ message: 'Promo event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete promo event' });
  }
};
