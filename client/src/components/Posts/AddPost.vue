<template>
  <v-container text-xs-center mt-5 pt-5>
    <!-- AddPost  Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="primary--text">Nueva Publicación</h1>
      </v-flex>
    </v-layout>

    <!-- Post  -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>

        <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleAddPost">

          <!-- Title Input -->
          <v-layout row>
            <v-flex xs12>
              <v-text-field :rules="titleRules" v-model="title" label="Título" type="text" required></v-text-field>
            </v-flex>
          </v-layout>

          <!-- Image Url Input -->

          <v-layout row>

            <v-flex xs12>
              <v-text-field :rules="imageRules" v-model="imageUrl" label="URL de la Imagen" type="text" required></v-text-field>
            </v-flex>
          </v-layout>

          <!-- Image Preview -->
          <v-layout row>
            <v-flex xs12>
              <img :src="imageUrl" height="300px">
            </v-flex>
          </v-layout>

          <!-- Categories Select  -->

          <v-layout row>
            <v-flex xs12>
              <v-select v-model="categories" :rules="categoriesRules" :items="['Arte', 'Comida', 'Educación', 'Viajes', 'Fotografía', 'Tecnología']" multiple label='Categories'></v-select>
            </v-flex>
          </v-layout>

          <!-- Description Input -->
          <v-layout row>
            <v-flex xs12>
              <v-textarea :rules="descriptionRules" v-model="description" label='Agrega una Descripción' type='text' required></v-textarea>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-btn :loading="loading" :disabled="!isFormValid || loading" color="info" type="submit">
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>

                Publicar</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AddPost",
  data() {
    return {
      isFormValid: true,
      title: "",
      imageUrl: "",
      categories: [],
      description: "",
      titleRules: [
        title => !!title || "¡Ingresa un título!",
        title =>
          title.length < 20 || "El título debe ser menor a 20 caracteres."
      ],
      imageRules: [image => !!image || "Ingresa la URL de tu imagen"],
      categoriesRules: [
        categories =>
          categories.length >= 1 || "Debes ingresar al menos una categoría."
      ],
      descriptionRules: [
        description => !!description || "Agrega una descripción.",
        description =>
          description.length < 100 ||
          "La descripción debe ser menor a 100 caracteres."
      ]
    };
  },
  methods: {
    handleAddPost() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("addPost", {
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description,
          creatorId: this.user._id
        });
        this.$router.push("/");
      }
    }
  },
  computed: {
    ...mapGetters(["loading", "user"])
  }
};
</script>
