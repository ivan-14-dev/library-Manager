import React from "react";
import { motion } from "framer-motion";

const ProfileCard = ({ initials, name, role, joinDate }) => {
  const roleColors = {
    STUDENT: "role student",
    PROFESSOR: "role professor",
    LIBRARIAN: "role librarian",
    ADMIN: "role admin",
    VISITOR: "role visitor",
  };

  return (
    <motion.div
      className="profile-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="avatar">{initials}</div>
      <h2>{name}</h2>
      <span className={roleColors[role] || "role"}>{role}</span>
      <p className="join-date">Membre depuis {joinDate}</p>
    </motion.div>
  );
};

export default ProfileCard;
