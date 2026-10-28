import type { NextConfig } from "next";
const config: NextConfig = {
  // 项目已有协作协议，避免开发服务器自动修改根目录 AGENTS.md。
  agentRules: false,
  devIndicators: false,
};
export default config;
