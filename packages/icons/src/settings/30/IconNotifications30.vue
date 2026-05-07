<script setup lang="ts">
/* eslint-disable */
export interface IconNotifications30Props {
  size?: string | number;
}

const { size = 30 } = defineProps<IconNotifications30Props>();
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 30" :width="size" :height="size"><rect width="30" height="30" fill="#ff3b30" rx="8"/><path fill="#fff" d="M17.5 22a2.5 2.5 0 0 1-5 0zM15 5c.834 0 1.602.429 2.045 1.123a4.83 4.83 0 0 0 4.572 8.074l.203 2.027a5 5 0 0 0 1.44 3.038l.03.031c.63.63.184 1.707-.706 1.707H7.412c-.891 0-1.337-1.077-.707-1.707l.031-.031a5 5 0 0 0 1.44-3.038l.551-5.522a4 4 0 0 1 2.882-3.448l.479-.136a.98.98 0 0 0 .604-.502l.137-.274A2.43 2.43 0 0 1 14.999 5m5.498 1a3.5 3.5 0 1 1-3.466 3.013l.004-.033.014-.084.015-.084.016-.07.021-.096.025-.09.018-.063a3.5 3.5 0 0 1 .227-.568l.02-.042q.065-.122.139-.24l.019-.03q.075-.12.162-.232l.025-.032q.088-.113.184-.218l.008-.008A3.5 3.5 0 0 1 20.498 6"/></svg>
</template>