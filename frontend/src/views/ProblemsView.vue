<template>
  <div class="problems-container">
    <!-- Left Column (70%) -->
    <div class="left-column">
      <!-- Filter Section -->
      <section class="section filter-section">
        <h3 class="section-title">🏷️ 筛选条件</h3>

        <!-- Algorithm Module Filter -->
        <div class="filter-group">
          <label class="filter-label">算法模块:</label>
          <div class="tag-group">
            <button
              v-for="module in algorithmModules"
              :key="module.id"
              :class="['tag-button', { active: selectedModule === module.id }]"
              @click="selectModule(module.id)"
            >
              {{ module.name }}
            </button>
          </div>
        </div>

        <!-- Difficulty Filter -->
        <div class="filter-group">
          <label class="filter-label">题目难度:</label>
          <div class="tag-group">
            <button
              v-for="level in difficultyLevels"
              :key="level.id"
              :class="[
                'tag-button',
                'difficulty-tag',
                level.id,
                { active: selectedDifficulty === level.id },
              ]"
              @click="selectDifficulty(level.id)"
            >
              {{ level.name }}
            </button>
          </div>
        </div>

        <button class="reset-button" @click="resetFilters">🔄 重置筛选</button>
      </section>

      <!-- Problem List Section -->
      <section class="section problem-list-section">
        <h3 class="section-title">📝 题单列表</h3>
        <div class="list-stats">共 {{ filteredProblems.length }} 道题目</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>状态</th>
              <th>题号</th>
              <th>题目名称</th>
              <th>难度</th>
              <th>算法模块</th>
              <th>通过率</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="problem in filteredProblems"
              :key="problem.id"
              @click="viewProblem(problem.id)"
              class="problem-row"
            >
              <td class="status-cell">
                <span :class="['status-icon', problem.status]">
                  {{ getStatusIcon(problem.status) }}
                </span>
              </td>
              <td class="id-cell">{{ problem.id }}</td>
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
              <td class="module-cell">{{ problem.module }}</td>
              <td class="rate-cell">{{ problem.passRate }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <!-- Right Column (30%) -->
    <div class="right-column">
      <!-- Search Box -->
      <SearchBox @search="handleSearch" />

      <!-- User Profile Section -->
      <section class="section profile-section">
        <h3 class="section-title">👤 我的数据</h3>

        <!-- Stats Overview -->
        <div class="stats-overview">
          <div class="stat-item">
            <div class="stat-label">尝试过</div>
            <div class="stat-value">{{ userStats.attempted }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">已解决</div>
            <div class="stat-value solved">{{ userStats.solved }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">通过率</div>
            <div class="stat-value">{{ userStats.passRate }}</div>
          </div>
        </div>

        <!-- Difficulty Chart -->
        <div class="chart-container">
          <h4 class="chart-title">已解决题目 - 按难度</h4>
          <canvas ref="difficultyChartCanvas" class="chart-canvas"></canvas>
        </div>

        <!-- Module Chart -->
        <div class="chart-container">
          <h4 class="chart-title">已解决题目 - 按算法模块</h4>
          <canvas ref="moduleChartCanvas" class="chart-canvas"></canvas>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, nextTick } from "vue";
import SearchBox from "@/components/SearchBox.vue";

// ==================== Type Definitions for Backend API ====================

/**
 * 题目状态枚举
 */
enum ProblemStatus {
  NOT_ATTEMPTED = "not_attempted", // 未尝试
  ATTEMPTED = "attempted", // 已尝试但未通过
  SOLVED = "solved", // 已解决
}

/**
 * 题目难度枚举
 */
enum Difficulty {
  ALL = "all",
  EASY = "简单",
  MEDIUM = "中等",
  HARD = "困难",
}

/**
 * 题目数据接口
 */
interface Problem {
  id: string; // 题目ID
  title: string; // 题目标题
  difficulty: string; // 难度
  module: string; // 算法模块
  passRate: string; // 通过率
  status: ProblemStatus; // 用户对该题目的状态
}

/**
 * 算法模块接口
 */
interface AlgorithmModule {
  id: string;
  name: string;
}

/**
 * 难度等级接口
 */
interface DifficultyLevel {
  id: string;
  name: string;
}

/**
 * 用户统计数据接口
 */
interface UserStats {
  attempted: number; // 尝试过的题目数
  solved: number; // 已解决的题目数
  passRate: string; // 通过率
  solvedByDifficulty: {
    // 按难度分类的已解决题目数
    easy: number;
    medium: number;
    hard: number;
  };
  solvedByModule: {
    // 按算法模块分类的已解决题目数
    [module: string]: number;
  };
}

// ==================== API Service (To be implemented) ====================

/**
 * API 服务类 - 用于与后端交互
 * TODO: 实现实际的 HTTP 请求
 */
class ProblemAPIService {
  /**
   * 获取题目列表
   * @param filters 筛选条件
   * @returns Promise<Problem[]>
   */
  static async getProblems(filters?: {
    module?: string;
    difficulty?: string;
    keyword?: string;
  }): Promise<Problem[]> {
    // TODO: 实现实际的 API 调用
    // return await axios.get('/api/problems', { params: filters });
    return Promise.resolve([]);
  }

  /**
   * 获取用户统计数据
   * @param userId 用户ID
   * @returns Promise<UserStats>
   */
  static async getUserStats(userId: string): Promise<UserStats> {
    // TODO: 实现实际的 API 调用
    // return await axios.get(`/api/users/${userId}/stats`);
    return Promise.resolve({
      attempted: 0,
      solved: 0,
      passRate: "0%",
      solvedByDifficulty: { easy: 0, medium: 0, hard: 0 },
      solvedByModule: {},
    });
  }

  /**
   * 获取算法模块列表
   * @returns Promise<AlgorithmModule[]>
   */
  static async getAlgorithmModules(): Promise<AlgorithmModule[]> {
    // TODO: 实现实际的 API 调用
    // return await axios.get('/api/algorithm-modules');
    return Promise.resolve([]);
  }
}

export default defineComponent({
  name: "ProblemsView",
  components: {
    SearchBox,
  },
  setup() {
    // ==================== Refs ====================
    const difficultyChartCanvas = ref<HTMLCanvasElement | null>(null);
    const moduleChartCanvas = ref<HTMLCanvasElement | null>(null);

    // ==================== State ====================
    const selectedModule = ref<string>("all");
    const selectedDifficulty = ref<string>("all");
    const searchKeyword = ref<string>("");

    // Algorithm modules data (can be fetched from backend)
    const algorithmModules = ref<AlgorithmModule[]>([
      { id: "all", name: "全部" },
      { id: "array", name: "数组" },
      { id: "linkedlist", name: "链表" },
      { id: "tree", name: "树" },
      { id: "graph", name: "图" },
      { id: "dp", name: "动态规划" },
      { id: "greedy", name: "贪心" },
      { id: "backtrack", name: "回溯" },
      { id: "sort", name: "排序" },
      { id: "search", name: "搜索" },
    ]);

    // Difficulty levels
    const difficultyLevels = ref<DifficultyLevel[]>([
      { id: "all", name: "全部" },
      { id: "简单", name: "简单" },
      { id: "中等", name: "中等" },
      { id: "困难", name: "困难" },
    ]);

    // Mock problems data (replace with API call)
    const problems = ref<Problem[]>([
      {
        id: "P1001",
        title: "两数之和",
        difficulty: "简单",
        module: "数组",
        passRate: "68.5%",
        status: ProblemStatus.SOLVED,
      },
      {
        id: "P1002",
        title: "反转链表",
        difficulty: "简单",
        module: "链表",
        passRate: "72.3%",
        status: ProblemStatus.SOLVED,
      },
      {
        id: "P1003",
        title: "二叉树的中序遍历",
        difficulty: "中等",
        module: "树",
        passRate: "58.7%",
        status: ProblemStatus.ATTEMPTED,
      },
      {
        id: "P1004",
        title: "最长回文子串",
        difficulty: "中等",
        module: "动态规划",
        passRate: "45.2%",
        status: ProblemStatus.NOT_ATTEMPTED,
      },
      {
        id: "P1005",
        title: "正则表达式匹配",
        difficulty: "困难",
        module: "动态规划",
        passRate: "32.8%",
        status: ProblemStatus.NOT_ATTEMPTED,
      },
      {
        id: "P1006",
        title: "合并K个升序链表",
        difficulty: "困难",
        module: "链表",
        passRate: "38.4%",
        status: ProblemStatus.ATTEMPTED,
      },
      {
        id: "P1007",
        title: "快速排序实现",
        difficulty: "简单",
        module: "排序",
        passRate: "75.6%",
        status: ProblemStatus.SOLVED,
      },
      {
        id: "P1008",
        title: "图的深度优先遍历",
        difficulty: "中等",
        module: "图",
        passRate: "52.3%",
        status: ProblemStatus.SOLVED,
      },
      {
        id: "P1009",
        title: "01背包问题",
        difficulty: "中等",
        module: "动态规划",
        passRate: "48.9%",
        status: ProblemStatus.NOT_ATTEMPTED,
      },
      {
        id: "P1010",
        title: "N皇后问题",
        difficulty: "困难",
        module: "回溯",
        passRate: "28.5%",
        status: ProblemStatus.NOT_ATTEMPTED,
      },
    ]);

    // User statistics (replace with API call)
    const userStats = ref<UserStats>({
      attempted: 6,
      solved: 4,
      passRate: "66.7%",
      solvedByDifficulty: {
        easy: 2,
        medium: 2,
        hard: 0,
      },
      solvedByModule: {
        数组: 1,
        链表: 1,
        树: 0,
        图: 1,
        动态规划: 0,
        排序: 1,
      },
    });

    // ==================== Computed ====================
    const filteredProblems = computed(() => {
      return problems.value.filter((problem) => {
        const moduleMatch =
          selectedModule.value === "all" ||
          problem.module === getModuleName(selectedModule.value);
        const difficultyMatch =
          selectedDifficulty.value === "all" ||
          problem.difficulty === selectedDifficulty.value;
        const keywordMatch =
          searchKeyword.value === "" ||
          problem.title
            .toLowerCase()
            .includes(searchKeyword.value.toLowerCase()) ||
          problem.id.toLowerCase().includes(searchKeyword.value.toLowerCase());

        return moduleMatch && difficultyMatch && keywordMatch;
      });
    });

    // ==================== Methods ====================
    const getModuleName = (moduleId: string): string => {
      const module = algorithmModules.value.find((m) => m.id === moduleId);
      return module ? module.name : "";
    };

    const selectModule = (moduleId: string) => {
      selectedModule.value = moduleId;
    };

    const selectDifficulty = (difficultyId: string) => {
      selectedDifficulty.value = difficultyId;
    };

    const resetFilters = () => {
      selectedModule.value = "all";
      selectedDifficulty.value = "all";
      searchKeyword.value = "";
    };

    const handleSearch = (keyword: string) => {
      searchKeyword.value = keyword;
    };

    const viewProblem = (problemId: string) => {
      console.log("View problem:", problemId);
      // TODO: Navigate to problem detail page
      alert(`查看题目 ${problemId}`);
    };

    const getStatusIcon = (status: ProblemStatus): string => {
      switch (status) {
        case ProblemStatus.SOLVED:
          return "✅";
        case ProblemStatus.ATTEMPTED:
          return "❓";
        case ProblemStatus.NOT_ATTEMPTED:
        default:
          return "⚪";
      }
    };

    // ==================== Chart Drawing Functions ====================
    const drawDifficultyChart = () => {
      const canvas = difficultyChartCanvas.value;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = 200;
      ctx.scale(2, 2);

      const width = canvas.offsetWidth;
      const height = 100;
      const data = userStats.value.solvedByDifficulty;
      const maxValue = Math.max(data.easy, data.medium, data.hard, 1);

      const barWidth = 50;
      const spacing = (width - barWidth * 3) / 4;

      // Colors
      const colors = {
        easy: "#4caf50",
        medium: "#ff9800",
        hard: "#f44336",
      };

      // Draw bars
      const bars = [
        { label: "简单", value: data.easy, color: colors.easy, x: spacing },
        {
          label: "中等",
          value: data.medium,
          color: colors.medium,
          x: spacing * 2 + barWidth,
        },
        {
          label: "困难",
          value: data.hard,
          color: colors.hard,
          x: spacing * 3 + barWidth * 2,
        },
      ];

      bars.forEach((bar) => {
        const barHeight = (bar.value / maxValue) * (height - 30);
        const y = height - barHeight - 10;

        // Draw bar
        ctx.fillStyle = bar.color;
        ctx.fillRect(bar.x, y, barWidth, barHeight);

        // Draw value
        ctx.fillStyle = "#333";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(bar.value.toString(), bar.x + barWidth / 2, y - 5);

        // Draw label
        ctx.fillStyle = "#666";
        ctx.font = "11px Arial";
        ctx.fillText(bar.label, bar.x + barWidth / 2, height + 5);
      });
    };

    const drawModuleChart = () => {
      const canvas = moduleChartCanvas.value;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = 200;
      ctx.scale(2, 2);

      const width = canvas.offsetWidth;
      const height = 100;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = 35;

      const data = userStats.value.solvedByModule;
      const total = Object.values(data).reduce((sum, val) => sum + val, 0);

      if (total === 0) {
        ctx.fillStyle = "#ccc";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText("暂无数据", centerX, centerY);
        return;
      }

      // Colors for modules
      const colors = [
        "#4caf50",
        "#2196f3",
        "#ff9800",
        "#f44336",
        "#9c27b0",
        "#00bcd4",
      ];

      let currentAngle = -Math.PI / 2;
      let colorIndex = 0;

      Object.entries(data).forEach(([module, value]) => {
        if (value === 0) return;

        const sliceAngle = (value / total) * Math.PI * 2;

        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(
          centerX,
          centerY,
          radius,
          currentAngle,
          currentAngle + sliceAngle
        );
        ctx.closePath();
        ctx.fillStyle = colors[colorIndex % colors.length];
        ctx.fill();

        // Draw percentage
        const midAngle = currentAngle + sliceAngle / 2;
        const textX = centerX + Math.cos(midAngle) * (radius / 2);
        const textY = centerY + Math.sin(midAngle) * (radius / 2);
        const percentage = ((value / total) * 100).toFixed(0);

        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`${percentage}%`, textX, textY);

        currentAngle += sliceAngle;
        colorIndex++;
      });

      // Draw legend
      let legendY = 10;
      colorIndex = 0;
      Object.entries(data).forEach(([module, value]) => {
        if (value === 0) return;

        // Legend color box
        ctx.fillStyle = colors[colorIndex % colors.length];
        ctx.fillRect(width - 60, legendY, 10, 10);

        // Legend text
        ctx.fillStyle = "#333";
        ctx.font = "10px Arial";
        ctx.textAlign = "left";
        ctx.fillText(`${module}(${value})`, width - 45, legendY + 8);

        legendY += 15;
        colorIndex++;
      });
    };

    // ==================== Lifecycle Hooks ====================
    onMounted(async () => {
      // TODO: Fetch data from backend
      // problems.value = await ProblemAPIService.getProblems();
      // userStats.value = await ProblemAPIService.getUserStats('current-user-id');
      // algorithmModules.value = await ProblemAPIService.getAlgorithmModules();

      // Draw charts after DOM is ready
      await nextTick();
      drawDifficultyChart();
      drawModuleChart();
    });

    return {
      // Refs
      difficultyChartCanvas,
      moduleChartCanvas,
      // State
      selectedModule,
      selectedDifficulty,
      algorithmModules,
      difficultyLevels,
      userStats,
      // Computed
      filteredProblems,
      // Methods
      selectModule,
      selectDifficulty,
      resetFilters,
      handleSearch,
      viewProblem,
      getStatusIcon,
    };
  },
});
</script>

<style scoped>
.problems-container {
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
  margin-bottom: 15px;
}

.filter-label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 14px;
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-button {
  padding: 6px 16px;
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
  color: #555;
  font-weight: 500;
}

.tag-button:hover {
  border-color: #42b983;
  color: #42b983;
  transform: translateY(-1px);
}

.tag-button.active {
  background: #42b983;
  border-color: #42b983;
  color: #fff;
}

.tag-button.difficulty-tag.简单 {
  border-color: #4caf50;
}

.tag-button.difficulty-tag.简单:hover {
  border-color: #4caf50;
  color: #4caf50;
}

.tag-button.difficulty-tag.简单.active {
  background: #4caf50;
  border-color: #4caf50;
}

.tag-button.difficulty-tag.中等 {
  border-color: #ff9800;
}

.tag-button.difficulty-tag.中等:hover {
  border-color: #ff9800;
  color: #ff9800;
}

.tag-button.difficulty-tag.中等.active {
  background: #ff9800;
  border-color: #ff9800;
}

.tag-button.difficulty-tag.困难 {
  border-color: #f44336;
}

.tag-button.difficulty-tag.困难:hover {
  border-color: #f44336;
  color: #f44336;
}

.tag-button.difficulty-tag.困难.active {
  background: #f44336;
  border-color: #f44336;
}

.reset-button {
  padding: 8px 20px;
  background: #fff;
  border: 2px solid #42b983;
  border-radius: 6px;
  color: #42b983;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 13px;
  margin-top: 5px;
}

.reset-button:hover {
  background: #42b983;
  color: #fff;
}

/* Problem List Section */
.list-stats {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  display: inline-block;
}

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
  font-size: 14px;
}

