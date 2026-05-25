import api from "./api";

const getMechanics = () => api.get("/mechanics");
const getMechanicById = (id) => api.get(`/mechanics/${id}`);
const hireMechanic = (data) => api.post("/requests", data);

export default { getMechanics, getMechanicById, hireMechanic };