import { useMutation, useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useProjects = () => {
  return useQuery(api.project.get);
};

export const useProjectsPartial = (limit: number) => {
  return useQuery(api.project.getPartial, {
    limit,
  });
};