<template>
  <v-container class="text-xs-center">
    <!-- user details -->
    <v-flex class="sm6 offset-sm3">
      <v-card class="white--text" color="secondary">
        <v-layout>
          <v-flex xs5>
            <v-card-media height="125px" contain :src="user.avatar"></v-card-media>
          </v-flex>

          <v-flex xs7>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{user.username}}</div>
                <div>Miembro desde: {{user.joinDate}}</div>
                <div class="hidden-xs-only font-weigth-thin">{{user.favorites.length}} Favoritos</div>
                <div class="hidden-xs-only font-weigth-thin">Publicaciones Agregadas: {{userPosts.length}} </div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>

    <!-- User's Favorites -->
    <v-container v-if="!userFavorites.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>No has dado Like en ninguna publicación.</h2>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container class="mt-3" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">Favoritos
          <span class="font-weight-regular">({{userFavorites.length}})</span>
        </h2>
      </v-flex>

      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="favorite in userFavorites" :key="favorite._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-card-media height="30vh" :src="favorite.imageUrl"></v-card-media>
            <v-card-text>{{favorite.title}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- User's Posts -->
    <v-container v-if="!userPosts.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>!No has añadido ninguna publicación!</h2>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container class="mt-3" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light"> Tus Publicaciones
          <span class="font-weight-regular">({{userPosts.length}})</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="post in userPosts" :key="post._id">
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-btn @click="loadPost(post)" color="info" floating fab small dark>
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn @click="handleDeleteUserPost(post)" color="error" floating fab small dark>
              <v-icon>delete</v-icon>
            </v-btn>

            <v-card-media height="30vh" :src="post.imageUrl"></v-card-media>
            <v-card-text>{{post.title}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- Edit Post Dialog -->
    <v-dialog xs12 sm6 offset-sm3 persistent v-model="editPostDialog">
      <v-card>
        <v-card-title class="headline grey lighten-2">Actualizar Post</v-card-title>
        <v-container>
          <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleUpdateUserPost">

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

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :disabled="!isFormValid" type="submit" class="success--text" flat>Actualizar</v-btn>
              <v-btn class="error--text" flat @click="editPostDialog = false">Cancelar</v-btn>
            </v-card-actions>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Profile",
  data() {
    return {
      editPostDialog: false,
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
  computed: {
    ...mapGetters(["user", "userFavorites", "userPosts"])
  },
  created() {
    this.handleGetUserPosts();
  },
  methods: {
    handleDeleteUserPost(post) {
      this.loadPost(post, false);
      const deletePost = window.confirm(
        "¿Estás segur@ que quieres eliminar esta publicación?"
      );
      if (deletePost) {
        this.$store.dispatch("deleteUserPost", {
          postId: this.postId
        });
      }
    },
    handleGetUserPosts() {
      this.$store.dispatch("getUserPosts", {
        userId: this.user._id
      });
    },
    handleUpdateUserPost() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("updateUserPost", {
          postId: this.postId,
          userId: this.user._id,
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description
        });
        this.editPostDialog = false;
      }
    },
    loadPost(
      { _id, title, imageUrl, categories, description },
      editPostDialog = true
    ) {
      this.editPostDialog = editPostDialog;
      this.postId = _id;
      this.title = title;
      this.imageUrl = imageUrl;
      this.categories = categories;
      this.description = description;
    }
  }
};
</script>
