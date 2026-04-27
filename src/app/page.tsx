"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function Home() {
  const projects = useQuery(api.project.get)
  const create = useMutation(api.project.create)
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Button
        onClick={() => create({
          name: 'Hu',
          email: '1043914966@qq.com'
        })}>
        add new
      </Button>

      {projects?.map(item => (
        <div
          key={item._id}
          className="border rounded-2xl flex flex-col gap-2 p-3"
        >
          <p>{item.name}</p>
          <p>{item.email}</p>
        </div>
      ))}
    </main>
  );
}