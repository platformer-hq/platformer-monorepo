<script setup lang="ts">
import * as v from 'valibot';

definePageMeta({
  name: 'app-function',
  validate(route) {
    const idSchema = v.pipe(v.string(), v.transform(Number), v.check(val => !Number.isNaN(val)));
    return v.is(
      v.looseObject({ appId: idSchema, fnId: idSchema }),
      route.params,
    );
  },
});

const route = useRoute();
const params = computed(() => {
  const idSchema = v.pipe(v.string(), v.transform(Number));
  return v.parse(
    v.looseObject({ appId: idSchema, fnId: idSchema }),
    route.params,
  );
});
</script>

<template>
  <AppFunctionPage v-bind="params"/>
</template>
