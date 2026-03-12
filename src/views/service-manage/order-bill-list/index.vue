<template>
	<div class="p-r">
		<el-card class="mb-2">
			<el-form :inline="true" :model="queryParams">
				<el-form-item label="关键字">
					<el-input
						v-model="queryParams.keyword"
						placeholder="委托人、工作编号、合同号"
						clearable
						style="width: 260px"
						@keyup.enter="handleSearch"
					/>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleSearch">搜索</el-button>
					<el-button @click="handleReset">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<table-list
			ref="tableListRef"
			:tableConfig="tableConfig"
			:tableColumn="tableColumn"
			toolbar
			class="px-2"
			:number="true"
			:multiple="false"
		/>

		<el-dialog
			v-model="detailVisible"
			title="账单详情"
			width="50%"
			class="order-bill-detail-dialog"
			top="5vh"
			:close-on-click-modal="false"
			append-to-body
			destroy-on-close
			@closed="handleDetailClosed"
		>
			<iframe
				v-if="detailVisible && detailFrameUrl"
				:key="detailFrameKey"
				:src="detailFrameUrl"
				class="order-bill-detail-frame"
			/>
		</el-dialog>

		<el-dialog
			v-model="copyVisible"
			title="复制账单"
			width="900px"
			:close-on-click-modal="false"
		>
			<el-card class="mb-2">
				<el-form :inline="true" :model="copyQueryParams">
					<el-form-item label="目标单据">
						<el-input
							v-model="copyQueryParams.keyword"
							placeholder="工作编号、提单号、起运港"
							clearable
							style="width: 260px"
							@keyup.enter="handleCopySearch"
						/>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleCopySearch">搜索</el-button>
						<el-button @click="handleCopyReset">重置</el-button>
					</el-form-item>
				</el-form>
			</el-card>

			<table-list
				ref="copyTableListRef"
				:tableConfig="copyTableConfig"
				:tableColumn="copyTableColumn"
				class="px-2"
				:number="true"
				:multiple="false"
			/>
		</el-dialog>
	</div>
</template>

<script setup>
	import { getCurrentInstance, ref } from 'vue'
	import TableList from '@/components/tableList/index.vue'
	import { httpDelete, httpGet, httpPost } from '@/api/apiCommon'

	const { proxy } = getCurrentInstance()
	const queryParams = ref({
		keyword: '',
	})

	const tableListRef = ref(null)
	const detailVisible = ref(false)
	const detailFrameUrl = ref('')
	const detailFrameKey = ref(0)
	const copyVisible = ref(false)
	const copySourceBill = ref(null)
	const copyTableListRef = ref(null)
	const copyQueryParams = ref({
		keyword: '',
	})

	const tableConfig = ref({
		url: '/order-bills',
		requestMethod: httpGet,
		isQuery: true,
		data: {},
	})

	const handleSearch = () => {
		tableConfig.value.data = {
			keyword: queryParams.value.keyword || '',
		}
		tableConfig.value.isQuery = true
	}

	const handleReset = () => {
		queryParams.value.keyword = ''
		handleSearch()
	}

	const openDetail = (row) => {
		detailFrameUrl.value = `/serive-management/serviceManageIndex?bill_id=${row.id}&embed=1&_t=${Date.now()}`
		detailFrameKey.value += 1
		detailVisible.value = true
	}

	const handleDetailClosed = () => {
		detailFrameUrl.value = ''
	}

	const openCopyDialog = (row) => {
		copySourceBill.value = row
		copyQueryParams.value.keyword = ''
		copyTableConfig.value.data = {
			exclude_order_id: row.order_id,
		}
		copyTableConfig.value.isQuery = true
		copyVisible.value = true
	}

	const handleCopySearch = () => {
		copyTableConfig.value.data = {
			keyword: copyQueryParams.value.keyword || '',
			exclude_order_id: copySourceBill.value?.order_id || '',
		}
		copyTableConfig.value.isQuery = true
	}

	const handleCopyReset = () => {
		copyQueryParams.value.keyword = ''
		handleCopySearch()
	}

	const handleCopyToOrder = (row) => {
		if (!copySourceBill.value?.id) return
		httpPost(`/order-bills/${copySourceBill.value.id}/copy-to-order`, {
			order_id: row.id,
		}).then(() => {
			proxy.$modal.msgSuccess('复制成功')
			copyVisible.value = false
			tableListRef.value?.getList()
		})
	}

	const handleDelete = (row) => {
		proxy.$modal.confirm('是否确认删除该账单？').then(() => {
			return httpDelete(`/order-bills/${row.id}`)
		}).then(() => {
			proxy.$modal.msgSuccess('删除成功')
			tableListRef.value?.getList()
		}).catch(() => {})
	}

	const tableColumn = ref([
		{
			label: '委托人',
			prop: 'delegation_header',
			formatter: (row) => row.delegation_header || '无',
			minWidth: '220',
		},
		{
			label: '工作编号',
			prop: 'job_no',
			minWidth: '120',
		},
		{
			label: '合同号',
			prop: 'contract_no',
			formatter: (row) => row.contract_no || '无',
			minWidth: '140',
		},
		{
			label: '人民币金额',
			prop: 'cny_amount',
			minWidth: '120',
		},
		{
			label: '美金金额',
			prop: 'usd_amount',
			minWidth: '120',
		},
		{
			label: '保存时间',
			prop: 'created_at',
			minWidth: '180',
		},
		{
			label: '操作',
			prop: 'actions',
			width: '220px',
			actions: [
				{
					label: '查看详情',
					type: 'primary',
					onClick: (row) => openDetail(row),
				},
				{
					label: '复制',
					type: 'warning',
					onClick: (row) => openCopyDialog(row),
				},
				{
					label: '删除',
					type: 'danger',
					onClick: (row) => handleDelete(row),
				},
			],
		},
	])

	const copyTableConfig = ref({
		url: '/orders/business-index',
		requestMethod: httpGet,
		isQuery: false,
		data: {},
	})

	const copyTableColumn = ref([
		{
			label: '工作编号',
			prop: 'job_no',
			minWidth: '140',
		},
		{
			label: '提单号',
			prop: 'bl_no',
			formatter: (row) => row.bl_no || '无',
			minWidth: '160',
		},
		{
			label: '目的港',
			prop: 'destination_port',
			formatter: (row) => row.destination_port || '无',
			minWidth: '140',
		},
		{
			label: '开船日期',
			prop: 'sailing_at',
			formatter: (row) => row.sailing_at || '无',
			minWidth: '120',
		},
		{
			label: '操作',
			prop: 'actions',
			width: '150px',
			actions: [
				{
					label: '复制到此单',
					type: 'primary',
					onClick: (row) => handleCopyToOrder(row),
				},
			],
		},
	])
</script>

<style scoped>
	.order-bill-detail-frame {
		width: 100%;
		height: min(68vh, 760px);
		border: 0;
		display: block;
		background: #fff;
	}

	:deep(.order-bill-detail-dialog) {
		max-width: 820px;
	}

	:deep(.order-bill-detail-dialog .el-dialog__body) {
		padding: 12px;
	}

	@media (max-width: 1440px) {
		:deep(.order-bill-detail-dialog) {
			max-width: 760px;
		}
	}
</style>
