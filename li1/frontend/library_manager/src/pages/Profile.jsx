// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";
import { InputField } from "../components/Profile/InputField.jsx";
import { FiEdit3, FiSave, FiUser } from "react-icons/fi";



const Profile = () => {
  const { user, loading, updateProfile } = useAuth();
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Charger les données utilisateur dès qu’il est dispo
  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  if (loading) return <p className="text-center text-gray-600 mt-10">Chargement du profil...</p>;
  if (!user) return <p className="text-center text-gray-600 mt-10">Aucun utilisateur connecté.</p>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      className="p-10 bg-gray-50 min-h-screen flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-center mb-10 space-x-3">
        <div className="bg-blue-700 text-white px-4 py-2 rounded-full font-bold text-2xl">AcHub</div>
        <h1 className="text-3xl font-bold text-gray-800">AcademicHub</h1>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-600 text-white rounded-full p-5 text-4xl shadow-md">
            <FiUser />
          </div>
        </div>
        <h2 className="text-center text-xl font-semibold text-gray-700">
          {user.first_name} {user.last_name}
        </h2>
        <p className="text-center text-sm text-gray-500 mb-8 uppercase">{user.role}</p>

        {/* GRID FORM */}
        <div className="grid grid-cols-2 gap-6">
          <InputField label="Prénom" name="first_name" value={formData.first_name || ""} onChange={handleChange} disabled={!isEditing} />
          <InputField label="Nom" name="last_name" value={formData.last_name || ""} onChange={handleChange} disabled={!isEditing} />
          <InputField label="Email" name="email" value={formData.email || ""} onChange={handleChange} disabled />
          <InputField label="Téléphone" name="phone" value={formData.phone || ""} onChange={handleChange} disabled={!isEditing} />
          <InputField label="Adresse" name="address" value={formData.address || ""} onChange={handleChange} disabled={!isEditing} />
          <InputField label="Date de naissance" name="birth_date" value={formData.birth_date || ""} onChange={handleChange} disabled={!isEditing} />
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex justify-center space-x-6">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              <FiEdit3 className="mr-2" /> Modifier
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
            >
              <FiSave className="mr-2" /> Sauvegarder
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