.data-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  color: #555;
  font-size: 14px;
}

.problem-row {
  cursor: pointer;
  transition: background 0.2s;
}

.problem-row:hover {
  background: #f9f9f9;
}

.status-cell {
  text-align: center;
  width: 60px;
}

.status-icon {
  font-size: 16px;
}

.status-icon.solved {
  color: #4caf50;
}

.status-icon.attempted {
  color: #ff9800;
}

.id-cell {
  font-family: "Courier New", monospace;
  font-weight: 600;
  color: #2196f3;
  width: 100px;
}

.title-cell {
  font-weight: 500;
  color: #2c3e50;
  min-width: 200px;
}

.module-cell {
  color: #666;
  width: 120px;
}

.rate-cell {
  color: #42b983;
  font-weight: 600;
  width: 100px;
}

/* Difficulty Badge */
.difficulty-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

.difficulty-badge.简单 {
  background: #e8f5e9;
  color: #2e7d32;
}

.difficulty-badge.中等 {
  background: #fff3e0;
  color: #e65100;
}

.difficulty-badge.困难 {
  background: #ffebee;
  color: #c62828;
}

/* User Profile Section */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.stat-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  color: #fff;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
}

.stat-value.solved {
  color: #ffd700;
}

/* Chart Container */
.chart-container {
  margin-bottom: 20px;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.chart-canvas {
  width: 100%;
  height: 100px;
  background: #fafafa;
  border-radius: 6px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .problems-container {
    flex-direction: column;
  }

  .left-column,
  .right-column {
    flex: 1;
  }

  .stats-overview {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .problems-container {
    padding: 10px;
    gap: 15px;
  }

  .section {
    padding: 15px;
  }

  .section-title {
    font-size: 16px;
  }

  .tag-button {
    padding: 5px 12px;
    font-size: 12px;
  }

  .data-table th,
  .data-table td {
    padding: 8px;
    font-size: 12px;
  }

  .stats-overview {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .module-cell,
  .rate-cell {
    display: none;
  }
}
</style>
