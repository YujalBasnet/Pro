import api from "./api";

const getUsers = () => api.get("/admin/users");
const getMechanics = () => api.get("/admin/mechanics");
const approveMechanic = (id) => api.put(`/admin/mechanics/${id}/approve`);
const deleteUser = (id) => api.delete(`/admin/users/${id}`);

export default { getUsers, getMechanics, approveMechanic, deleteUser };