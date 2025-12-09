<script setup >
  import { ref, computed } from 'vue'
  const props = defineProps({title: String, tutorialText: String, next: Boolean, left: String, top: String})
  const emit = defineEmits(['next','close']);
  const buttonText = computed(() => {
     if (props.next) {
        return 'Cancel';
     } else {
        return 'Close'
     }
  })

  const style = computed(() => {
     return 'left: ' + 
     props.left + 'px; top: ' +
     props.top + 'px;'
  }) 
  const top = computed(() => {
    return props.top + 'px';
  })
  const left = computed(() => {
    return props.left + 'px';
  })

</script>

<template>
  
  <div class="popup"> 
    <div class="title"><span class="arrow">⬅</span><span class="title-span">{{ title }}</span></div>
    <div class="tutorial">{{ props.tutorialText }}</div>
    <div class="button">
      <button v-if="props.next" @click="emit('next')">Next</button>
      <button v-text="buttonText" @click="emit('close')"></button>
    </div>
  </div>
  
</template>

<style scoped>
.title {
  display: flex;
  flex-direction: row;
  gap: 10px;
  height: 30px;
}
.title-span {
  font-size: 20px;
  line-height: 1;
  display: inline-block;
  height: 20px;
  margin: 0px;
  margin-top: 2px;
  margin-bottom: 4px;
}
.popup {
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
  border-style: solid;
  border-width: 3px;
  border-radius: 8px;
  border-color: #775080;
  padding: 15px;
  position: absolute;
  top: v-bind('top');
  left: v-bind('left');
  background: white;
  width: 195px;
  z-index: 1;
}
.tutorial {
  display: flex;
  margin-bottom: 8px;
  justify-content: left;
  text-align: left;
}
.arrow {
  font-size: 2em;
  position: relative;
  top: -7px;
}
button {
  margin-right: 2px;
}
</style>
