<template>
  <v-app style="background: #E3E3EE">
    <!-- Side Navbar -->
    <v-navigation-drawer app temporary fixed v-model="sideNav">
      <v-toolbar color="accent" dark flat>
        <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
        <router-link to="/" tag="span" style="cursor: pointer">
          <h1 class="title pl-3">Farabeuf</h1>
        </router-link>
      </v-toolbar>

      <v-divider></v-divider>

      <!-- Side Navbar Links -->
      <v-list>
        <v-list-tile ripple v-for="item in sideNavItems" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            {{item.title}}
          </v-list-tile-content>
        </v-list-tile>

        <!-- SignOut Button -->
        <v-list-tile v-if="user" @click="handleSignoutUser">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content></v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <!-- Horizontal Navbar -->
    <v-toolbar fixed color="primary" dark>
      <!-- App Title -->
      <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
      <v-toolbar-title class="hidden-xs-only">
        <router-link to="/" tag="span" style="cursor: pointer">
          Farabeuf
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Search Input -->
      <v-text-field v-model="searchTerm" @input="handleSearchPosts" flex prepend-icon="search" placeholder="Buscar" color="accent" single-line hide-details></v-text-field>

      <!-- Search Results -->

      <v-card dark v-if="searchResults.length" id="search__card">
        <v-list>
          <v-list-tile v-for="result in searchResults" :key="result._id" @click="goToSeachResult(result._id)">
            <v-list-tile-title>
              {{result.title}} -
              <span class="font-weight-thin">{{formatDescription(result.description)}}</span>
            </v-list-tile-title>

            <!-- Show icon if user's fav in search results -->
            <v-list-tile-action v-if="checkIfUserFav(result._id)">
              <v-icon>grade</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>

      <v-spacer></v-spacer>

      <!-- Horizontal Navbar Links -->
      <v-toolbar-items>
        <v-btn flat v-for="item in horizontalNavItems" :key="item.title" :to="item.link">
          <v-icon left>{{item.icon}}</v-icon>
        </v-btn>


        <!-- Profile Button -->
        <v-btn flat to="/profile" v-if="user">
          <v-icon>account_circle</v-icon>
          <v-badge right color="blue darken-2" :class="{'bounce': badgeAnimated}">
            <span slot="badge" v-if="userFavorites.length">{{userFavorites.length}}</span>
          </v-badge>
        </v-btn>

        <!-- Sign Out Button -->
        <v-btn flat v-if="user" @click="handleSignoutUser">
          <v-icon left>exit_to_app</v-icon>

        </v-btn>

      </v-toolbar-items>
    </v-toolbar>

    <!-- App Content -->
    <main>
      <v-container class="mt-4">
        <transition name="fade">
          <router-view />
        </transition>

        <!-- Signin Snackbar -->
        <v-snackbar v-model="authSnackbar" color="success" :timeout="5000" bottom right>
          <v-icon class="mr-3">check-circle</v-icon>
          <h3>¡Has iniciado Sesión!</h3>
          <v-btn dark flat @click="authSnackbar = false">Cerrar</v-btn>
        </v-snackbar>

        <!-- Auth Error Snackbar -->
        <v-snackbar v-if="authError" v-model="authErrorSnackbar" color="warning" :timeout='5000' bottom right>
          <v-icon class="mr-3">cancel</v-icon>
          <h3>{{authError.message}}</h3>
          <v-btn dark flat to="/signin">Sign in</v-btn>
        </v-snackbar>

      </v-container>
    </main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "App",
  data() {
    return {
      searchTerm: "",
      sideNav: false,
      authSnackbar: false,
      authErrorSnackbar: false,
      badgeAnimated: false
    };
  },
  watch: {
    user(newValue, oldValue) {
      if (oldValue === null) {
        this.authSnackbar = true;
      }
    },
    authError(value) {
      // if auth error is not null, show auth error snackbar
      if (value !== null) {
        this.authErrorSnackbar = true;
      }
    },
    userFavorites(value) {
      // User favorites change
      if (value) {
        this.badgeAnimated = true;
        setTimeout(() => (this.badgeAnimated = false), 1000);
      }
    }
  },
  computed: {
    ...mapGetters(["searchResults", "authError", "user", "userFavorites"]),
    horizontalNavItems() {
      let items = [
        { icon: "list", link: "/posts" },
        { icon: "lock_open", link: "/signin" },
        { icon: "create", link: "/signup" }
      ];
      if (this.user) {
        items = [
          { icon: "list", link: "/posts" },
          { icon: "tab", link: "post/add" }
        ];
      }
      return items;
    },
    sideNavItems() {
      let items = [
        { icon: "list", title: "Publicaciones", link: "/posts" },
        { icon: "lock_open", title: "Inicia Sesión", link: "/signin" },
        { icon: "create", title: "Registrate", link: "/signup" }
      ];
      if (this.user) {
        items = [
          { icon: "list", title: "Publicaciones", link: "/posts" },
          { icon: "tab", title: "Publicar", link: "/post/add" },
          { icon: "account_circle", title: "Perfil", link: "/profile" }
        ];
      }
      return items;
    }
  },
  methods: {
    goToSeachResult(resultId) {
      this.searchTerm = "";
      this.$router.push(`/posts/${resultId}`);
      this.$store.commit("clearSearchResults");
    },
    handleSearchPosts() {
      this.$store.dispatch("searchPosts", {
        searchTerm: this.searchTerm
      });
    },
    formatDescription(description) {
      return description.length > 15
        ? `${description.slice(0, 15)}...`
        : description;
    },
    toggleSideNav() {
      this.sideNav = !this.sideNav;
    },
    handleSignoutUser() {
      this.$store.dispatch("signoutUser");
    },
    checkIfUserFav(resultId) {
      return (
        this.userFavorites &&
        this.userFavorites.some(fave => fave._id === resultId)
      );
    }
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

/* Search results */
#search__card {
  position: absolute;
  width: 100vw;
  z-index: 8;
  top: 100%;
  left: 0%;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.bounce {
  animation: bounce 1s both;
}

@keyframe bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    transform: translate3d(0, -20px, 0);
  }
  70% {
    transform: translate3d(0, -10px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}
</style>
