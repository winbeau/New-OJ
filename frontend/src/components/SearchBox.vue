<template>
  <section class="section search-section">
    <h3 class="section-title">🔍 题目搜索</h3>
    <div class="search-box">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="输入题目ID或关键词..."
        class="search-input"
        @keyup.enter="handleSearch"
      />
      <button class="search-button" @click="handleSearch">搜索</button>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "SearchBox",
  emits: ["search"],
  setup(props, { emit }) {
    const searchQuery = ref("");

    const handleSearch = () => {
      if (searchQuery.value.trim()) {
        emit("search", searchQuery.value.trim());
      }
    };

    return {
      searchQuery,
      handleSearch,
    };
  },
});
</script>

<style scoped>
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

/* Search Box Styling */
.search-box {
  display: flex;
  gap: 10px;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #42b983;
}

.search-button {
  padding: 10px 20px;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.search-button:hover {
  background: #35a372;
}
</style>
