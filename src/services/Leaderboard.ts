import api, { isBrowser, request, requireToken } from "@/services/api";

export const getLeaderboards = async (targetJobId?: number) => {
  if (!isBrowser()) return null;
  requireToken();

  return request("Leaderboards alınarkən xəta:", () =>
    api.get("/Leaderboards", { params: targetJobId ? { targetJobId } : {} })
  );
};

export const toggleOptIn = async () => {
  if (!isBrowser()) return null;
  requireToken();

  return request("Toggle opt-in zamanı xəta:", () =>
    api.patch("/Leaderboards/toggle-opt-in", null)
  );
};
