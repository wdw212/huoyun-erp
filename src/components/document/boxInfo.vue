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
				<div v-for="(item, index) in state.boxList" :key="index" @click="changeBox(index)"
				style="display: flex;justify-content: space-between;align-items: center;">
					<el-text class="hand" :type="boxIndex==index?'primary':''" >
						{{item.no}}
					</el-text>
					<view v-if="state.boxList.length> 1">
						<el-button type="danger" plain size="small" @click="deleteBox">删除</el-button>
					</view>
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
					<table-list :tableConfig="tableConfig2" :tableColumn="tableColumn2" :multiple="false" :border="true" ref="tableListZGDZ" @tableItemChange="tableItemChange">
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
						<el-button type="primary" @click="createLoading">生成</el-button>
					</el-form-item>
					<container-loading ref="containerLoading"></container-loading>
				</template>
				<!-- 装箱单 -->
				<template #packingList="{saveData,formList}">
					<el-form-item style="width: 100%;" label="装箱单" label-width="auto">
						<el-button type="primary" @click="openPackForm=true">生成</el-button>
					</el-form-item>
				</template>
			</common-form>
		</div>
		
		<el-dialog v-model="openPackForm" width="1400px">
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
	import { optionsComm, getCGS, getMT, getCHD, getXZLX, getLX, getZGDZ } from '@/api/commonList';
	import CommonForm from "@/components/commonForm/index";
	import TableList from "@/components/tableList/index";
	import PackForm from '@/components/document/PackForm.vue'
	import containerLoading from '@/components/document/containerLoading.vue'
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
	
	const MT = ref([]); //码头
	const CHD = ref([]); //车队
	const XZLX = ref([]); //箱子类型
	const YT = ref([]); //预提
	const LX = ref([]); //落箱
	const ZGDZ = ref([]);  //装柜地址
	
	const formListBox = ref([]);
	
	onMounted(async () => {
		console.log('boxInfo', props);
		MT.value = await getMT();
		CHD.value = await getCHD();
		XZLX.value = await getXZLX();
		YT.value = await getLX({type: '0'});
		LX.value = await getLX({type: 1});
		ZGDZ.value = await getZGDZ();
		formList.value[0].formData[0].formItem[2].options = XZLX.value;
		formList.value[0].formData[0].formItem[4].options = YT.value;
		formList.value[0].formData[0].formItem[5].options = MT.value;
		formList.value[0].formData[0].formItem[6].options = LX.value;
		formList.value[0].formData[0].formItem[13].options = CHD.value;
		formListBox.value = JSON.parse(JSON.stringify(formList.value));
		
		tableColumn2.value[0].form.options = ZGDZ.value;
		proxy.$refs.boxInfoForm.resetKey(formListBox.value);
	})
	
	const openPackForm = ref(false);
	
	const state = reactive({
		boxList: [],      //箱子列表数据
		saveData: {},    //单据数据
		options: {},     //下拉选项值
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
			is_entered_port: '0',
			loading_at: '',
			no: '箱号',
			pre_pull_wharf_id: '',
			seal_number: '',
			serial_number: '',
			wharf_id: '',
			container_items: [],
			container_loading_address: [],
			
			freight_status: '',
			freight_remark: ''
		}
		state.boxList.push(data);
		boxIndex.value = state.boxList.length-1;
		proxy.$refs.boxInfoForm.changeSave(data);
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
		// console.log('boxList', state.boxList)
	}
	const updateSaveData = (data, options) => {
		Object.assign(state.saveData, data);
		Object.assign(state.options, options);
		// console.log('boxList', state.boxList)
	}
	
	//装柜数据生成
	function createLoading(){
		var saveData = {
			...state.saveData,
			boxInfo: state.boxList[boxIndex.value]
		};
		proxy.$refs.containerLoading.openLoading(saveData, state.options);
	}
	
	//单据字段信息变更
	const itemChange = (data, val, item) => {
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
						{ labelWidth:'auto',type: 'input',value: '',label: '箱号',placeholder: '请输入箱号',key: 'no'},
						{ labelWidth:'auto',type: 'input',value: '',label: '封号',placeholder: '请输入封号',key: 'seal_number' },
						{ labelWidth:'auto',type: 'select',value: '',label: '柜型',placeholder: '请选择柜型',key: 'container_type_id',options: [], labelName: 'name', valueName: 'id' },
						{ labelWidth:'auto',type: 'input',value: '',label: '序列号',placeholder: '请输入序列号',key: 'serial_number' },
						{ labelWidth:'auto',type: 'select',value: '',label: '预提',placeholder: '请选择预提',key: 'pre_pull_wharf_id',options: [], labelName: 'name', valueName: 'id',popover: true, clearable: true, filterable: true },
						{ labelWidth:'auto',type: 'select',value: '',label: '提箱码头',placeholder: '请选择提箱码头',key: 'wharf_id',options: [], labelName: 'name', valueName: 'id',popover: true, clearable: true, filterable: true },
						{ labelWidth:'auto',type: 'select',value: '',label: '落箱',placeholder: '请选择落箱',key: 'drop_off_wharf_id',options: [], labelName: 'name', valueName: 'id',popover: true, clearable: true, filterable: true },
						{ labelWidth:'auto',type: 'select',value: '',label: '是否进港',placeholder: '请选择是否进港',key: 'is_entered_port',options: optionsComm['是否进港'], clearable: true, filterable: true,defaultValue: '0' },
						{ labelWidth:'auto',type: 'input',value: '',label: '司机信息',placeholder: '请输入司机信息',key: 'driver', popover: true },
						{ label: '进港数据', soltName: 'arrivalPort' },
						{ label: '件毛体', soltName: 'containerItemsBtn' },
						{ labelWidth:'auto',type: 'select',value: '',label: '运费情况',placeholder: '请选择运费情况',key: 'freight_status',options: optionsComm['运费情况'] },
						{ soltName: 'containerItemsTable', value: [], span: 24 },
						{ labelWidth:'auto',type: 'select',value: '',label: '车队',placeholder: '请选择车队',key: 'fleet_id',options: [], labelName: 'name', valueName: 'id', clearable: true, filterable: true },
						{ labelWidth:'auto',type: 'input',value: '',label: '货重',placeholder: '请输入货重',key: 'cargo_weight' },
						{ labelWidth:'auto',type: 'dateTime',value: '',label: '装柜时间',placeholder: '请选择装柜时间',key: 'loading_at', format: 'YYYY-MM-DD HH:mm' },
						{ labelWidth:'auto',type: 'input',value: '',label: '运费备注',placeholder: '请输入运费备注',key: 'freight_remark' },
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
			bl_no: state.saveData.bl_no||'',  //提单号
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
			label: '装柜地址', prop: 'loading_address',type: 'edit',width: '400px',
			form: {
				type: 'select',key: 'loading_address',options: [],labelName: 'address', valueName: 'address',
				popover:true, clearable: true,filterable: true
			}
		},
		{label: '地址', type: 'edit', prop: 'address',
			form: {
				type: 'input',key: 'address',disabled: true
			}
		},
		{label: '联系人/联系电话', prop: 'contact_name',formatter: (row)=> {
			return row.contact_name + ' / ' + row.phone
		}},
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
	const tableItemChange = (item, index) => {
		var dataNew = item.options?item.options.find(v=>{return v.address == item.value}):{};
		if(item.key=='loading_address'){
			var data = {
				loading_address: dataNew.address,
				address: dataNew?.region?.name,
				contact_name: dataNew.contact_name,
				phone: dataNew.phone,
				remark: dataNew.remark
			}
			// proxy.$refs.tableListZGDZ.tableData[index].address = dataNew?.region?.name;
			// proxy.$refs.tableListZGDZ.tableData[index].contact_name = dataNew?.contact_name;
			// proxy.$refs.tableListZGDZ.tableData.splice(index, 1, data);
			proxy.$refs.tableListZGDZ.updateTableData(data, index);
		}
		console.log('表格数据', proxy.$refs.tableListZGDZ.tableData)
	}
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
		addBox,
		updateSaveData
	})
</script>

<style>
	#boxInfo .el-aside{
		padding: 8px 10px
	}
</style>