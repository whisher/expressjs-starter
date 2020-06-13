const UserModel = require("../models/user.model");

exports.getUsers = async (req, res) => {
  const users = await UserModel.find().select(
    "_id name email createdAt updatedAt"
  );
  res.json(users);
};
