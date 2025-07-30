<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
			<el-form-item label="名称" prop="log_name">
				<el-input v-model="queryParams.log_name" placeholder="请输入名称" clearable style="width: 240px;"
					@keyup.enter="handleQuery" />
			</el-form-item>

			<el-form-item label="描述" prop="description">
				<el-input v-model="queryParams.description" placeholder="请输入描述" clearable style="width: 240px;"
					@keyup.enter="handleQuery" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				<el-button icon="Refresh" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-table ref="operlogRef" v-loading="loading" :data="operlogList" @selection-change="handleSelectionChange"
			:default-sort="defaultSort" @sort-change="handleSortChange">
			<el-table-column type="selection" width="50" align="center" />
			<el-table-column label="编号" align="center" prop="id" />
			<el-table-column label="名称" align="center" prop="log_name" />
			<el-table-column label="描述" align="center" prop="description" />
			<el-table-column label="数据类型" align="center" prop="subject" />
			<el-table-column label="操作类型" align="center" prop="event" />
			<el-table-column label="操作前" align="center" prop="properties.old" />
			<el-table-column label="操作后" align="center" prop="properties.attributes" />
			<el-table-column label="操作日期" align="center" prop="created_at" width="180" sortable="custom"
				:sort-orders="['descending', 'ascending']">
				<template #default="scope">
					<span>{{ parseTime(scope.row.created_at) }}</span>
				</template>
			</el-table-column>
			<!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template #default="scope">
					<el-button link type="primary" icon="View" @click="handleView(scope.row, scope.index)"
						v-hasPermi="['monitor:operlog:query']">详细</el-button>
				</template>
			</el-table-column> -->
		</el-table>

		<pagination v-show="total > 0" :total="total" v-model:page="queryParams.page"
			v-model:limit="queryParams.pageSize" @pagination="getList" />

		<!-- 操作日志详细 -->
		<el-dialog title="操作日志详细" v-model="open" width="800px">
			<el-form :model="form" label-width="100px">
				<el-row>
					<el-col :span="12">
						<el-form-item label="操作模块：">{{ form.title }} / {{ typeFormat(form) }}</el-form-item>
						<el-form-item label="登录信息：">{{ form.operName }} / {{ form.operIp }} /
							{{ form.operLocation }}</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="请求地址：">{{ form.operUrl }}</el-form-item>
						<el-form-item label="请求方式：">{{ form.requestMethod }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="操作方法：">{{ form.method }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="请求参数：">{{ form.operParam }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="返回参数：">{{ form.jsonResult }}</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="操作状态：">
							<div v-if="form.status === 0">正常</div>
							<div v-else-if="form.status === 1">失败</div>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="消耗时间：">{{ form.costTime }}毫秒</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="操作时间：">{{ parseTime(form.operTime) }}</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="异常信息：" v-if="form.status === 1">{{ form.errorMsg }}</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="open = false">关 闭</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup name="Operlog">
	import {
		list
	} from "@/api/system/log";

	const {
		proxy
	} = getCurrentInstance();

	const operlogList = ref([]);
	const open = ref(false);
	const loading = ref(true);
	const showSearch = ref(true);
	const ids = ref([]);
	const single = ref(true);
	const multiple = ref(true);
	const total = ref(0);
	const title = ref("");
	const dateRange = ref([]);
	const defaultSort = ref({
		prop: "operTime",
		order: "descending"
	});

	const data = reactive({
		form: {},
		queryParams: {
			page: 1,
			pageSize: 15,
			log_name: undefined,
			description: undefined
		}
	});

	const {
		queryParams,
		form
	} = toRefs(data);

	/** 查询日志 */
	function getList() {
		loading.value = true;
		list(proxy.addDateRange(queryParams.value, dateRange.value)).then(response => {
			// console.log(response);
			operlogList.value = response.data;
			total.value = response.meta.total;
			loading.value = false;
		});
	}

	/** 搜索按钮操作 */
	function handleQuery() {
		queryParams.value.page = 1;
		getList();
	}

	/** 重置按钮操作 */
	function resetQuery() {
		dateRange.value = [];
		proxy.resetForm("queryRef");
		queryParams.value.page = 1;
		proxy.$refs["operlogRef"].sort(defaultSort.value.prop, defaultSort.value.order);
	}

	/** 排序触发事件 */
	function handleSortChange(column, prop, order) {
		queryParams.value.orderByColumn = column.prop;
		queryParams.value.isAsc = column.order;
		getList();
	}

	getList();
</script>