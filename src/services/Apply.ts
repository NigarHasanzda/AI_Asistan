import api, { isBrowser, request, requireToken, JSON_HEADERS } from "@/services/api";

// ---------- Applications ----------

export const applyToInternship = async (internshipId: number) => {
  if (!isBrowser()) return null;
  requireToken();

  return request("Apply zamanı xəta:", () =>
    api.post("/Applications/apply", { internshipId }, { headers: JSON_HEADERS })
  );
};

export const getMyApplications = async () => {
  if (!isBrowser()) return null;
  requireToken();

  return request("My applications error:", () =>
    api.get("/Applications/my-applications")
  );
};

export const getApplicationById = async (id: number) => {
  if (!isBrowser()) return null;
  requireToken();

  return request("Get application by ID error:", () =>
    api.get(`/Applications/${id}`)
  );
};

export const withdrawApplication = async (id: number) => {
  if (!isBrowser()) return null;
  requireToken();

  return request("Withdraw error:", () =>
    api.delete(`/Applications/${id}/withdraw`)
  );
};

// ---------- Bookmarks ----------

export const addBookmark = async (internshipId: number) => {
  if (!isBrowser()) return null;
  requireToken();

  return request("Bookmark əlavə edilərkən xəta:", () =>
    api.post(`/Bookmarks/${internshipId}`, {})
  );
};

export const removeBookmark = async (internshipId: number) => {
  if (!isBrowser()) return null;
  requireToken();

  return request("Bookmark silinərkən xəta:", () =>
    api.delete(`/Bookmarks/${internshipId}`)
  );
};

export const getBookmarks = async () => {
  if (!isBrowser()) return null;
  requireToken();

  return request("Bookmarklar alınarkən xəta:", () => api.get("/Bookmarks"));
};
