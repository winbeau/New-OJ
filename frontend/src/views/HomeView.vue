<template>
  <div class="home-container">
    <!-- Left Column (70%) -->
    <div class="left-column">
      <!-- Announcements Section -->
      <section class="section announcements">
        <h2 class="section-title">📢 公告栏</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>发布时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="announcement in announcements" :key="announcement.id">
              <td class="title-cell">{{ announcement.title }}</td>
              <td class="time-cell">{{ announcement.time }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Latest Problems Section -->
      <section class="section latest-problems">
        <h2 class="section-title">🆕 最新题目</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>题目ID</th>
              <th>题目名称</th>
              <th>难度</th>
              <th>通过率</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="problem in latestProblems" :key="problem.id">
              <td>{{ problem.id }}</td>
              <td class="title-cell">{{ problem.title }}</td>
              <td>
                <span
                  :class="[
                    'difficulty-badge',
                    problem.difficulty.toLowerCase(),
                  ]"
                >
                  {{ problem.difficulty }}
                </span>
              </td>
              <td>{{ problem.passRate }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <!-- Right Column (30%) -->
    <div class="right-column">
      <!-- Problem Search Section -->
      <SearchBox @search="handleSearch" />

      <!-- Contest Countdown Section -->
      <section class="section countdown-section">
        <h3 class="section-title">⏰ 比赛倒计时</h3>
        <div class="countdown-box">
          <div class="contest-name">{{ upcomingContest.name }}</div>
          <div class="countdown-timer">{{ countdown }}</div>
          <div class="contest-time">{{ upcomingContest.startTime }}</div>
        </div>
      </section>

      <!-- Top Users Section -->
      <section class="section top-users">
        <h3 class="section-title">🏆 顶尖选手</h3>
        <table class="data-table compact">
          <thead>
            <tr>
              <th>排名</th>
              <th>用户</th>
              <th>得分</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in topUsers" :key="user.id">
              <td>
                <span :class="['rank-badge', `rank-${index + 1}`]">{{
                  index + 1
                }}</span>
              </td>
              <td>{{ user.username }}</td>
              <td class="score-cell">{{ user.score }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Top Contributors Section -->
      <section class="section top-contributors">
        <h3 class="section-title">⭐ 最多贡献</h3>
        <table class="data-table compact">
          <thead>
            <tr>
              <th>排名</th>
              <th>用户</th>
              <th>贡献</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(contributor, index) in topContributors"
              :key="contributor.id"
            >
              <td>
                <span :class="['rank-badge', `rank-${index + 1}`]">{{
                  index + 1
                }}</span>
              </td>
              <td>{{ contributor.username }}</td>
              <td class="score-cell">{{ contributor.contributions }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import SearchBox from "@/components/SearchBox.vue";

interface Announcement {
  id: number;
  title: string;
  time: string;
}

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  passRate: string;
}

interface User {
  id: number;
  username: string;
  score: number;
}

interface Contributor {
  id: number;
  username: string;
  contributions: number;
}

interface Contest {
  name: string;
  startTime: string;
  timestamp: number;
}

export default defineComponent({
  name: "HomeView",
  components: {
    SearchBox,
  },
  setup() {
    const countdown = ref("00:00:00:00");
    let countdownInterval: number | null = null;

    // Mock data for announcements
    const announcements = ref<Announcement[]>([
      { id: 1, title: "XJU-OJ 系统升级公告", time: "2025-10-18 14:30" },
      { id: 2, title: "新增 Python 3.11 支持", time: "2025-10-17 09:15" },
      { id: 3, title: "周赛报名开启", time: "2025-10-16 16:00" },
      { id: 4, title: "题库新增 50 道算法题", time: "2025-10-15 10:20" },
      { id: 5, title: "系统维护通知", time: "2025-10-14 08:00" },
    ]);

    // Mock data for latest problems
    const latestProblems = ref<Problem[]>([
      {
        id: "P1050",
        title: "二叉树的最大路径和",
        difficulty: "困难",
        passRate: "32.5%",
      },
      {
        id: "P1049",
        title: "动态规划入门",
        difficulty: "中等",
        passRate: "58.3%",
      },
      {
        id: "P1048",
        title: "字符串匹配算法",
        difficulty: "中等",
        passRate: "45.7%",
      },
      {
        id: "P1047",
        title: "快速排序实现",
        difficulty: "简单",
        passRate: "72.1%",
      },
      { id: "P1046", title: "图的遍历", difficulty: "中等", passRate: "51.2%" },
      { id: "P1045", title: "栈的应用", difficulty: "简单", passRate: "68.9%" },
    ]);

    // Mock data for upcoming contest
    const upcomingContest = ref<Contest>({
      name: "XJU-OJ 周赛 #42",
      startTime: "2025-10-20 20:00",
      timestamp: new Date("2025-10-20 20:00:00").getTime(),
    });

    // Mock data for top users
    const topUsers = ref<User[]>([
      { id: 1, username: "algorithm_master", score: 9850 },
      { id: 2, username: "code_ninja", score: 9720 },
      { id: 3, username: "binary_wizard", score: 9580 },
      { id: 4, username: "data_structures", score: 9420 },
      { id: 5, username: "dynamic_coder", score: 9310 },
    ]);

    // Mock data for top contributors
    const topContributors = ref<Contributor[]>([
      { id: 1, username: "problem_creator", contributions: 156 },
      { id: 2, username: "solution_writer", contributions: 142 },
      { id: 3, username: "tutorial_author", contributions: 128 },
      { id: 4, username: "test_designer", contributions: 115 },
      { id: 5, username: "code_reviewer", contributions: 98 },
    ]);

    // Update countdown timer
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = upcomingContest.value.timestamp - now;

      if (distance < 0) {
        countdown.value = "比赛已开始";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      countdown.value = `${String(days).padStart(2, "0")}:${String(
        hours
      ).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;
    };

    // Handle search
    const handleSearch = (searchQuery: string) => {
      console.log("Searching for:", searchQuery);
      // TODO: Implement actual search functionality
      alert(`搜索功能待实现: ${searchQuery}`);
    };

    // Lifecycle hooks
    onMounted(() => {
      updateCountdown();
      countdownInterval = window.setInterval(updateCountdown, 1000);
    });

    onUnmounted(() => {
      if (countdownInterval !== null) {
        clearInterval(countdownInterval);
      }
    });

    return {
      countdown,
      announcements,
      latestProblems,
      upcomingContest,
      topUsers,
      topContributors,
      handleSearch,
    };
  },
});
</script>

<style scoped>
.home-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Left Column - 70% */
.left-column {
  flex: 7;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Right Column - 30% */
.right-column {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Section Styling */
.section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  margin: 0 0 15px 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #42b983;
  padding-bottom: 10px;
}

/* Table Styling */
.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #f5f5f5;
}

.data-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e0e0e0;
}

.data-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  color: #555;
}

.data-table tbody tr:hover {
  background: #f9f9f9;
  cursor: pointer;
}

.data-table.compact th,
.data-table.compact td {
  padding: 8px 12px;
  font-size: 14px;
}

.title-cell {
  font-weight: 500;
  color: #2c3e50;
}

.time-cell {
  color: #999;
  font-size: 14px;
}

.score-cell {
  font-weight: 600;
  color: #42b983;
}

/* Difficulty Badge */
.difficulty-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.difficulty-badge.简单 {
  background: #d4edda;
  color: #155724;
}

.difficulty-badge.中等 {
  background: #fff3cd;
  color: #856404;
}

.difficulty-badge.困难 {
  background: #f8d7da;
  color: #721c24;
}

/* Rank Badge */
.rank-badge {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 50%;
  font-weight: 700;
  font-size: 12px;
}

.rank-badge.rank-1 {
  background: #ffd700;
  color: #fff;
}

.rank-badge.rank-2 {
  background: #c0c0c0;
  color: #fff;
}

.rank-badge.rank-3 {
  background: #cd7f32;
  color: #fff;
}

.rank-badge.rank-4,
.rank-badge.rank-5 {
  background: #e0e0e0;
  color: #666;
}

/* Countdown Section */
.countdown-box {
  text-align: center;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: #fff;
}

.contest-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}

.countdown-timer {
  font-size: 28px;
  font-weight: 700;
  font-family: "Courier New", monospace;
  margin: 10px 0;
  letter-spacing: 2px;
}

.contest-time {
  font-size: 14px;
  opacity: 0.9;
  margin-top: 10px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .home-container {
    flex-direction: column;
  }

  .left-column,
  .right-column {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 10px;
    gap: 15px;
  }

  .section {
    padding: 15px;
  }

  .section-title {
    font-size: 16px;
  }

  .data-table th,
  .data-table td {
    padding: 8px;
    font-size: 13px;
  }

  .countdown-timer {
    font-size: 24px;
  }
}
</style>
