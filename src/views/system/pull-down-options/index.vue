<template>
	<div class="app-container">
		<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
			<el-tab-pane label="船公司" name="船公司">
				<shippingCompanies />
			</el-tab-pane>

			<el-tab-pane label="码头" name="码头">
				<wharves />
			</el-tab-pane>

			<el-tab-pane label="车队" name="车队">
				<fleets />
			</el-tab-pane>

			<el-tab-pane label="箱子类型" name="箱子类型">
				<containerTypes />
			</el-tab-pane>

			<el-tab-pane label="预落堆场码头" name="预落堆场码头">
				<yardWharves />
			</el-tab-pane>
			<el-tab-pane label="发票类型" name="发票类型">
				<invoiceType />
			</el-tab-pane>
			<el-tab-pane label="费用类型" name="开票明细">
				<invoiceForm />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup name="PullDownOptions">
	import {
		ref
	} from 'vue'
	import shippingCompanies from './shippingCompanies.vue'
	import wharves from './wharves.vue'
	import fleets from './fleets.vue'
	import containerTypes from './container-types.vue'
	import yardWharves from './yard-wharves.vue'
	import invoiceType from './invoiceType.vue'
	import invoiceForm from './invoiceForm.vue'

	const activeName = ref('船公司')

	const handleClick = (tab, event) => {
		// console.log(tab, event)
	}
</script>

<style>
</style>