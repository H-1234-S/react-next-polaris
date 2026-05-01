/* eslint-disable react-hooks/purity */

import { useMutation, useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useProjects = () => {
  return useQuery(api.projects.get);
};

export const useProjectsPartial = (limit: number) => {
  return useQuery(api.projects.getPartial, {
    limit,
  });
};

export const useCreateProject = () => {
  return useMutation(api.projects.create)
    // 乐观更新
    .withOptimisticUpdate(
      (localStore, args) => {
        // localStore.getQuery获取当前查询的数据
        const existingProjects = localStore.getQuery(api.projects.get);

        if (existingProjects !== undefined) {
          const now = Date.now();
          const newProject = {
            _id: crypto.randomUUID() as Id<"projects">,
            _creationTime: now,
            name: args.name,
            ownerId: "anonymous",
            updatedAt: now,
          };

          // 类似于react，将数组视为只读
          localStore.setQuery(api.projects.get, {}, [
            ...existingProjects,
            newProject,
          ]);
        }
      }
    )
};