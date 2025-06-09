import axios from 'axios';

const BREVO_API_URL = 'https://api.sendinblue.com/v3/smtp/email';

export const sendDeliveryEmail = async (userEmail, orderNumber, deliveryInfo) => {
  const config = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY
    }
  };

  const data = {
    sender: {
      name: process.env.EMAIL_NAME,
      email: process.env.EMAIL_FROM
    },
    to: [{ email: userEmail }],
    subject: 'Your FreshMart Order is Ready for Pickup!',
    htmlContent: `
      <h2>Your Order #${orderNumber} is Ready!</h2>
      <p>Great news! Your FreshMart order has been processed and is ready for pickup.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 5px;">
        <h3 style="color: #22c55e; margin-top: 0;">Pickup Information:</h3>
        <p><strong>Location:</strong> ${deliveryInfo.address}, ${deliveryInfo.city}</p>
        <p><strong>Working Hours:</strong> 7:00 AM - 7:00 PM (Monday to Saturday)</p>
        <p><strong>Important:</strong> Please collect your order during our working hours and bring a valid ID.</p>
        <p><strong>Contact:</strong> ${deliveryInfo.phone}</p>
      </div>

      <p>Thank you for shopping with FreshMart!</p>
      
      <p style="color: #666; font-size: 0.9em;">
        Note: Orders not collected within 24 hours may be returned to stock.
      </p>
    `
  };

  try {
    const response = await axios.post(BREVO_API_URL, data, config);
    console.log('Email sent successfully:', response.data);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error.response?.data || error.message);
    throw error;
  }
};

export const sendPromoEmail = async (userEmail, promoCode, discount, validUntil) => {
  const config = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY
    }
  };

  const data = {
    sender: {
      name: process.env.EMAIL_NAME,
      email: process.env.EMAIL_FROM
    },
    to: [{ email: userEmail }],
    subject: 'Your FreshMart Promo Code Details',
    htmlContent: `
      <h2>Promo Code Applied Successfully!</h2>
      <div style="background-color: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 5px;">
        <p><strong>Promo Code:</strong> ${promoCode}</p>
        <p><strong>Discount:</strong> ${discount}</p>
        <p><strong>Valid Until:</strong> ${new Date(validUntil).toLocaleDateString()}</p>
      </div>
      <p>This discount has been applied to your current order.</p>
      <p>Thank you for shopping with FreshMart!</p>
    `
  };

  try {
    const response = await axios.post(BREVO_API_URL, data, config);
    console.log('Promo email sent successfully:', response.data);
    return true;
  } catch (error) {
    console.error('Error sending promo email:', error.response?.data || error.message);
    throw error;
  }
};

export const sendWelcomePromoEmail = async (email, promoCode) => {
  const config = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY
    }
  };

  const data = {
    sender: {
      name: process.env.EMAIL_NAME,
      email: process.env.EMAIL_FROM
    },
    to: [{ email }],
    subject: 'Welcome to FreshMart - Here\'s Your Special Discount!',
    htmlContent: `
      <h2>Welcome to FreshMart!</h2>
      <p>Thank you for subscribing to our promotional offers.</p>
      <div style="background-color: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 5px;">
        <h3 style="color: #22c55e; margin-top: 0;">Your Welcome Promo Code</h3>
        <p style="font-size: 24px; font-weight: bold;">${promoCode.code}</p>
        <p>Get ${promoCode.discountAmount}% off your first order!</p>
        <p>Valid until: ${new Date(promoCode.validUntil).toLocaleDateString()}</p>
      </div>
      <p>Use this code at checkout to claim your discount.</p>
    `
  };

  try {
    const response = await axios.post(BREVO_API_URL, data, config);
    return true;
  } catch (error) {
    console.error('Error sending promo welcome email:', error);
    throw error;
  }
};
