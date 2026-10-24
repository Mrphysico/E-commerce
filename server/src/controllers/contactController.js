import { dataStore } from '../utils/dataStore.js';

// @desc    Submit contact us / support inquiry
// @route   POST /api/contact
// @access  Public
export const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, subject, and message',
      });
    }

    const saved = await dataStore.createContactMessage({
      name,
      email,
      phone: phone || '',
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Our support team will get back to you within 24 hours.',
      inquiryId: saved._id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact inquiries (Admin)
// @route   GET /api/contact
// @access  Private/Admin
export const getContactMessages = async (req, res, next) => {
  try {
    const messages = await dataStore.getContactMessages();
    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
};
