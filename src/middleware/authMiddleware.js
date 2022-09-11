import jwt from "jsonwebtoken";
import User from "../schemas/User.js";
//import { canSeeProcesses } from "../permissions/permissions.js";
// import UserController from "../controllers/UserController";

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
async function isAdmin (req, res, next) {
  if (req.user.role !== 1){
      return res.status(401).send();
  }
  next();

}
// function authRole(role) {
//   return (req, res, next) => {
//     const Role = role.filter(req.user.role);
//     if (req.user.role != Role) {
//       res.status(401);
//       return res.send("Sem permissão!");
//     }
//     next();
//   };
// }

export { protect , isAdmin };
