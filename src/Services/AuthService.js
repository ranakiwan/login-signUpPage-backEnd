require('dotenv').config();
const db = require('better-sqlite3')(process.env.DBNAME);
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Create a new user and return a JWT token
const createUser = user => {
  const { FirstName, LastName, email, password } = user;
  const query = "INSERT INTO Users (FirstName, LastName, email, password) VALUES (?, ?, ?, ?)";
  const changes = db.prepare(query).run(FirstName, LastName, email, hashPassword(password));

  if (changes.changes === 0) {
    throw new Error("An Error occurred while creating a new user");
  }

  // Generate a token for the new user
  const payload = { email, FirstName };
  const token = generateToken(payload);
  
  return { token };
};

// Validate login and return a JWT token if credentials are correct
const validateLogin = async (email, password) => {
  const query = "SELECT * FROM Users WHERE email = ?";
  const row = db.prepare(query).get(email);

  if (!row) {
    return { valid: false };
  }

  const valid = await bcrypt.compare(password, row.password);
  if (!valid) {
    return { valid: false };
  }

  // Generate token after successful login
  const payload = { userId: row.id, admin: row.admin };
  const token = generateToken(payload);

  return {
    valid: true,
    result: {
      token,
      FirstName: row.FirstName,
      FirstTime: false
    }
  };
};

// Middleware to authenticate user via JWT
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { valid, decodedToken } = validateToken(token);

    if (!valid) {
      throw new Error();
    }

    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// Helper function to validate JWT token
const validateToken = token => {
  try {
    const decodedToken = jwt.verify(token, process.env.SECRETKEY);
    if (!decodedToken.userId) {
      return { valid: false };
    }
    return { valid: true, decodedToken };
  } catch (err) {
    return { valid: false };
  }
};

// Helper function to generate JWT token
const generateToken = payload => {
  const secretKey = process.env.SECRETKEY;
  return jwt.sign(payload, secretKey);
};

// Helper function to hash passwords
const hashPassword = password => {
  return bcrypt.hashSync(password, 10);
};

module.exports = {
  validateLogin,
  authenticate,
  createUser
};
