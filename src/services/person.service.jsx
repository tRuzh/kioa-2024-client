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

  updateImmediateFamilies(id, immediateFamily) {
    return http.put(`/people/${id}/immediatefamilies`, immediateFamily);
  }

  deleteImmediateFamily(id, immediateFamily) {
    return http.put(`/people/${id}/immediatefamilies/delete`, immediateFamily);
  }

  delete(id) {
    return http.delete(`/people/${id}`);
  }

  findByFirstname(firstname) {
    return http.get(`/people?firstname=${firstname}`);
  }
}

export default new PersonDataService();