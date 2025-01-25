import jwt from 'jsonwebtoken'

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "No authentication token provided" });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedData?.id;
    
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Invalid credentials" });
  }
};

export default auth;