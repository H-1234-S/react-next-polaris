// 根级别项目的基础填充（在项目标题之后）
export const BASE_PADDING = 12;
// 每个嵌套级别的额外填充
export const LEVEL_PADDING = 12;

export const getItemPadding = (level: number, isFile: boolean) => {
  // 文件需要额外的填充，因为它们没有 V 形符号
  const fileOffset = isFile ? 16 : 0;
  return BASE_PADDING + level * LEVEL_PADDING + fileOffset;
};