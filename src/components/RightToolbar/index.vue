<template>
	<div>
		<el-row :gutter="10" class="mb-1">
			<el-col :span="1.5">
				<el-button icon="Refresh" plain @click="refresh()">刷新</el-button>
			</el-col>

			<el-col :span="1.5" v-if="columns">
				<el-button icon="Menu" plain @click="showColumn()" v-if="showColumnsType == 'transfer'">列设置</el-button>
				<el-dropdown trigger="click" :hide-on-click="false" v-if="showColumnsType == 'checkbox'">
					<el-button plain icon="Menu">列设置</el-button>
					<template #dropdown>
						<el-dropdown-menu>
							<template v-for="item in columns" :key="item.key">
								<el-dropdown-item>
									<el-checkbox :checked="item.visible" @change="checkboxChange($event, item.label)"
										:label="item.label" />
								</el-dropdown-item>
							</template>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</el-col>
		</el-row>
		<el-dialog :title="title" v-model="open" append-to-body>
			<el-transfer :titles="['显示', '隐藏']" v-model="value" :data="columns" @change="dataChange"></el-transfer>
		</el-dialog>
	</div>
</template>

<script setup>
	const props = defineProps({
		/* 是否显示检索条件 */
		showSearch: {
			type: Boolean,
			default: true,
		},
		/* 显隐列信息 */
		columns: {
			type: Array,
		},
		/* 是否显示检索图标 */
		search: {
			type: Boolean,
			default: true,
		},
		/* 显隐列类型（transfer穿梭框、checkbox复选框） */
		showColumnsType: {
			type: String,
			default: "checkbox",
		},
		/* 右外边距 */
		gutter: {
			type: Number,
			default: 10,
		},
	})

	const emits = defineEmits(['update:showSearch', 'queryTable']);

	// 显隐数据
	const value = ref([]);
	// 弹出层标题
	const title = ref("显示/隐藏");
	// 是否显示弹出层
	const open = ref(false);

	const style = computed(() => {
		const ret = {};
		if (props.gutter) {
			ret.marginRight = `${props.gutter / 2}px`;
		}
		return ret;
	});

	// 搜索
	function toggleSearch() {
		emits("update:showSearch", !props.showSearch);
	}

	// 刷新
	function refresh() {
		emits("queryTable", 1);
	}

	// 右侧列表元素变化
	function dataChange(data) {
		for (let item in props.columns) {
			const key = props.columns[item].key;
			props.columns[item].visible = !data.includes(key);
		}
	}

	// 打开显隐列dialog
	function showColumn() {
		open.value = true;
	}

	if (props.showColumnsType == 'transfer') {
		// 显隐列初始默认隐藏列
		for (let item in props.columns) {
			if (props.columns[item].visible === false) {
				value.value.push(parseInt(item));
			}
		}
	}

	// 勾选
	function checkboxChange(event, label) {
		props.columns.filter(item => item.label == label)[0].visible = event;
		emits("queryTable", 2);
	}
</script>

<style lang='scss' scoped>
	:deep(.el-transfer__button) {
		border-radius: 50%;
		display: block;
		margin-left: 0px;
	}

	:deep(.el-transfer__button:first-child) {
		margin-bottom: 10px;
	}

	:deep(.el-dropdown-menu__item) {
		line-height: 30px;
		padding: 0 17px;
	}
</style>