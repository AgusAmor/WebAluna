import { useEffect, useRef, useState } from "react";
import { Hero } from "../../components/hero/Hero";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import "./users.css";

export function Users() {
  const { isAdmin } = useAuth();
  if (!isAdmin()) return <Navigate to="/" />;
  const { user, isLogged } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef(null);

  const initialForm = {
    userName: "",
    password: "",
    name: "",
    surname: "",
    email: "",
    phone: "",
    type: "CLIENT",
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData(user);
    setShowForm(true);
    setTimeout(
      () => formRef.current?.scrollIntoView({ behavior: "smooth" }),
      100
    );
  };

  const handleDelete = (id) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;

    fetch(`http://localhost:5000/users/${id}`, { method: "DELETE" })
      .then(() => setUsers(users.filter((u) => u.id !== id)))
      .catch((err) => console.error("Error eliminando usuario:", err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const method = selectedUser ? "PUT" : "POST";
    const url = selectedUser
      ? `http://localhost:5000/users/${selectedUser.id}`
      : `http://localhost:5000/users`;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((savedUser) => {
        if (selectedUser) {
          setUsers(users.map((u) => (u.id === savedUser.id ? savedUser : u)));
        } else {
          setUsers([...users, savedUser]);
        }

        setFormData(initialForm);
        setSelectedUser(null);
        setShowForm(false);
      })
      .catch((err) => console.error("Error guardando usuario:", err));
  };

  const handleAddNew = () => {
    setFormData(initialForm);
    setSelectedUser(null);
    setShowForm(true);
    setTimeout(
      () => formRef.current?.scrollIntoView({ behavior: "smooth" }),
      100
    );
  };

  return (
    <div className="container">
      <Hero title="Usuarios" subtitle="Gestor de usuarios" />
      <div className="user-manager">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((u) => !user || u.id !== user.id)
              .map((u) => (
                <tr key={u.id}>
                  <td>{u.userName}</td>
                  <td>{u.name}</td>
                  <td>{u.surname}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>{u.type}</td>
                  <td>
                    {u.type === "ADMIN" ? (
                      <span style={{ color: "gray" }}>Admin protegido</span>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(u)}>Modificar</button>
                        <button onClick={() => handleDelete(u.id)}>
                          Borrar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <button className="add-user-btn" onClick={handleAddNew}>
          Agregar nuevo usuario
        </button>

        {showForm && (
          <form ref={formRef} onSubmit={handleSubmit} className="user-form">
            <h3>{selectedUser ? "Modificar Usuario" : "Agregar Usuario"}</h3>
            <input
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Nombre de usuario"
              required
            />
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              type="password"
              required={!selectedUser}
            />

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nombre"
            />
            <input
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              placeholder="Apellido"
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              type="email"
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Teléfono"
            />
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="ADMIN">Administrador</option>
              <option value="CLIENT">Cliente</option>
            </select>

            <button type="submit">
              {selectedUser ? "Guardar cambios" : "Crear usuario"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
