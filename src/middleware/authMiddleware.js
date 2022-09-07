import jwt from "jsonwebtoken";
import User from "../schemas/User.js";
import { canSeeProcesses } from "../permissions/permissions.js";
// import UserController from "../controllers/UserController";

function authRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res.status(401);
      return res.send("Sem permissão!");
    }

    next();
  };
}

async function protect(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      return res.status(401).send();
    }
  }

  if (!token) {
    return res.status(401).send();
  }
}

export { protect, authRole };
