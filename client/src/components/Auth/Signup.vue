<template>
  <v-container text-xs-center mt-5 pt-5>
    <!-- Signup Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>¡Crea tu cuenta!</h1>
      </v-flex>
    </v-layout>

    <!-- Error Alert -->
    <v-layout v-if="error" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <form-alert :message="error.message"></form-alert>
      </v-flex>
    </v-layout>

    <!-- Sigup Form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card color="accent" dark>
          <v-container>

            <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleSignupUser">

              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="usernameRules" v-model="username" prepend-icon="face" label="Usuario" type="text" required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="emailRules" v-model="email" prepend-icon="email" label="Email" type="text" required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="passwordRules" v-model="password" prepend-icon="extension" label="Contraseña" type="password" required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="passwordRules" v-model="passwordConfirmation" prepend-icon="gavel" label="Confirma tu contraseña" type="password" required></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-btn :loaging="loading" :disabled="!isFormValid || loading" color="info" type="submit">
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>

                    Registrarme</v-btn>
                  <h3>¿Ya tienes una cuenta?</h3>
                  <router-link to="/signup">Registrarme</router-link>
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
import { mapGetters } from "vuex";

export default {
  name: "Signup",
  data() {
    return {
      isFormValid: true,
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      usernameRules: [
        username => !!username || "Crea tu nombre de usuario.",
        username =>
          username.length < 10 ||
          "Tu nombre de usuario debe ser menor a 10 caracteres."
      ],
      emailRules: [
        email => !!email || "Ingresa tu email.",
        email => /.@+./.test(email) || "Ingresa un email válido."
      ],
      passwordRules: [
        password => !!password || "Crea tu contraseña",
        password =>
          password.length > 4 ||
          "Tu contraseña debe conterner al menos 4 caracteres.",
        confirmation =>
          confirmation === this.password ||
          "Las contraseñas no coinciden, por favor vuelve a intentarlo."
      ]
    };
  },
  watch: {
    user(value) {
      // if user value changes, redirect to home page
      if (value) {
        this.$router.push("/");
      }
    }
  },
  computed: {
    ...mapGetters(["error", "loading", "user"])
  },
  methods: {
    handleSignupUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("signupUser", {
          username: this.username,
          email: this.email,
          password: this.password
        });
      }
    }
  }
};
</script>
