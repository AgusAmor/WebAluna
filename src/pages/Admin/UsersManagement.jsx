import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { Hero } from "../../components/common";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  fetchUserById,
} from "../../services/firebaseUserService";
import { useAuth } from "../../context/AuthContext";

// UsersManagement component: handles user CRUD, modal state, and UI feedback for admin user management.
function AddressesForm({ addresses, setAddresses }) {
  const handleChange = (idx, field, value) => {
    setAddresses((prev) => prev.map((addr, i) => i === idx ? { ...addr, [field]: value } : addr));
  };
  const addAddress = () => {
    setAddresses((prev) => [
      ...prev,
      {
        id: `addr-${prev.length+1}`,
        street: "",
        apartment: "",
        city: "",
        region: "",
        postalCode: "",
        country: "",
        isDefault: false,
        recipientName: "",
        recipientPhone: ""
      }
    ]);
  };
  const removeAddress = (idx) => {
    setAddresses((prev) => prev.filter((_, i) => i !== idx));
  };
  return (
    <div className="mb-4">
      {addresses.map((addr, idx) => (
        <div key={addr.id} className="border rounded p-3 mb-2 bg-gray-1/10">
          <div className="flex gap-2 mb-2">
            <input type="text" value={addr.street} onChange={e => handleChange(idx, "street", e.target.value)} name={`address_${idx}_street`} placeholder="Street" className="border rounded px-2 py-1 w-1/2" />
            <input type="text" value={addr.apartment} onChange={e => handleChange(idx, "apartment", e.target.value)} name={`address_${idx}_apartment`} placeholder="Apartment" className="border rounded px-2 py-1 w-1/2" />
          </div>
          <div className="flex gap-2 mb-2">
            <input type="text" value={addr.city} onChange={e => handleChange(idx, "city", e.target.value)} name={`address_${idx}_city`} placeholder="City" className="border rounded px-2 py-1 w-1/3" />
            <input type="text" value={addr.region} onChange={e => handleChange(idx, "region", e.target.value)} name={`address_${idx}_region`} placeholder="Region" className="border rounded px-2 py-1 w-1/3" />
            <input type="text" value={addr.postalCode} onChange={e => handleChange(idx, "postalCode", e.target.value)} name={`address_${idx}_postalCode`} placeholder="Postal Code" className="border rounded px-2 py-1 w-1/3" />
          </div>
          <div className="flex gap-2 mb-2">
            <input type="text" value={addr.country} onChange={e => handleChange(idx, "country", e.target.value)} name={`address_${idx}_country`} placeholder="Country" className="border rounded px-2 py-1 w-1/2" />
            <input type="text" value={addr.recipientName} onChange={e => handleChange(idx, "recipientName", e.target.value)} name={`address_${idx}_recipientName`} placeholder="Recipient Name" className="border rounded px-2 py-1 w-1/2" />
          </div>
          <div className="flex gap-2 mb-2">
            <input type="text" value={addr.recipientPhone} onChange={e => handleChange(idx, "recipientPhone", e.target.value)} name={`address_${idx}_recipientPhone`} placeholder="Recipient Phone" className="border rounded px-2 py-1 w-1/2" />
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={addr.isDefault} onChange={e => handleChange(idx, "isDefault", e.target.checked)} name={`address_${idx}_isDefault`} />
              Default
            </label>
          </div>
          <button type="button" className="text-red-500 text-xs mt-1" onClick={() => removeAddress(idx)} disabled={addresses.length === 1}>Remove</button>
        </div>
      ))}
      <button type="button" className="bg-blue-2 text-white px-3 py-1 rounded text-xs font-bold mt-2" onClick={addAddress}>Add Address</button>
    </div>
  );
}

