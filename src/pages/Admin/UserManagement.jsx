import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { Hero } from "../../components/common";
import {
  fetchUsers,
  updateUser,
  deleteUser,
  fetchUserById,
} from "../../services/firebaseUserService";
import authService from "../../services/firebaseAuthService";
import { useAuth } from "../../context/AuthContext";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editUser, setEditUser] = useState(null);
  // State for addresses in the form
  const [formAddresses, setFormAddresses] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        setError("Error loading users");
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  // When opening modal, set addresses state
  //   useEffect(() => {
  //     if (showModal) {
  //       setFormAddresses(
  //         Array.isArray(editUser?.addresses) && editUser.addresses.length > 0
  //           ? editUser.addresses
  //           : [
  //               {
  //                 id: "addr-1",
  //                 street: "",
  //                 apartment: "",
  //                 city: "",
  //                 region: "",
  //                 postalCode: "",
  //                 country: "",
  //                 isDefault: true,
  //                 recipientName: "",
  //                 recipientPhone: "",
  //               },
  //             ]
  //       );
  //     }
  //   }, [showModal, editUser]);

  return (
    <div className="min-h-screen bg-gray-3 px-4 py-2 pb-20">
      <Hero
        title="Gestión de Usuarios"
        subtitle="Administra los usuarios registrados en el sistema."
      />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-4 mt-2">
          <button
            className="flex items-center gap-2 bg-gold text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-blue-2 hover:text-white transition-colors"
            onClick={() => setShowModal(true)}
          >
            <MdAdd size={22} />
            Agregar usuario
          </button>
        </div>
        {/* Modal for adding or editing a user. */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowModal(false);
                setEditUser(null);
              }
            }}
          >
            <div
              className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl min-w-[350px] relative flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-blue-2 hover:text-gold text-xl font-bold"
                onClick={() => {
                  setShowModal(false);
                  setEditUser(null);
                }}
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold text-blue-2 mb-4 font-family-comfortaa">
                {editUser ? "Editar usuario" : "Agregar usuario"}
              </h2>
            </div>
          </div>
        )}
        {/* Users table */}
        <div className="bg-white rounded-xl shadow-md mt-2 overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-blue-2 font-bold">
              Cargando usuarios...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500 font-bold">
              {error}
            </div>
          ) : (
            <table className="min-w-full font-family-sora text-xs md:text-sm">
              <thead>
                <tr className="bg-gold text-white">
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Nombre
                  </th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Email
                  </th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Teléfono
                  </th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Dirección
                  </th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Estado
                  </th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Fecha de creación
                  </th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((userItem) => {
                  // Format creation date
                  let createdAt = "-";
                  if (userItem.createdAt) {
                    const ts = userItem.createdAt;
                    const seconds = ts.seconds || ts._seconds;
                    if (seconds) {
                      const date = new Date(seconds * 1000);
                      const pad = (n) => n.toString().padStart(2, "0");
                      createdAt = `${pad(date.getDate())}/${pad(
                        date.getMonth() + 1
                      )}/${date.getFullYear()} · ${pad(date.getHours())}:${pad(
                        date.getMinutes()
                      )}`;
                    }
                  }
                  return (
                    <tr
                      key={userItem.id}
                      className="border-b border-gray-2 hover:bg-gray-3/40"
                    >
                      <td className="py-2 px-2 text-center">
                        {userItem.displayName || "-"}
                      </td>
                      <td className="py-2 px-2 text-center font-bold text-blue-1">
                        {userItem.email}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {userItem.phone || "-"}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {Array.isArray(userItem.addresses) &&
                        userItem.addresses.length > 0
                          ? userItem.addresses[0]
                          : "-"}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {userItem.accountStatus || "-"}
                      </td>
                      <td className="py-2 px-2 text-center">{createdAt}</td>
                      <td className="py-2 px-2 text-center">
                        <div className="flex flex-col items-center gap-2">
                          {/* Edit button: opens modal with user data for editing. */}
                          <button
                            className="bg-blue-2 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-gold transition-colors w-24"
                            type="button"
                            onClick={() => {
                              setEditUser(userItem);
                              setShowModal(true);
                            }}
                          >
                            Editar
                          </button>
                          {/* Delete button: removes user from Firestore and Authentication. */}
                          <button
                            className={`bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors w-24 flex items-center justify-center ${
                              deletingId === userItem.id
                                ? "opacity-60 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={deletingId === userItem.id}
                            onClick={async () => {
                              if (deletingId) return;
                              setDeletingId(userItem.id);
                              setError(null);
                              let token = "";
                              if (user && user.getIdToken) {
                                token = await user.getIdToken(true);
                              } else if (
                                user &&
                                user.stsTokenManager &&
                                user.stsTokenManager.accessToken
                              ) {
                                token = user.stsTokenManager.accessToken;
                              }
                              if (!token) {
                                setError(
                                  "User token not found. Please log in again."
                                );
                                setDeletingId(null);
                                return;
                              }
                              try {
                                await deleteUser(userItem.id, token);
                                setUsers((prev) =>
                                  prev.filter((u) => u.id !== userItem.id)
                                );
                              } catch (err) {
                                setError(err.message || "Error deleting user");
                              } finally {
                                setDeletingId(null);
                              }
                            }}
                          >
                            {deletingId === userItem.id ? (
                              <span className="flex items-center justify-center w-full h-full">
                                <svg
                                  className="animate-spin h-5 w-5 mx-auto text-white"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-20"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <path
                                    fill="currentColor"
                                    d="M12 2a10 10 0 0 1 10 10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              </span>
                            ) : (
                              "Eliminar"
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
