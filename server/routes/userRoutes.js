const router = require('express').Router();
const { registerUser, loginUser, getMe } = require('../controllers/userController');
const auth = require('../middleware/auth');

// Register User
router.post('/register', registerUser);

// Login User
router.post('/login', loginUser);

// Get logged-in user
router.get('/me', auth, getMe);

module.exports = router;