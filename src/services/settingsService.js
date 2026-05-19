import api from "./api";
import { API } from "../constants/apiEndpoints";

export const settingsService = {
  getSchoolProfile: () => api.get(API.SCHOOL_PROFILE),

  updateSchoolProfile: (data) => api.patch(API.SCHOOL_PROFILE, data),

  getSettings: () => api.get(API.SETTINGS),

  updateSetting: (key, data) => api.put(`${API.SETTINGS}/${key}`, data),
};
