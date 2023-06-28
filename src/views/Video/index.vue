<template>
  <div>id: {{ id }}</div>
</template>

<script>
export default {
  name: "Video",
  data() {
    return {
      id: "",
    };
  },
  activated() {
    this.id = this.$route.params.id;
    console.log(this.$route.params.id);
  },
};
</script>
