import { z } from "zod";
import { generateText, Output } from "ai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { firecrawl } from "@/lib/firecrawl";
import { deepseek } from "@/lib/deepseek";

// Zod Schema 传递给 LLM ，describe是给 LLM 读的
const quickEditSchema = z.object({
    editedCode: z
        .string()
        .describe(
            "The edited version of the selected code based on the instruction"
        ),
});

const URL_REGEX = /https?:\/\/[^\s\u3000\u4e00-\u9fa5，。！？、]+(?<![,，.])/g;

const QUICK_EDIT_PROMPT = `You are a code editing assistant. Edit the selected code based on the user's instruction.

<context>
<selected_code>
{selectedCode}
</selected_code>
<full_code_context>
{fullCode}
</full_code_context>
</context>

{documentation}

<instruction>
{instruction}
</instruction>

<instructions>
Return ONLY the edited version of the selected code.
Maintain the same indentation level as the original.
Do not include any explanations or comments unless requested.
If the instruction is unclear or cannot be applied, return the original code unchanged.
</instructions>`;

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        const { selectedCode, fullCode, instruction } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 400 }
            );
        }

        if (!selectedCode) {
            return NextResponse.json(
                { error: "Selected code is required" },
                { status: 400 }
            );
        }

        if (!instruction) {
            return NextResponse.json(
                { error: "Instruction is required" },
                { status: 400 }
            );
        }

        const urls: string[] = instruction.match(URL_REGEX) || [];
        let documentationContext = "";

        // 调用firecrawl抓取内容
        if (urls.length > 0) {
            /**
             * 1. 成功获取 markdown：返回 <doc url="${url}">\n${result.markdown}\n</doc> 字符串                                                                                                                           
             * 2. 无 markdown 内容：返回 null（result.markdown 为空/falsy）                                                                                                                                               
             * 3. 抓取异常：捕获后返回 null
             */
            const scrapedResults = await Promise.all(
                urls.map(async (url) => {
                    try {
                        const result = await firecrawl.scrape(url, {
                            formats: ["markdown"],
                        });

                        if (result.markdown) {
                            return `<doc url="${url}">\n${result.markdown}\n</doc>`;
                        }

                        return null;
                    } catch {
                        return null;
                    }
                })
            );

            const validResults = scrapedResults.filter(Boolean);    // item => Boolean(item)

            if (validResults.length > 0) {
                documentationContext = `<documentation>\n${validResults.join("\n\n")}\n</documentation>`;
            }
        }

        // 有点问题，万一用户输入带有这种特殊字符怎么办？
        const prompt = QUICK_EDIT_PROMPT
            .replace("{selectedCode}", selectedCode)
            .replace("{fullCode}", fullCode || "")
            .replace("{instruction}", instruction)
            .replace("{documentation}", documentationContext);

        // output 执行结构化输出
        const { output } = await generateText({
            model: deepseek('deepseek-chat'),
            output: Output.object({ schema: quickEditSchema }), // LLM 能看到 describe 
            prompt,
        });

        return NextResponse.json({ editedCode: output.editedCode });
    } catch (error) {
        console.error("Edit error:", error);
        return NextResponse.json(
            { error: "Failed to generate edit" },
            { status: 500 }
        );
    }
};