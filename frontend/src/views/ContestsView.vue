<template>
  <div class="contests-container">
    <!-- Left Column (70%) -->
    <div class="left-column">
      <!-- Status Filter Section -->
      <section class="section filter-section">
        <h3 class="section-title">🏆 比赛筛选</h3>
        <div class="filter-group">
          <button
            v-for="status in contestStatuses"
            :key="status.id"
            :class="[
              'status-tab',
              status.id,
              { active: selectedStatus === status.id },
            ]"
            @click="selectStatus(status.id)"
          >
            <span class="tab-icon">{{ status.icon }}</span>
            <span class="tab-name">{{ status.name }}</span>
            <span class="tab-count">({{ getStatusCount(status.id) }})</span>
          </button>
        </div>
      </section>

      <!-- Contests List Section -->
      <section class="section contests-list-section">
        <h3 class="section-title">📋 比赛列表</h3>
        <div v-if="filteredContests.length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <div class="empty-text">暂无符合条件的比赛</div>
        </div>
        <div v-else class="contests-grid">
          <div
            v-for="contest in filteredContests"
            :key="contest.id"
            class="contest-card"
            :class="contest.status"
          >
            <div class="card-header">
              <h4 class="contest-title">{{ contest.title }}</h4>
              <span :class="['status-badge', contest.status]">
                {{ getStatusText(contest.status) }}
              </span>
            </div>

            <div class="card-body">
              <div class="contest-info">
                <div class="info-row">
                  <span class="info-icon">📅</span>
                  <span class="info-label">开始时间:</span>
                  <span class="info-value">{{ contest.startTime }}</span>
                </div>
                <div class="info-row">
                  <span class="info-icon">⏱️</span>
                  <span class="info-label">比赛时长:</span>
                  <span class="info-value">{{ contest.duration }}</span>
                </div>
                <div class="info-row">
                  <span class="info-icon">👥</span>
                  <span class="info-label">参与人数:</span>
                  <span class="info-value">{{ contest.participants }}</span>
                </div>
                <div v-if="contest.status === 'ongoing'" class="info-row">
                  <span class="info-icon">⏳</span>
                  <span class="info-label">剩余时间:</span>
                  <span class="info-value countdown">{{
                    contest.remaining
                  }}</span>
                </div>
                <div v-if="contest.status === 'upcoming'" class="info-row">
                  <span class="info-icon">⏰</span>
                  <span class="info-label">距离开始:</span>
                  <span class="info-value countdown">{{
                    contest.countdown
                  }}</span>
                </div>
              </div>

              <div class="contest-description">
                {{ contest.description }}
              </div>
            </div>

            <div class="card-footer">
              <button
                v-if="contest.status === 'upcoming' && !contest.registered"
                class="btn btn-primary"
                @click="registerContest(contest.id)"
              >
                🎯 立即报名
              </button>
              <button
                v-if="contest.status === 'upcoming' && contest.registered"
                class="btn btn-success"
                disabled
              >
                ✅ 已报名
              </button>
              <button
                v-if="contest.status === 'ongoing'"
                class="btn btn-enter"
                @click="enterContest(contest.id)"
              >
                🚀 进入比赛
              </button>
              <button
                v-if="contest.status === 'ended'"
                class="btn btn-view"
                @click="viewResults(contest.id)"
              >
                📊 查看结果
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Right Column (30%) -->
    <div class="right-column">
      <!-- Search Box -->
      <SearchBox @search="handleSearch" />

      <!-- User Contest Stats Section -->
      <section class="section stats-section">
        <h3 class="section-title">📈 我的战绩</h3>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🎮</div>
            <div class="stat-info">
              <div class="stat-value">{{ userStats.participated }}</div>
              <div class="stat-label">参与次数</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏅</div>
            <div class="stat-info">
              <div class="stat-value">{{ userStats.bestRank }}</div>
              <div class="stat-label">最佳排名</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-info">
              <div class="stat-value">{{ userStats.totalScore }}</div>
              <div class="stat-label">总得分</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Contests Section -->
      <section class="section recent-section">
        <h3 class="section-title">🕐 最近参与</h3>
        <div v-if="recentContests.length === 0" class="empty-recent">
          暂无参与记录
        </div>
        <div v-else class="recent-list">
          <div
            v-for="contest in recentContests"
            :key="contest.id"
            class="recent-item"
            @click="viewContestDetail(contest.id)"
          >
            <div class="recent-header">
              <div class="recent-title">{{ contest.title }}</div>
              <div class="recent-rank" :class="getRankClass(contest.rank)">
                #{{ contest.rank }}
              </div>
            </div>
            <div class="recent-info">
              <span class="recent-date">{{ contest.date }}</span>
              <span class="recent-score">得分: {{ contest.score }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import SearchBox from "@/components/SearchBox.vue";

// ==================== Type Definitions for Backend API ====================

/**
 * 比赛状态枚举
 */
enum ContestStatus {
  ALL = "all",
  ONGOING = "ongoing", // 进行中
  UPCOMING = "upcoming", // 即将开始
  ENDED = "ended", // 已结束
}

/**
 * 比赛数据接口
 */
interface Contest {
  id: string; // 比赛ID
  title: string; // 比赛标题
  description: string; // 比赛描述
  startTime: string; // 开始时间
  endTime: string; // 结束时间
  duration: string; // 比赛时长
  participants: number; // 参与人数
  status: ContestStatus; // 比赛状态
  registered: boolean; // 用户是否已报名
  remaining?: string; // 剩余时间（进行中）
  countdown?: string; // 倒计时（即将开始）
}

/**
 * 比赛状态筛选接口
 */
interface StatusFilter {
  id: ContestStatus;
  name: string;
  icon: string;
}

/**
 * 用户比赛统计接口
 */
interface UserContestStats {
  participated: number; // 参与次数
  bestRank: number; // 最佳排名
  totalScore: number; // 总得分
}

/**
 * 最近参与的比赛接口
 */
interface RecentContest {
  id: string;
  title: string;
  date: string;
  rank: number;
  score: number;
}

// ==================== API Service (To be implemented) ====================

/**
 * API 服务类 - 用于与后端交互
 * TODO: 实现实际的 HTTP 请求
 */
class ContestAPIService {
  /**
   * 获取比赛列表
   * @param filters 筛选条件
   * @returns Promise<Contest[]>
   */
  static async getContests(filters?: {
    status?: ContestStatus;
    keyword?: string;
  }): Promise<Contest[]> {
    // TODO: 实现实际的 API 调用
    // return await axios.get('/api/contests', { params: filters });
    return Promise.resolve([]);
  }

  /**
   * 获取用户比赛统计
   * @param userId 用户ID
   * @returns Promise<UserContestStats>
   */
  static async getUserContestStats(userId: string): Promise<UserContestStats> {
    // TODO: 实现实际的 API 调用
    // return await axios.get(`/api/users/${userId}/contest-stats`);
    return Promise.resolve({
      participated: 0,
      bestRank: 0,
      totalScore: 0,
    });
  }

  /**
   * 获取用户最近参与的比赛
   * @param userId 用户ID
   * @param limit 数量限制
   * @returns Promise<RecentContest[]>
   */
  static async getRecentContests(
    userId: string,
    limit = 5
  ): Promise<RecentContest[]> {
    // TODO: 实现实际的 API 调用
    // return await axios.get(`/api/users/${userId}/recent-contests`, { params: { limit } });
    return Promise.resolve([]);
  }

  /**
   * 报名比赛
   * @param contestId 比赛ID
   * @returns Promise<boolean>
   */
  static async registerContest(contestId: string): Promise<boolean> {
    // TODO: 实现实际的 API 调用
    // return await axios.post(`/api/contests/${contestId}/register`);
    return Promise.resolve(true);
  }
}

export default defineComponent({
  name: "ContestsView",
  components: {
    SearchBox,
  },
  setup() {
    // ==================== State ====================
    const selectedStatus = ref<ContestStatus>(ContestStatus.ALL);
    const searchKeyword = ref<string>("");

    // Contest status filters
    const contestStatuses = ref<StatusFilter[]>([
      { id: ContestStatus.ALL, name: "全部", icon: "📚" },
      { id: ContestStatus.ONGOING, name: "进行中", icon: "🔥" },
      { id: ContestStatus.UPCOMING, name: "即将开始", icon: "📅" },
      { id: ContestStatus.ENDED, name: "已结束", icon: "✅" },
    ]);

    // Mock contests data (replace with API call)
    const contests = ref<Contest[]>([
      {
        id: "C001",
        title: "XJU-OJ 周赛 #42",
        description: "本周算法竞赛，涵盖数据结构、动态规划等经典题型",
        startTime: "2025-10-20 20:00",
        endTime: "2025-10-20 22:00",
        duration: "2小时",
        participants: 156,
        status: ContestStatus.ONGOING,
        registered: true,
        remaining: "01:23:45",
      },
      {
        id: "C002",
        title: "算法入门专场",
        description: "适合初学者的算法竞赛，题目难度适中",
        startTime: "2025-10-21 14:00",
        endTime: "2025-10-21 16:00",
        duration: "2小时",
        participants: 89,
        status: ContestStatus.UPCOMING,
        registered: true,
        countdown: "18:32:15",
      },
      {
        id: "C003",
        title: "动态规划专题赛",
        description: "专注于动态规划算法的深度练习",
        startTime: "2025-10-22 19:00",
        endTime: "2025-10-22 21:30",
        duration: "2.5小时",
        participants: 42,
        status: ContestStatus.UPCOMING,
        registered: false,
        countdown: "2天12小时",
      },
      {
        id: "C004",
        title: "XJU-OJ 月赛 #10",
        description: "月度挑战赛，难度较高，适合进阶选手",
        startTime: "2025-10-25 20:00",
        endTime: "2025-10-25 23:00",
        duration: "3小时",
        participants: 23,
        status: ContestStatus.UPCOMING,
        registered: false,
        countdown: "5天10小时",
      },
      {
        id: "C005",
        title: "XJU-OJ 周赛 #41",
        description: "上周竞赛已结束，感谢各位选手的参与！",
        startTime: "2025-10-13 20:00",
        endTime: "2025-10-13 22:00",
        duration: "2小时",
        participants: 203,
        status: ContestStatus.ENDED,
        registered: true,
      },
      {
        id: "C006",
        title: "图论算法专场",
        description: "专注图论算法的专题练习",
        startTime: "2025-10-10 14:00",
        endTime: "2025-10-10 17:00",
        duration: "3小时",
        participants: 178,
        status: ContestStatus.ENDED,
        registered: true,
      },
    ]);

    // User contest statistics (replace with API call)
    const userStats = ref<UserContestStats>({
      participated: 12,
      bestRank: 8,
      totalScore: 2450,
    });

    // Recent contests (replace with API call)
    const recentContests = ref<RecentContest[]>([
      {
        id: "C005",
        title: "XJU-OJ 周赛 #41",
        date: "2025-10-13",
        rank: 15,
        score: 180,
      },
      {
        id: "C006",
        title: "图论算法专场",
        date: "2025-10-10",
        rank: 8,
        score: 245,
      },
      {
        id: "C007",
        title: "XJU-OJ 周赛 #40",
        date: "2025-10-06",
        rank: 22,
        score: 165,
      },
      {
        id: "C008",
        title: "字符串专题赛",
        date: "2025-10-03",
        rank: 18,
        score: 198,
      },
    ]);

    // ==================== Computed ====================
    const filteredContests = computed(() => {
      return contests.value.filter((contest) => {
        const statusMatch =
          selectedStatus.value === ContestStatus.ALL ||
          contest.status === selectedStatus.value;
        const keywordMatch =
          searchKeyword.value === "" ||
          contest.title
            .toLowerCase()
            .includes(searchKeyword.value.toLowerCase()) ||
          contest.description
            .toLowerCase()
            .includes(searchKeyword.value.toLowerCase());

        return statusMatch && keywordMatch;
      });
    });

    // ==================== Methods ====================
    const selectStatus = (status: ContestStatus) => {
      selectedStatus.value = status;
    };

    const getStatusCount = (status: ContestStatus): number => {
      if (status === ContestStatus.ALL) {
        return contests.value.length;
      }
      return contests.value.filter((c) => c.status === status).length;
    };

    const getStatusText = (status: ContestStatus): string => {
      switch (status) {
        case ContestStatus.ONGOING:
          return "进行中";
        case ContestStatus.UPCOMING:
          return "即将开始";
        case ContestStatus.ENDED:
          return "已结束";
        default:
          return "";
      }
    };

    const handleSearch = (keyword: string) => {
      searchKeyword.value = keyword;
    };

    const registerContest = (contestId: string) => {
      console.log("Register contest:", contestId);
      // TODO: Call API to register
      alert(`报名比赛 ${contestId}`);
    };

    const enterContest = (contestId: string) => {
      console.log("Enter contest:", contestId);
      // TODO: Navigate to contest page
      alert(`进入比赛 ${contestId}`);
    };

    const viewResults = (contestId: string) => {
      console.log("View results:", contestId);
      // TODO: Navigate to results page
      alert(`查看结果 ${contestId}`);
    };

    const viewContestDetail = (contestId: string) => {
      console.log("View contest detail:", contestId);
      // TODO: Navigate to contest detail page
      alert(`查看比赛详情 ${contestId}`);
    };

    const getRankClass = (rank: number): string => {
      if (rank <= 3) return "rank-gold";
      if (rank <= 10) return "rank-silver";
      return "rank-bronze";
    };

    return {
      // State
      selectedStatus,
      contestStatuses,
      userStats,
      recentContests,
      // Computed
      filteredContests,
      // Methods
      selectStatus,
      getStatusCount,
      getStatusText,
      handleSearch,
      registerContest,
      enterContest,
      viewResults,
      viewContestDetail,
      getRankClass,
    };
  },
});
</script>

<style scoped>
.contests-container {
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

/* Filter Section */
.filter-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.status-tab {
  flex: 1;
  min-width: 120px;
  padding: 12px 20px;
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  color: #555;
}

.status-tab:hover {
  border-color: #42b983;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.2);
}

.status-tab.active {
  background: #42b983;
  border-color: #42b983;
  color: #fff;
}

.tab-icon {
  font-size: 18px;
}

.tab-name {
  font-size: 14px;
}

.tab-count {
  font-size: 12px;
  opacity: 0.8;
}

/* Contests Grid */
.contests-grid {
  display: grid;
  gap: 20px;
}

.contest-card {
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s;
}

.contest-card:hover {
  border-color: #42b983;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.contest-card.ongoing {
  border-color: #ff5722;
  background: linear-gradient(to right, #fff9f8 0%, #fff 100%);
}

.contest-card.upcoming {
  border-color: #2196f3;
  background: linear-gradient(to right, #f8fbff 0%, #fff 100%);
}

.contest-card.ended {
  border-color: #9e9e9e;
  opacity: 0.85;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #f9f9f9;
  border-bottom: 1px solid #e0e0e0;
}

.contest-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.ongoing {
  background: #ff5722;
  color: #fff;
}

.status-badge.upcoming {
  background: #2196f3;
  color: #fff;
}

.status-badge.ended {
  background: #9e9e9e;
  color: #fff;
}

.card-body {
  padding: 20px;
}

.contest-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 15px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.info-icon {
  font-size: 16px;
}

.info-label {
  color: #666;
  font-weight: 500;
}

.info-value {
  color: #2c3e50;
  font-weight: 600;
}

.info-value.countdown {
  color: #ff5722;
  font-family: "Courier New", monospace;
}

.contest-description {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 6px;
}

.card-footer {
  padding: 15px 20px;
  background: #f9f9f9;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-primary {
  background: #42b983;
  color: #fff;
}

.btn-primary:hover {
  background: #35a372;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.btn-success {
  background: #4caf50;
  color: #fff;
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-enter {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.btn-enter:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-view {
  background: #2196f3;
  color: #fff;
}

.btn-view:hover {
  background: #1976d2;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 15px;
}

.empty-text {
  font-size: 16px;
}

/* User Stats Section */
.stats-grid {
  display: grid;
  gap: 12px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: #fff;
}

.stat-icon {
  font-size: 32px;
  opacity: 0.9;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
}

/* Recent Contests Section */
.empty-recent {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 14px;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recent-item {
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.3s;
}

.recent-item:hover {
  border-color: #42b983;
  background: #fff;
  transform: translateX(4px);
}

.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.recent-title {
  font-weight: 600;
  font-size: 14px;
  color: #2c3e50;
}

.recent-rank {
  font-weight: 700;
  font-size: 14px;
  padding: 2px 8px;
  border-radius: 12px;
}

.recent-rank.rank-gold {
  background: #ffd700;
  color: #fff;
}

.recent-rank.rank-silver {
  background: #c0c0c0;
  color: #fff;
}

.recent-rank.rank-bronze {
  background: #cd7f32;
  color: #fff;
}

.recent-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

.recent-date {
  opacity: 0.8;
}

.recent-score {
  font-weight: 600;
  color: #42b983;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .contests-container {
    flex-direction: column;
  }

  .left-column,
  .right-column {
    flex: 1;
  }

  .contest-info {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .contests-container {
    padding: 10px;
    gap: 15px;
  }

  .section {
    padding: 15px;
  }

  .section-title {
    font-size: 16px;
  }

  .filter-group {
    gap: 8px;
  }

  .status-tab {
    min-width: 80px;
    padding: 10px 12px;
    font-size: 12px;
  }

  .tab-name {
    font-size: 12px;
  }

  .contest-card {
    border-radius: 8px;
  }

  .contest-title {
    font-size: 16px;
  }

  .contest-info {
    gap: 10px;
  }

  .info-row {
    font-size: 13px;
  }
}
</style>
