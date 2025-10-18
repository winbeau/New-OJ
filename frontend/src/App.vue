<template>
  <div id="app">
    <nav class="navbar">
      <div class="navbar-container">
        <!-- Logo/Brand -->
        <div class="navbar-brand">
          <router-link to="/home" class="brand-link">
            <span class="brand-icon">🎓</span>
            <span class="brand-text">{{ OJ_NAME }}</span>
          </router-link>
        </div>

        <!-- Mobile Menu Toggle -->
        <button
          class="mobile-menu-toggle"
          @click="toggleMobileMenu"
          aria-label="Toggle menu"
        >
          <span :class="['hamburger', { active: isMobileMenuOpen }]"></span>
        </button>

        <!-- Navigation Links -->
        <ul :class="['nav-links', { active: isMobileMenuOpen }]">
          <li class="nav-item">
            <router-link to="/home" class="nav-link" @click="closeMobileMenu">
              <span class="nav-icon">🏠</span>
              <span class="nav-text">主页</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/problems"
              class="nav-link"
              @click="closeMobileMenu"
            >
              <span class="nav-icon">📚</span>
              <span class="nav-text">题库</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/contests"
              class="nav-link"
              @click="closeMobileMenu"
            >
              <span class="nav-icon">🏆</span>
              <span class="nav-text">比赛</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/tutorials"
              class="nav-link"
              @click="closeMobileMenu"
            >
              <span class="nav-icon">💡</span>
              <span class="nav-text">教程</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/punch" class="nav-link" @click="closeMobileMenu">
              <span class="nav-icon">✅</span>
              <span class="nav-text">打卡</span>
            </router-link>
          </li>
        </ul>

        <!-- Right Section -->
        <div :class="['navbar-right', { active: isMobileMenuOpen }]">
          <router-link to="/about" class="nav-link-alt" @click="closeMobileMenu"
            >关于</router-link
          >
          <router-link to="/usr" class="btn-user" @click="closeMobileMenu">
            <span class="user-icon">👤</span>
            <span class="user-text">用户中心</span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { OJ_NAME } from "@/config/constants";

export default defineComponent({
  name: "App",
  setup() {
    const isMobileMenuOpen = ref(false);

    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value;
    };

    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false;
    };

    return {
      OJ_NAME,
      isMobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
    };
  },
});
</script>
