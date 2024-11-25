import http from "../http-common";

class PersonDataService {
  getAll() {
    return http.get("/people");
  }

  get(id) {
    return http.get(`/people/${id}`);
  }

  getFamilyTree(id) {
    return http.get(`/people/${id}/familytree`);
  }

  create(data) {
    return http.post("/people", data);
  }

  update(id, data) {
    return http.put(`/people/${id}`, data);
  }

  updateImmediateRelatives(id, data) {
    return http.put(`/people/${id}/immediaterelatives`, data);
  }

  deleteImmediateRelative(id, immediateRelative) {
    return http.put(`/people/${id}/immediaterelatives/delete`, immediateRelative);
  }

  delete(id) {
    return http.delete(`/people/${id}`);
  }

  findByFirstname(firstname) {
    return http.get(`/people?firstname=${firstname}`);
  }

  addImmediateRelative(data) {
    return http.post(`/people/addImmediateRelative`, data);
  }
}

const personDataService = new PersonDataService();
export default personDataService;