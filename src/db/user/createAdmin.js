const { User, USER_ROLES } = require("./user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function createAdmin() {
  try {
    // If any user is already in the database, exit
    if (await User.count()) return "No admin account created";

    // Else, create an admin user
    const name = "admin";
    const rawPassword = "admin";
    const email = "admin@upday.com";
    const role = USER_ROLES.ADMIN;

    // build password
    const saltRounds = 10;
    let password = await bcrypt.hash(rawPassword, saltRounds);

    // Build token
    const token = await jwt.sign(
      { uuid, name, password, email },
      process.env.SERVER_JWT_SECRET
    );

    const user = {
      name,
      password,
      role,
      token
    };
    await User.create(user);

    return "Admin account created";
  } catch (err) {
    console.log(err);
  }
}

module.exports = createAdmin;
