import jwt from 'jsonwebtoken';

export const ensureUserAuthenticated = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Unauthorized, JWT token is required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'Teacher' || decoded.role === 'Student') {
      req.user = decoded;
      next();
    } else {
      return res.status(403).json({ message: 'Unauthorized, user role not permitted' });
    }
  } catch (err) {
    return res.status(403).json({ message: 'Unauthorized, JWT token is wrong or expired' });
  }
};

export const ensurePrincipalAuthenticated = (req, res, next) => {
  const authHeader = req.headers['authorization'];
 
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Unauthorized, JWT token is required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'Principal') {
      req.user = decoded;
      next();
    } else {
      return res.status(403).json({ message: 'Unauthorized, principal access only' });
    }
  } catch (err) {
    return res.status(403).json({ message: 'Unauthorized, JWT token is wrong or expired' });
  }
};