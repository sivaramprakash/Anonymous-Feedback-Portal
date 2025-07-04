import API from "./API";

export const loginAdmin = async (username: string, password: string) => {
  try {
    const response = await API.post("/admin/login", { username, password });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", "admin");
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const loginFaculty = async (username: string, password: string) => {
  try {
    const response = await API.post("/faculty/login", { username, password });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", "faculty");
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const loginDepartment = async (username: any, password: any) => {
  try {
    const response = await API.post("/department/login", { username, password });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", "department");
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const logout = async () => {
  try {
    await API.post("/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  } catch (error: any) {
    throw error.response.data;
  }
};
