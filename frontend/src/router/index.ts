import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ProblemsView from "../views/ProblemsView.vue";
import ContestsView from "../views/ContestsView.vue";
import TutorialsView from "../views/TutorialsView.vue";
import PunchView from "../views/PunchView.vue";
import UsrView from "../views/UsrView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/home",
    name: "home",
    component: HomeView,
  },
  {
    path: "/problems",
    name: "problems",
    component: ProblemsView,
  },
  {
    path: "/contests",
    name: "contests",
    component: ContestsView,
  },
  {
    path: "/tutorials",
    name: "tutorials",
    component: TutorialsView,
  },
  {
    path: "/punch",
    name: "punch",
    component: PunchView,
  },
  {
    path: "/usr",
    name: "usr",
    component: UsrView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/",
    redirect: "/home", // 默认进入 home 页面
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
