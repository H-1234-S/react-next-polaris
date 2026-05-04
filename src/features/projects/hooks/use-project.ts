/* eslint-disable react-hooks/purity */

import { useMutation, useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useProject = (projectId: Id<"projects">) => {
  return useQuery(api.projects.getById, { id: projectId });
};

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

export const useRenameProject = (projectId: Id<"projects">) => {
  return useMutation(api.projects.rename).withOptimisticUpdate(
    (localStore, args) => {
      const existingProject = localStore.getQuery(
        api.projects.getById,
        { id: projectId }
      );

      // 更新该Id的缓存
      if (existingProject !== undefined && existingProject !== null) {
        localStore.setQuery(
          api.projects.getById,
          { id: projectId },
          {
            ...existingProject,
            name: args.name,
            updatedAt: Date.now(),
          }
        );
      }

      // 更新所有项目中的Id的缓存
      const existingProjects = localStore.getQuery(api.projects.get);

      if (existingProjects !== undefined) {
        localStore.setQuery(
          api.projects.get,
          {},
          existingProjects.map((project) => {
            return project._id === args.id
              ? { ...project, name: args.name, updatedAt: Date.now() }
              : project
          })
        );
      }
    }
  )
};