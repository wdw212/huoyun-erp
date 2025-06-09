<template>
	<div class="app-container">
		<!-- 特殊费用计算比例K值 特殊费用税点 销货单位 美金每月汇率 操作费 自定义费用每周统计 超期时间 -->
		<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
			<el-tab-pane label="特殊费用计算比例K值" name="特殊费用计算比例K值">
				<specialCostRates />
			</el-tab-pane>
			<el-tab-pane label="特殊费用税点" name="特殊费用税点">
				<specialTaxRates />
			</el-tab-pane>
			<el-tab-pane label="销货单位" name="sellers">
				<sellers />
			</el-tab-pane>
			<el-tab-pane label="美金每月汇率" name="美金每月汇率">
				<usdExchangeRates />
			</el-tab-pane>
			<el-tab-pane label="操作费" name="操作费">
				<operationFees></operationFees>
			</el-tab-pane>
			<el-tab-pane label="自定义费用每周统计" name="自定义费用每周统计">自定义费用每周统计</el-tab-pane>
			<el-tab-pane label="超期时间" name="超期时间">超期时间</el-tab-pane>
			<el-tab-pane label="单据类型" name="单据类型">
				<orderTypes />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup name="SystemParameter">
	import {
		ref
	} from 'vue'
	import sellers from './sellers.vue'
	import specialCostRates from './special-cost-rates.vue'
	import specialTaxRates from './special-tax-rates.vue'
	import usdExchangeRates from './usd-exchange-rates.vue'
	import orderTypes from './order-types.vue'
	import operationFees from './operation-fees.vue'

	const activeName = ref('特殊费用计算比例K值')

	const handleClick = (tab, event) => {
		// console.log(tab, event)
	}
</script>

<style>
</style>