const UsersManagement = () => {
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
  useEffect(() => {
    if (showModal) {
      setFormAddresses(Array.isArray(editUser?.addresses) && editUser.addresses.length > 0
        ? editUser.addresses
        : [{
            id: "addr-1",
            street: "",
            apartment: "",
            city: "",
            region: "",
            postalCode: "",
            country: "",
            isDefault: true,
            recipientName: "",
            recipientPhone: ""
          }]
      );
    }
  }, [showModal, editUser]);

  return (
    <div className="min-h-screen bg-gray-3 px-4 py-2 pb-20">
      <Hero
        title="User Management"
        subtitle="Manage users registered in the system."
      />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-4 mt-2">
          <button
            className="flex items-center gap-2 bg-gold text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-blue-2 hover:text-white transition-colors"
            onClick={() => setShowModal(true)}
          >
            <MdAdd size={22} />
            Add user
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
                {editUser ? "Edit user" : "Add user"}
              </h2>
              {/* Simple user form */}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (saving) return;
                  setError(null);
                  setSaving(true);
                  const form = e.target;
                  const email = form.elements["email"].value;
                  const displayName = form.elements["displayName"].value;
                  const phone = form.elements["phone"].value;
                  // Use addresses from state
                  const addresses = formAddresses;
                  const accountStatus = form.elements["accountStatus"].value;
                  const uid = form.elements["uid"]?.value || undefined;
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
                    setError("User token not found. Please log in again.");
                    setSaving(false);
                    return;
                  }
                  const userData = {
                    email,
                    displayName,
                    phone,
                    addresses,
                    accountStatus,
                  };
                  try {
                    if (editUser) {
                      await updateUser(editUser.id, userData, token);
                      const data = await fetchUsers();
                      setUsers(data);
                    } else {
                      await createUser({ ...userData, uid }, token);
                      const data = await fetchUsers();
                      setUsers(data);
                    }
                    setShowModal(false);
                    setEditUser(null);
                  } catch (err) {
                    setError(
                      err.message ||
                        (editUser ? "Error editing user" : "Error creating user")
                    );
                  } finally {
                    setSaving(false);
                  }
                }}
                className="flex flex-col gap-4"
              >
                <input
                  type="text"
                  name="displayName"
                  placeholder="Display Name"
                  defaultValue={editUser?.displayName || ""}
                  className="border rounded px-3 py-2"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  defaultValue={editUser?.email || ""}
                  required
                  className="border rounded px-3 py-2"
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  defaultValue={editUser?.phone || ""}
                  className="border rounded px-3 py-2"
                />
                {/* Dynamic addresses form */}
                <AddressesForm addresses={formAddresses} setAddresses={setFormAddresses} />
                <select
                  name="accountStatus"
                  defaultValue={editUser?.accountStatus || "active"}
                  className="border rounded px-3 py-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="banned">Banned</option>
                </select>
                {/* ...existing code... */}
                {!editUser && (
                  <input
                    type="text"
                    name="uid"
                    placeholder="UID (optional)"
                    className="border rounded px-3 py-2"
                  />
                )}
                <div className="flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="bg-gold text-white px-6 py-2 rounded font-bold hover:bg-blue-2 transition-colors"
                    disabled={saving}
                  >
                    {editUser ? "Apply changes" : "Save"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-2 text-blue-2 px-6 py-2 rounded font-bold hover:bg-gray-3 transition-colors"
                    onClick={() => {
                      setShowModal(false);
                      setEditUser(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
                {error && (
                  <div className="text-red-500 font-bold mt-2">{error}</div>
                )}
              </form>
            </div>
          </div>
        )}
        {/* Users table */}
        <div className="bg-white rounded-xl shadow-md mt-2 overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-blue-2 font-bold">
              Loading users...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500 font-bold">
              {error}
            </div>
          ) : (
            <table className="min-w-full font-family-sora text-xs md:text-sm">
              <thead>
                <tr className="bg-gold text-white">
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">Name</th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">Email</th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">Phone</th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">Address</th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">Status</th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">Created At</th>
                  <th className="py-2 px-1 font-bold text-center whitespace-nowrap">Actions</th>
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
                      createdAt = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} · ${pad(date.getHours())}:${pad(date.getMinutes())}`;
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
                        {Array.isArray(userItem.addresses) && userItem.addresses.length > 0
                          ? userItem.addresses[0]
                          : "-"}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {userItem.accountStatus || "-"}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {createdAt}
                      </td>
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
                            Edit
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
                              "Delete"
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

export default UsersManagement;
