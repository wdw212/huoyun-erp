<template>
	<div id="boxInfo" class="flex1" style="width: 100%;height: 800px;">
		
		<el-card class="mr-2 h-100" style="padding: 8px 10px;">
			<template #header>
				<el-row justify="space-between" class="pb">
					<span class="font-16">箱号列表</span>
					<el-text type="primary" class="hand" @click="addBox">添加箱号</el-text>
				</el-row>
			</template>
			<el-aside width="200px">
			<!-- {{boxList.length}}--{{props.isOperate}} -->
				<div v-for="(item, index) in state.boxList" :key="index"
					style="display: flex;justify-content: space-between;align-items: center;">
					<el-text size="large" class="hand"
					:type="boxIndex==index?'primary':''" @click="changeBox(index)">
						{{item.no}}
					</el-text>
					<view v-if="state.boxList.length> 1">
						<el-button type="danger" plain size="mine" @click="deleteBox">删除</el-button>
					</view>
					
					<!-- <el-popconfirm class="box-item" title="是否删除选中项" @confirm="deleteBox"
					:disabled="props.isOperate&&boxIndex==index?false:true">
						<template #reference>
							
						</template>
					</el-popconfirm> -->
				</div>
			</el-aside>
		</el-card>
		
		<div class="flex-1" style="height: 100%;overflow-y: auto;">
			<common-form ref="boxInfoForm" :formList="formListBox" @confirm="confirmSubmit" :tabShow="false" :btnShow="false" @itemChange="itemChange">
				<!-- 进港数据 -->
				<template #arrivalPort="{saveData,formList}">
					<el-form-item style="width: 100%;" label="进港数据" label-width="auto">
						<el-button type="primary" @click="">生成</el-button>
					</el-form-item>
				</template>
				<!-- 件毛体 -->
				<template #containerItemsBtn="{saveData,formList}">
					<el-form-item style="width: 100%;" label="件毛体" label-width="auto">
						<el-button type="primary" @click="addTableList1">新增</el-button>
					</el-form-item>
				</template>
				<template #containerItemsTable="{saveData,formList}">
					<table-list :tableConfig="tableConfig1" :tableColumn="tableColumn1" :multiple="false" :border="true" ref="tableListJMT" class="mb-2">
						<template #bottomCon="{tableData}">
							<el-row :gutter="20">
								<el-col class="p-r" v-for="(item,index) in tableData" :key="index" :span="8">
									<el-input v-model="tableData[index].remark" :rows="3" type="textarea" placeholder="请输入" resize="none" class="mt-1"/>
								</el-col>
							</el-row>
						</template>
					</table-list>
				</template>
				<!-- 装柜地址 -->
				<template #loadingAddress="{saveData,formList}">
					<el-form-item style="width: 100%;" label="装柜地址" label-width="auto">
						<el-button type="primary" @click="addTableList2">新增</el-button>
					</el-form-item>
				</template>
				<template #loadingAddressTable="{saveData,formList}">
					<table-list :tableConfig="tableConfig2" :tableColumn="tableColumn2" :multiple="false" :border="true" ref="tableListZGDZ">
						<template #bottomCon="{tableData}">
							<el-row :gutter="20">
								<el-col class="p-r" v-for="(item,index) in tableData" :key="index" :span="8">
									<el-input v-model="tableData[index].remark" :rows="3" type="textarea" placeholder="请输入" resize="none" class="mt-1"/>
								</el-col>
							</el-row>
						</template>
					</table-list>
				</template>
				<!-- 装柜数据 -->
				<template #loadingInfo="{saveData,formList}">
					<el-form-item style="width: 100%;" label="装柜数据" label-width="auto">
						<el-button type="primary" @click="">生成</el-button>
					</el-form-item>
				</template>
				<!-- 装箱单 -->
				<template #packingList="{saveData,formList}">
					<el-form-item style="width: 100%;" label="装箱单" label-width="auto">
						<el-button type="primary" @click="openPackForm=true">生成</el-button>
					</el-form-item>
				</template>
			</common-form>
		</div>
		
		<el-dialog v-model="openPackForm" width="1400px" append-to-body>
			<PackForm v-if="openPackForm"></PackForm>
		</el-dialog>
		
	</div>
</template>

