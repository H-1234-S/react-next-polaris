import { z } from "zod";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { inngest } from "@/inngest/client";
import { convex } from "@/lib/convex-client";

import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

const requestSchema = z.object({
  projectId: z.string(),
});

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const body = await request.json();
  const { projectId } = requestSchema.parse(body);

  const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY;

  if (!internalKey) {
    return NextResponse.json(
      { error: "Internal key not configured" },
      { status: 500 }
    );
  }

  // 在此项目中查找状态是 处理中 的消息
  const processingMessages = await convex.query(
    api.system.getProcessingMessages,
    {
      internalKey,
      projectId: projectId as Id<"projects">,
    }
  );

  if (processingMessages.length === 0) {
    return NextResponse.json({ success: true, cancelled: false });
  }

  /**
   * 取消所有执行中的消息
   * 
   * 前置知识：
   * - 任何标记为 async 的函数始终会返回一个 Promise
   * 
   * 运行原理：
   * - map会遍历数组中每一个元素
   * - 每次遍历都会调用 async 回调函数
   * - async 回调函数返回一个 pending 状态的 Promise 函数
   * - 注意：map 不会等待内部的 await 完成，它只收集所有的 Promise，返回一个数组
   * - Promise.all 拿到一个由 Promise 组成的数组后
   * - 同时启动数组中所有的异步任务，也就是await
   */
  const cancelledIds = await Promise.all(
    processingMessages.map(async (msg) => {
      await inngest.send({
        name: "message/cancel",
        data: {
          messageId: msg._id,
        },
      });

      await convex.mutation(api.system.updateMessageStatus, {
        internalKey,
        messageId: msg._id,
        status: "cancelled",
      });

      return msg._id;
    })
  );

  return NextResponse.json({
    success: true,
    cancelled: true,
    messageIds: cancelledIds,
  });
};