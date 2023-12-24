const Group = require("../models/group");
const User = require("../models/user");
const { Op, fn, col } = require("sequelize");

exports.createGroup = async (req, res) => {
  const { groupName, members } = req.body;
  const createrId = req.user.id;

  try {
    const newGroup = await Group.create({
      groupName,
      createrId,
      groupMemberId: members,
    });

    res.status(201).json(newGroup);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
const { DataTypes, Sequelize } = require("sequelize");

exports.getGroups = async (req, res) => {
  const id = req.user.id;
  const userId = Number(req.body.userId);

  try {
    const groups = await Group.findAll({
      where: {
        [Op.or]: [
          { createrId: userId },
          fn("JSON_CONTAINS", col("groupMemberId"), `["${userId}"]`),
        ],
      },
    });
    const groupDetails = await Promise.all(
      groups.map(async (group) => {
        const userIds = group.groupMemberId || []; // Make sure group.groupMemberId is an array

        // Fetch user details for each userId
        const users = await User.findAll({
          where: {
            id: userIds,
          },
          attributes: ["id", "name", "email"], // Include the attributes you want to retrieve
        });
        return {
          id: group.id,
          groupName: group.groupName,
          createrId: group.createrId,
          users,
        };
      })
    );

    res.status(200).json(groupDetails);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.editGroupName = async (req, res) => {
  const { groupId, editGroupName, members } = req.body;
  try {
    const group = await Group.findByPk(groupId);
    if (group) {
      group.groupName = editGroupName;
      group.groupMemberId = members;
      await group.save();
      res.send(group.groupName);
    } else {
      res.status(404).send("Group not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