<script setup>
	import {
		ref,
		defineProps,
		watch,
		defineExpose,
		defineEmits,
		onMounted,
		reactive
	} from "vue";
	import {
		Calendar,
		Search
	} from '@element-plus/icons-vue'
	import {
		httpPost,
		httpGet
	} from '@/api/apiCommon';
	import { optionsComm, getCGS, getMT, getCHD, getXZLX, getLX } from '@/api/commonList';
	import CommonForm from "@/components/commonForm/index";
	import TableList from "@/components/tableList/index";
	import PackForm from '@/components/PackForm.vue'
	import { detailInfo } from '@/utils/common'
	
	const { proxy } = getCurrentInstance();
	const props = defineProps({
		isOperate: {
			type: Boolean,
			default: () => {
				return true
			}
		},
	})
	
	const MT = ref([]);
	const CHD = ref([]);
	const XZLX = ref([]);
	const YT = ref([]);
	const LX = ref([]);
	
	const formListBox = ref([]);
	
	onMounted(async () => {
		console.log('boxInfo', props);
		MT.value = await getMT();
		CHD.value = await getCHD();
		XZLX.value = await getXZLX();
		YT.value = await getLX({type: '0'});
		LX.value = await getLX({type: 1});
		formList.value[0].formData[0].formItem[2].options = XZLX.value;
		formList.value[0].formData[0].formItem[4].options = YT.value;
		formList.value[0].formData[0].formItem[5].options = MT.value;
		formList.value[0].formData[0].formItem[6].options = LX.value;
		formList.value[0].formData[0].formItem[12].options = CHD.value;
		formListBox.value = JSON.parse(JSON.stringify(formList.value));
		proxy.$refs.boxInfoForm.resetKey(formListBox.value);
	})
	
	const openPackForm = ref(false);
	
	const state = reactive({
		boxList: [],      //箱子列表数据
	});
	const boxIndex = ref(0);   //选中箱子列表下标
	// 添加箱号
	const addBox = (isNew) => {
		var data = {
			cargo_weight: '',
			container_type_id: '',
			driver: '',
			drop_off_wharf_id: '',
			fleet_id: '',
			is_entered_port: '',
			loading_at: '',
			no: '箱号',
			pre_pull_wharf_id: '',
			seal_number: '',
			serial_number: '',
			wharf_id: '',
			container_items: [],
			container_loading_address: []
		}
		state.boxList.push(data);
		// console.log('boxList新增', state.boxList)
	}
	// 切换选中箱号
	const changeBox = (index) => {
		boxIndex.value = index;
		proxy.$refs.boxInfoForm.resetKey(formListBox.value, true);
		proxy.$refs.boxInfoForm.changeSave(state.boxList[index]);
		// console.log('boxList', state.boxList, proxy.$refs.boxInfoForm.saveData)
	}
	// 删除选中箱号
	const deleteBox = () => {
		state.boxList.splice(boxIndex.value, 1);
		boxIndex.value = 0;
		proxy.$refs.boxInfoForm.changeSave(state.boxList[0]);
		// console.log('boxList', state.boxList, proxy.$refs.boxInfoForm.saveData)
	}
	//箱子数据回显
	const defaultBox = (val) => {
		Object.assign(state.boxList, val);
		if(val.length>0){
			boxIndex.value = 0;
			proxy.$refs.boxInfoForm.changeSave(state.boxList[0]);
		}
		console.log('boxList', state.boxList)
	}
	
	//单据信息变更
	const itemChange = (data) => {
		Object.assign(state.boxList[boxIndex.value], data);
		var newBox = JSON.parse(JSON.stringify(state.boxList));
		emit('boxInfoChange', newBox);
		// console.log('单据信息变更', data, state.boxList)
	}
	// 单据信息提交
	const confirmSubmit = (data) => {
		console.log('确认提交', data)
	}

	const formList = ref([
		{
			tabName: '',
			formData:[
				{
					formItem: [
						{ type: 'input',value: '',label: '箱号',placeholder: '请输入箱号',key: 'no'},
						{ type: 'input',value: '',label: '封号',placeholder: '请输入封号',key: 'seal_number' },
						{ type: 'select',value: '',label: '柜型',placeholder: '请选择柜型',key: 'container_type_id',options: [], labelName: 'name', valueName: 'id' },
						{ type: 'input',value: '',label: '序列号',placeholder: '请输入序列号',key: 'serial_number' },
						{ type: 'select',value: '',label: '预提',placeholder: '请选择预提',key: 'pre_pull_wharf_id',options: [], labelName: 'name', valueName: 'id' },
						{ type: 'select',value: '',label: '提箱码头',placeholder: '请选择提箱码头',key: 'wharf_id',options: [], labelName: 'name', valueName: 'id' },
						{ type: 'select',value: '',label: '落箱',placeholder: '请选择落箱',key: 'drop_off_wharf_id',options: [], labelName: 'name', valueName: 'id' },
						{ type: 'select',value: '',label: '是否进港',placeholder: '请选择是否进港',key: 'is_entered_port',options: optionsComm['是否进港'] },
						{ type: 'input',value: '',label: '司机信息',placeholder: '请输入司机信息',key: 'driver' },
						{ label: '进港数据', soltName: 'arrivalPort' },
						{ label: '件毛体', soltName: 'containerItemsBtn' },
						{ soltName: 'containerItemsTable', value: [], span: 24 },
						{ type: 'select',value: '',label: '车队',placeholder: '请选择车队',key: 'fleet_id',options: [], labelName: 'name', valueName: 'id' },
						{ type: 'input',value: '',label: '货重',placeholder: '请输入货重',key: 'cargo_weight' },
						{ type: 'dateTime',value: '',label: '装柜时间',placeholder: '请选择装柜时间',key: 'loading_at', format: 'YYYY-MM-DD HH:mm' },
						{ span: 6 },
						{ label: '装柜地址', soltName: 'loadingAddress' },
						{ label: '装柜数据', soltName: 'loadingInfo' },
						{ label: '装箱单', soltName: 'packingList' },
						{ soltName: 'loadingAddressTable', value: [], span: 24 },
					]
				}
			]
		},
	]);
	
	//件毛体表格数据
	const tableConfig1 = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: false
	})
	const tableColumn1 = ref([
		{
			label: '提单号', prop: 'bl_no',type: 'edit',width: '350px',
			form: {
				type: 'input',key: 'bl_no',popover:true
			}
		},
		{label: '件数', type: 'edit', prop: 'quantity',
			form: {
				type: 'input',key: 'quantity',
			}
		},
		{label: '毛重', type: 'edit', prop: 'gross_weight',
			form: {
				type: 'input',key: 'gross_weight',
			}
		},
		{label: '体积', type: 'edit', prop: 'volume',
			form: {
				type: 'input',key: 'volume'
			}
		},
		{
			label: '操作',
			prop: 'actions',
			actions: [{
				label: '删除',
				type: 'danger',
				icon: 'delete',
				onClick: (row, index) => delete1(row, index)
			}],
			width: '80px'
		}
	]);
	const addTableList1 = () => {
		console.log('tableListJMT', proxy.$refs.tableListJMT.tableData);
		proxy.$refs.tableListJMT.tableData.push({
			bl_no: '箱号',  //提单号
			quantity: '', //件数
			gross_weight: '', //毛重
			volume: '', //体积
			remark: '', //备注
		});
	}
	const delete1 = (row) => {
		const rowIndex = proxy.$refs.tableListJMT.tableData.findIndex(item => item === row);
		proxy.$refs.tableListJMT.tableData.splice(row.index, 1)
		// console.log('paymentDelete', row, rowIndex)
	}
	
	//装柜地址表格数据
	const tableConfig2 = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: false
	})
	const tableColumn2 = ref([
		{
			label: '装柜地址', prop: 'loading_address',type: 'edit',
			form: {
				type: 'select',key: 'loading_address',options: [],popover:true
			}
		},
		{label: '地址', type: 'edit', prop: 'address',
			form: {
				type: 'input',key: 'address',
			}
		},
		{label: '联系人', type: 'edit', prop: 'contact_name',width: '260px',
			form: {
				type: 'input',key: 'contact_name',
			}
		},
		{label: '联系电话', type: 'edit', prop: 'phone',width: '260px',
			form: {
				type: 'input',key: 'phone',
			}
		},
		{
			label: '操作',
			prop: 'actions',
			actions: [{
				label: '删除',
				type: 'danger',
				icon: 'delete',
				onClick: (row, index) => delete2(row, index)
			}],
			width: '80px'
		}
	]);
	const addTableList2 = () => {
		proxy.$refs.tableListZGDZ.tableData.push({
			loading_address: '',
			address: '',
			contact_name: '',
			phone: '',
			remark: ''
		});
	}
	const delete2 = (row) => {
		const rowIndex = proxy.$refs.tableListZGDZ.tableData.findIndex(item => item === row);
		proxy.$refs.tableListZGDZ.tableData.splice(row.index, 1)
		// console.log('paymentDelete', row, rowIndex)
	}

	const emit = defineEmits(['boxInfoChange'])
	defineExpose({
		defaultBox,
		addBox
	})
</script>

<style>
	#boxInfo .el-aside{
		padding: 8px 10px
	}
</style>