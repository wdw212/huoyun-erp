<template>
	<router-view />
</template>

<script setup>
	import useSettingsStore from '@/store/modules/settings'
	// import autofit from 'autofit.js'
	import { ElPopover } from 'element-plus';
	import {
		handleThemeStyle
	} from '@/utils/theme'
	onMounted(() => {
		// autofit.init({
		// 	designHeight: 1080,
		// 	designWidth: 1920,
		// 	renderDom:"#app",
		// 	resize: true,
		// 	ignore:['div[class*="el-overlay"]']
		// 	// ignore: ['el-popper-container-']
		// })
		nextTick(() => {
			// 初始化主题样式
			handleThemeStyle(useSettingsStore().theme)
		})
	})
</script>
<style>
	body{
	    /* overflow: hidden; */
	}
	.el-overlay {
		left: 200px;
		top: 83px;
	}

	.el-overlay-dialog {
		position: absolute;
		overflow-y: auto;
		padding: 0 0 100px;
	}

	.cell,
	.el-input .el-input__inner,
	.el-select__placeholder {
		color: #000
	}
</style>