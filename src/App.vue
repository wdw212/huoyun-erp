<template>
  <router-view />
</template>

<script setup>
import useSettingsStore from '@/store/modules/settings'
import { handleThemeStyle } from '@/utils/theme'

onMounted(() => {
  nextTick(() => {
    // 初始化主题样式
    handleThemeStyle(useSettingsStore().theme)
  })
})
</script>
<style>
	.el-overlay{
		left: 200px;
		top: 83px;
	}
	.el-overlay-dialog{
		position: absolute;
		overflow-y: auto;
		padding: 0 0 100px;
	}
</style>
