<template>
  <div id="app">
    <nav class="navbar">
      <div class="navbar-container">
        <!-- Logo/Brand -->
        <div class="navbar-brand">
          <router-link to="/home" class="brand-link">
            <img :src="LOGO_PATH" alt="Logo" class="brand-icon" />
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

        <!-- Navigation Tabs with Radio Style -->
        <div :class="['navbar-menu', { active: isMobileMenuOpen }]">
          <router-link
            v-for="navRoute in navRoutes"
            :key="navRoute.path"
            :to="navRoute.path"
            class="navbar-menu-item"
            @click="closeMobileMenu"
          >
            <span>
              <span v-if="navRoute.icon" class="nav-icon">{{
                navRoute.icon
              }}</span>
              {{ navRoute.name }}
            </span>
          </router-link>
        </div>

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
// import { useRoute } from "vue-router";
import { OJ_NAME, LOGO_PATH, NAV_ROUTES } from "@/config/constants";

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
      LOGO_PATH,
      navRoutes: NAV_ROUTES,
      isMobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
    };
  },
});
</script>
