const express = require('express');
const chatbotController = require('../controllers/ChatbotController');
const router = express.Router();

// Process user query
router.post('/process-query', chatbotController.processQuery);

// Get book details
router.get('/book-details/:productId', chatbotController.getBookDetails);

module.exports = router;