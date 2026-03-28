exports.validateClientCreation = (req, res, next) => {
    const { name, companyName, clientId } = req.body;
    if (!name || !companyName || !clientId) {
      return res.status(400).json({ message: "Validation Error: 'name', 'companyName', and 'clientId' are required fields." });
    }
    next();
  };
  
  exports.validateUserCreation = (req, res, next) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Validation Error: 'name', 'email', 'password', and 'role' are required fields." });
    }
    const validRoles = ["admin", "partner", "client"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: `Validation Error: 'role' must be one of: ${validRoles.join(", ")}` });
    }
    next();
  };