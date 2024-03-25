<template>
  <!--begin::Row-->
  <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";


export default defineComponent({
  name: "main-dashboard",
  components: {
  },
  setup() {
    return {
      getAssetPath,
    };
  },
});
</script>
