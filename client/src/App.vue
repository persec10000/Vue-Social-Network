<template>
  <v-app>
    <!-- Horizontal NavBar -->

    <v-toolbar fixed color="primary" dark>
      <!-- App Title -->
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title class="hidden-xs-only">
        <router-link to="/" tag="span" style="cursor:pointer">
          Foodies
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- Search Input -->
      <v-text-field flex prepend-icon="search" placeholder="Search" color="accent" single-line hide-details></v-text-field>
      <v-spacer></v-spacer>

      <!-- Horizontal NavBar Links -->
      <v-toolbar-items>
        <v-btn flat v-for="item in horizontalNavItems" :key="item.title" to="item.link">
          <v-icon class="hidden-md-only" left>{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <!-- App Content -->
    <main>

      <router-view />
    </main>
  </v-app>
</template>


<script>
export default {
  name: "App",
  computed: {
    horizontalNavItems() {
      return [
        { icon: "chat", title: "post", link: "/posts" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Un", link: "/signun" }
      ];
    }
  }
};
</script>
