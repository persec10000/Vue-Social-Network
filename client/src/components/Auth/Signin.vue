<template>
  <v-container text-xs-center mt-5 pt-5>
    <!-- Sign In Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>¡Bienvenido!</h1>
      </v-flex>
    </v-layout>

    <!-- Sigin Form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card color="secondary" dark>
          <v-container>
            <v-form @submit.prevent="handleSigninUser">
              <v-layout row>
                <v-flex xs12>
                  <v-text-field v-model="username" prepend-icon="face" label="username" type="text" required></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field v-model="password" prepend-icon="extension" label="Password" type="password" required></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-btn color="accent" type="submit">Iniciar Sesión</v-btn>
                  <h3>¿No tienes una cuenta?</h3>
                  <router-link to="/signup">Registrate</router-link>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "Signin",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    handleSigninUser() {
      this.$store.dispatch("signinUser", {
        username: this.username,
        password: this.password
      });
    }
  }
};
</script>
