/**
 * 全局常量配置
 */

// OJ 系统名称
export const OJ_NAME = "New-OJ";

// OJ Logo 路径
import logo from "@/assets/logo.png";

export const LOGO_PATH = logo;

// 导航路由配置
export const NAV_ROUTES = [
  { path: "/home", name: "主页", icon: "" },
  { path: "/problems", name: "题库", icon: "" },
  { path: "/contests", name: "比赛", icon: "" },
  { path: "/tutorials", name: "教程", icon: "" },
  { path: "/punch", name: "打卡", icon: "" },
];

// 其他全局配置可以在这里添加
// export const API_BASE_URL = 'http://localhost:3000';
// export const PAGE_SIZE = 20;
