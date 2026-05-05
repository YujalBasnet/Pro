import api from "./api";

const login = (data) => api.post("/auth/login", data);
const register = (data) => api.post("/auth/register", data);
const getCurrentUser = () => api.get("/auth/me");
const logout = () => localStorage.removeItem("token");

export default { login, register, getCurrentUser, logout };