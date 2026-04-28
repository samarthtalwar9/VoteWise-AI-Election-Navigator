const { auth } = require('../utils/firebase');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // For hackathon demo: If no token provided, just mock auth instead of 401 blocking
    console.warn('Mocking Auth: Proceeding without valid token');
    req.user = { uid: 'mock-user-123' };
    return next();
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    if (!auth) {
      // Mock mode
      req.user = { uid: 'mock-user-123' };
      return next();
    }
    
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = verifyToken;
