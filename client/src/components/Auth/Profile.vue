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
                <div class="hidden-xs-only font-weigth-thin">Publicaciones Agregadas: </div>
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
          <span class="font-weight-regular">{{userFavorites.length}}</span>
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
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: "Profile",
  computed: {
    ...mapGetters(['user', 'userFavorites'])
  }
};
</script>
