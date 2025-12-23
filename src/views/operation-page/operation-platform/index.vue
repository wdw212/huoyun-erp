<template>
	<div class="app-container">
		<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
			<el-tab-pane label="截单" name="截单">
				<orderCutOff />
			</el-tab-pane>
	
			<el-tab-pane label="查开港" name="查开港">
				<checkOpenPort />
			</el-tab-pane>
	
			<el-tab-pane label="排车" name="排车">
				<carArrangement />
			</el-tab-pane>
	
			<el-tab-pane label="单子信息" name="单子信息">
				<formInfo />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup name="OperationPlatform">
	import orderCutOff from './components/order-cut-off.vue'
	import checkOpenPort from './components/check-open-port.vue'
	import carArrangement from './components/car-arrangement.vue'
	import formInfo from './components/form-info.vue'
	const activeName = ref('截单')
	
</script>

<style>
</style>