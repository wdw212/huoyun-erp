<template>
	<div id="boxInfo" class="flex1" style="width: 100%;height: 800px;">
		<!-- <div style="width: 100%;">{{state.boxList}}</div> -->
		<el-card class="mr-2 h-100" style="padding: 8px 10px;" v-if="isShowBoxListLeft">
			<template #header>
				<el-row justify="space-between" class="pb">
					<span class="font-16">箱号列表</span>
					<el-text type="primary" class="hand" @click="addBox(false)">添加箱号</el-text>
				</el-row>
			</template>
			<el-aside width="200px">
			<!-- {{boxList.length}}--{{props.isOperate}} -->
				<div v-for="(item, index) in state.boxList" :key="index" @click="changeBox(index)"
				style="display: flex;justify-content: space-between;align-items: center;">
					<el-text class="hand" :type="state.boxIndex==index?'primary':''" >
						{{item.no}}
					</el-text>
					<el-popconfirm title="确认删除箱号信息" placement="top" 
					v-if="state.boxList.length> 1" @confirm="deleteBox">
						<template #reference>
							<el-button type="danger" plain size="small">删除</el-button>
						</template>
					</el-popconfirm>
				</div>
			</el-aside>
		</el-card>
		
		<div class="flex-1" style="height: 100%;overflow-y: auto;">
			<common-form ref="boxInfoForm" :formList="formListBox" @confirm="confirmSubmit" :tabShow="false" :btnShow="false" @itemChange="itemChange">
				<!-- 进港数据 -->
				<template #arrivalPort="{saveData,formList}">
					<el-form-item style="width: 100%;" label="进港数据" label-width="auto">
						<el-button type="primary" @click="createArrivalPort">生成</el-button>
					</el-form-item>
					<arrival-port ref="arrivalPort"></arrival-port>
				</template>
				<!-- 件毛体 -->
				<template #containerItemsBtn="{saveData,formList}">
					<el-form-item style="width: 100%;" label="件毛体" label-width="auto">
						<el-button type="primary" @click="addTableList1">新增</el-button>
					</el-form-item>
				</template>
				<template #containerItemsTable="{saveData,formList}">
					<table-list :tableConfig="tableConfig1" :tableColumn="tableColumn1" :multiple="false" :border="true" ref="tableListJMT" class="mb-2" @tableItemChange="tableItemChangeJMT">
						<template #bottomCon="{tableData}">
							<el-row :gutter="20">
								<el-col class="p-r" v-for="(item,index) in tableData" :key="index" :span="8">
									<el-input v-model="tableData[index].remark" :rows="3" type="textarea" placeholder="请输入" class="mt-1"/>
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
					<table-list :tableConfig="tableConfig2" :tableColumn="tableColumn2" :multiple="false" :border="true" ref="tableListZGDZ" @tableItemChange="tableItemChangeZGDZ">
						<template #table_loading_address>
							<div style="display: flex;justify-content: space-between;">
								<div>装柜地址</div>
								<el-button type="warning" size="small" plain @click="addAddress" v-if="isShow=== true">添加地址</el-button>
							</div>
						</template>
						<template #bottomCon="{tableData}">
							<el-row :gutter="20">
								<el-col class="p-r" v-for="(item,index) in tableData" :key="index" :span="8">
									<el-input v-model="tableData[index].remark" :rows="3" type="textarea" placeholder="请输入" class="mt-1"/>
								</el-col>
							</el-row>
						</template>
					</table-list>
				</template>
				<!-- 装柜数据 -->
				<template #loadingInfo="{saveData,formList}">
					<ContainerLoading ref="containerLoading"></ContainerLoading>
					<el-form-item style="width: 100%;" label="装柜数据" label-width="auto">
						<el-button type="primary" @click="createLoading">生成</el-button>
					</el-form-item>
				</template>
				<!-- 装箱单 -->
				<template #packingList="{saveData,formList}">
					<el-form-item style="width: 100%;" label="装箱单" label-width="auto">
						<el-button type="primary" @click="openPackForm(true)">生成</el-button>
					</el-form-item>
					<pack-form ref="packForm"></pack-form>
				</template>
			</common-form>
		</div>
		
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
	import arrivalPort from '@/components/document/arrivalPort.vue'
	import ContainerLoading from '@/components/document/containerLoading.vue'
	import { detailInfo, getSelect } from '@/utils/common'
	
	const { proxy } = getCurrentInstance();
	const props = defineProps({
		isOperate: {
			type: Boolean,
			default: () => {
				return true
			}
		},
		// 装柜地址按钮是否展示,默认展示
		isShow: {
			type: Boolean,
			default: () => {
				return true
			}
		},
		isShowBoxListLeft: {
			type: Boolean,
			default: () => {
				return true
			}
		}
	})
	
	const MT = ref([]); //码头
	const CHD = ref([]); //车队
	const XZLX = ref([]); //箱子类型
	const YT = ref([]); //预提
	const LX = ref([]); //落箱
	const ZGDZ = ref([]);  //装柜地址
	
	const formListBox = ref([]);
	
	onMounted(async () => {
		// console.log('boxInfo', props);
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
		
		ZGDZ.value = ZGDZ.value.map((item,index)=>{
			return {
				...item,
				label: item.keyword?item.keyword+'—'+item.address:item.address
			}
		})
		tableColumn2.value[0].form.options = ZGDZ.value;
		proxy.$refs.boxInfoForm.resetKey(formListBox.value);
		getSelect(function(val){
			state.options = val;
		})
	})
	
	const packFormShow = ref(false);
	
	const state = reactive({
		boxList: [],      //箱子列表数据
		saveData: {},    //单据数据
		options: {},     //下拉选项值
		boxIndex: 0,    //选中箱子列表下标
	});
	// 添加箱号
	const addBox = (isNew) => {
		if(isNew){
			state.boxList = [];
			state.saveData = {};
		}
		var data = {
			cargo_weight: null,
			container_type_id: null,
			driver: null,
			drop_off_wharf_id: null,
			fleet_id: null,
			is_entered_port: '0',
			loading_at: null,
			no: '箱号',
			pre_pull_wharf_id: null,
			seal_number: null,
			serial_number: null,
			wharf_id: null,
			container_items: [{
				bl_no: state.saveData.bl_no||null,  //提单号
				quantity: 0, //件数
				gross_weight: 0, //毛重
				volume: 0, //体积
				remark: null, //备注
			}],
			container_loading_addresses: [{
				loading_address: null,
				address: null,
				contact_name: '',
				phone: '',
				remark: null
			}],
			freight_status: null,
			freight_remark: null,
			no_image: {},
			seal_number_image: {},
			wharf_record_image: {},
			entered_port_record_image: {}
		}
		var list = JSON.parse(JSON.stringify(state.boxList));
		list.push(data)
		state.boxList= JSON.parse(JSON.stringify(list));
		state.boxIndex = state.boxList.length-1;
		proxy.$refs.boxInfoForm.changeSave(data);
		var timeInter = setInterval(function(){
			if(isNew){
				proxy.$refs.packForm.reset(true);
			}
			if(proxy.$refs.tableListJMT&&proxy.$refs.tableListZGDZ){
				proxy.$refs.tableListJMT.state.tableData = data.container_items||[];
				proxy.$refs.tableListZGDZ.state.tableData = data.container_loading_addresses||[];
				clearInterval(timeInter);
			}
		}, 500)
		updateKeyRemark(data);
		console.log(state.boxList,'state.boxList')
		emit('boxInfoChange', state.boxList);
		// console.log('boxList新增', state.boxIndex, state.boxList)
	}
	// 切换选中箱号
	const changeBox = (index) => {
		state.boxIndex = index;
		console.log('changeBox239', state.boxList, val)
		var val = JSON.parse(JSON.stringify(state.boxList[index]));
		// var val = { ...toRaw(state.boxList[index]) }
		console.log('changeBox241', state.boxList, val)
		// proxy.$refs.boxInfoForm.resetKey(formListBox.value, true);
		proxy.$refs.boxInfoForm.changeSave(val);
		proxy.$refs.tableListJMT.state.tableData = val.container_items;
		proxy.$refs.tableListZGDZ.state.tableData = val.container_loading_addresses;
		updateKeyRemark(val);
		openPackForm(false);
	}
	// 删除选中箱号
	const deleteBox = () => {
		state.boxList.splice(state.boxIndex, 1);
		state.boxIndex = 0;
		proxy.$refs.boxInfoForm.changeSave(state.boxList[0]);
		updateKeyRemark(state.boxList[0]);
		// console.log('boxList', state.boxList, proxy.$refs.boxInfoForm.saveData)
	}
	//箱子数据回显
	const defaultBox = (val) => {
		// Object.assign(state.boxList, val);
		state.boxList = val;
		if(val.length>0){
			state.boxIndex = 0;
			proxy.$refs.boxInfoForm.changeSave(val[0]);
			updateKeyRemark(val[0]);
			var timeInter = setInterval(function(){
				if(proxy.$refs.tableListJMT&&proxy.$refs.tableListZGDZ){
					proxy.$refs.tableListJMT.state.tableData = val[0].container_items;
					proxy.$refs.tableListZGDZ.state.tableData = val[0].container_loading_addresses;
					openPackForm(false);
					clearInterval(timeInter);
				}
			}, 500)
		}
		// console.log('boxList-箱子数据回显', state.boxList)
	}
	//单据数据更新
	const updateSaveData = (data, options) => {
		Object.assign(state.saveData, data);
		Object.assign(state.options, options);
		openPackForm(false);
		// console.log('boxList', state.boxList)
	}
	//更新表单字段备注信息
	function updateKeyRemark(data){
		var remarkList = {
			pre_pull_wharf_id: 4,
			wharf_id: 5,
			drop_off_wharf_id: 6
		}
		// console.log('更新表单字段备注信息', formListBox.value[0])
		if(formListBox.value[0]){
			for(var key in remarkList){
				var item = formListBox.value[0].formData[0].formItem[remarkList[key]];
				var dataNew = item.options?item.options.find(v=>{return v.id == data[key]}):{};
				formListBox.value[0].formData[0].formItem[remarkList[key]].remark = dataNew?dataNew.remark:'';
			}
		}
	}
	
	//装柜数据生成
	function createLoading(){
		var saveData = {
			...state.saveData,
			boxInfo: {
				...state.boxList[state.boxIndex],
				container_items: proxy.$refs.tableListJMT.state.tableData,
				container_loading_addresses: proxy.$refs.tableListZGDZ.state.tableData
			},
			packInfo: proxy.$refs.packForm.form
		};
		// console.log('proxy.$refs.containerLoading', proxy.$refs)
		proxy.$refs.containerLoading.openLoading(saveData, state.options);
	}
	//进港数据生成
	function createArrivalPort(){
		var saveData = {
			...state.saveData,
			boxInfo: {
				...state.boxList[state.boxIndex],
				container_items: proxy.$refs.tableListJMT.state.tableData,
			}
		};
		proxy.$refs.arrivalPort.openLoading(saveData, state.options);
	}
	//装箱单数据生成
	function openPackForm(open){
		if(proxy.$refs.tableListJMT&&proxy.$refs.tableListZGDZ){
			var newData = {
				...state.saveData,
				boxInfo: {
					...state.boxList[state.boxIndex],
					container_items: proxy.$refs.tableListJMT.state.tableData,
					container_loading_addresses: proxy.$refs.tableListZGDZ.state.tableData
				}
			};
			proxy.$refs.packForm.openPackForm(newData, state.options, open);
		}
	}
	
	//单据字段信息变更
	const itemChange = (data, val, item) => {
		Object.assign(state.boxList[state.boxIndex], data);
		// state.boxList[state.boxIndex][item.key] = val;
		var newBox = JSON.parse(JSON.stringify(state.boxList));
		var dataNew = item.options?item.options.find(v=>{return v.id == val}):{};
		var remarkList = {
			pre_pull_wharf_id: 4, //预提
			wharf_id: 5, //提箱码头
			drop_off_wharf_id: 6 //落箱
		}
		if(remarkList[item.key]&&remarkList[item.key]>-1){
			formListBox.value[0].formData[0].formItem[remarkList[item.key]].remark = dataNew?dataNew.remark:'';
		}
		
		// 柜型统计
		var containerKey = {};
		if(item.key=='container_type_id'){
			state.boxList.forEach((vv,ii)=>{
				var container = item.options?item.options.find(v=>{return v.id == vv.container_type_id}):{};
				if(container&&container.id){
					containerKey[container.name] = containerKey[container.name]?containerKey[container.name]+1:1;
				}
			})
			var containerInfo = [];
			for(var key in containerKey){
				containerInfo.push(containerKey[key]+'*'+key);
			}
			emit('containerInfo', containerInfo.join(';'));
		}
		emit('boxInfoChange', newBox);
		openPackForm(false);
		console.log('单据信息变更', data, state.boxList, formListBox.value)
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
						{ labelWidth:'auto',type: 'select',value: '',label: '柜型',placeholder: '请选择柜型',key: 'container_type_id',options: [], labelName: 'name', valueName: 'id',rules: { required: true, message: '请选择柜型', trigger: 'change' } },
						{ labelWidth:'auto',type: 'input',value: '',label: '序列号',placeholder: '请输入序列号',key: 'serial_number' },
						{ labelWidth:'auto',type: 'select',value: '',label: '预提',placeholder: '请选择预提',key: 'pre_pull_wharf_id',options: [], labelName: 'name', valueName: 'id',popover: true, clearable: true, filterable: true, remark: '' },
						{ labelWidth:'auto',type: 'select',value: '',label: '提箱码头',placeholder: '请选择提箱码头',key: 'wharf_id',options: [], labelName: 'name', valueName: 'id',popover: true, clearable: true, filterable: true, remark: '' },
						{ labelWidth:'auto',type: 'select',value: '',label: '落箱',placeholder: '请选择落箱',key: 'drop_off_wharf_id',options: [], labelName: 'name', valueName: 'id',popover: true, clearable: true, filterable: true, remark: '' },
						{ labelWidth:'auto',type: 'select',value: '',label: '是否进港',placeholder: '请选择是否进港',key: 'is_entered_port',options: optionsComm['是否进港'], clearable: true, filterable: true,defaultValue: '0' },
						{ labelWidth:'auto',type: 'input',value: '',label: '司机信息',placeholder: '请输入司机信息',key: 'driver', popover: true },
						{ label: '进港数据', soltName: 'arrivalPort' },
						{ label: '件毛体', soltName: 'containerItemsBtn' },
						{ labelWidth:'auto',type: 'select',value: '',label: '运费情况',placeholder: '请选择运费情况',key: 'freight_status',options: optionsComm['运费情况'] },
						{ soltName: 'containerItemsTable', value: [], span: 24 },
						{ labelWidth:'auto',type: 'select',value: '',label: '车队',placeholder: '请选择车队',key: 'fleet_id',options: [], labelName: 'name', valueName: 'id', clearable: true, filterable: true },
						{ labelWidth:'auto',type: 'input',value: '',label: '货重',placeholder: '请输入货重',key: 'cargo_weight' },
						{ labelWidth:'auto',type: 'dateTime',value: '',label: '装柜时间',placeholder: '请选择装柜时间',key: 'loading_at', format: 'YYYY-MM-DD HH:mm' },
						{ labelWidth:'auto',type: 'input',value: '',label: '运费备注',placeholder: '请输入运费备注',key: 'freight_remark', popover: true },
						{ label: '装柜地址', soltName: 'loadingAddress' },
						{ label: '装柜数据', soltName: 'loadingInfo' },
						{ label: '装箱单', soltName: 'packingList',span: 4 },
						{ labelWidth:'auto',type: 'upload',value: {},label: '',key: 'no_image',remark: '箱号图片',popover: true,span: 2, uploadProps: {uploadType: 1,limit: 1, fileType: ['png','jpg','gif','jpeg'],showFile: false} },
						{ labelWidth:'auto',type: 'upload',value: {},label: '',key: 'seal_number_image',remark: '封号图片',popover: true,span: 2, uploadProps: {uploadType: 1,limit: 1, fileType: ['png','jpg','gif','jpeg'],showFile: false} },
						{ labelWidth:'auto',type: 'upload',value: {},label: '',key: 'wharf_record_image',remark: '提箱记录图片',popover: true,span: 2, uploadProps: {uploadType: 1,limit: 1, fileType: ['png','jpg','gif','jpeg'],showFile: false} },
						{ labelWidth:'auto',type: 'upload',value: {},label: '',key: 'entered_port_record_image',remark: '进港记录图片',popover: true,span: 2, uploadProps: {uploadType: 1,limit: 1, fileType: ['png','jpg','gif','jpeg'],showFile: false} },
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
				type: 'input',key: 'bl_no',popover:false
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
		proxy.$refs.tableListJMT.state.tableData.push({
			bl_no: state.saveData.bl_no||null,  //提单号
			quantity: 0, //件数
			gross_weight: 0, //毛重
			volume: 0, //体积
			remark: null, //备注
		});
		state.boxList[state.boxIndex].container_items = proxy.$refs.tableListJMT.state.tableData;
		emit('boxInfoChange', state.boxList);
	}
	const tableItemChangeJMT = (item, index) => {
		var dataNew = item.options?item.options.find(v=>{return v.address == item.value}):{};
		var tableDataNew = proxy.$refs.tableListJMT.state.tableData;
		state.boxList[state.boxIndex].container_items = tableDataNew;
		emit('boxInfoChange', state.boxList);
		// console.log('箱子数据', state.boxList)
	}
	const delete1 = (row, index) => {
		proxy.$refs.tableListJMT.state.tableData.splice(index, 1)
		state.boxList[state.boxIndex].container_items = proxy.$refs.tableListJMT.state.tableData;
		emit('boxInfoChange', state.boxList);
		// console.log('paymentDelete', row, index)
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
				type: 'select',key: 'loading_address',options: [], labelName: 'label', valueName: 'address',
				popover:true, clearable: true, filterable: true, placeholder: '输入关键字查询地址信息',
				// url: '/loading-addresses', method: 'get'
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
	const tableItemChangeZGDZ = (item, index) => {
		var dataNew = item.options?item.options.find(v=>{return v.address == item.value}):{};
		var tableDataNew = proxy.$refs.tableListZGDZ.state.tableData;
		if(item.key=='loading_address'){
			var data = {
				loading_address: dataNew?.address||'',
				address: dataNew?.region?.name||'',
				contact_name: dataNew?.contact_name||'',
				phone: dataNew?.phone||'',
				remark: dataNew?.remark||''
			}
			proxy.$refs.tableListZGDZ.state.tableData[index] = data;
			proxy.$refs.boxInfoForm.changeSave({freight_remark: dataNew?.freight||''});
			state.boxList[state.boxIndex].freight_remark = dataNew?.freight||'';
		}
		state.boxList[state.boxIndex].container_loading_addresses = proxy.$refs.tableListZGDZ.state.tableData;
		emit('boxInfoChange', state.boxList);
		// console.log('表格数据', proxy.$refs.tableListZGDZ.state.tableData, proxy.$refs.boxInfoForm.saveData)
	}
	const addTableList2 = () => {
		if(!proxy.$refs.tableListZGDZ.state.tableData){
			proxy.$refs.tableListZGDZ.state.tableData = [];
		}
		proxy.$refs.tableListZGDZ.state.tableData.push({
			loading_address: null,
			address: null,
			contact_name: '',
			phone: '',
			remark: null
		});
		state.boxList[state.boxIndex].container_loading_addresses = proxy.$refs.tableListZGDZ.state.tableData;
		emit('boxInfoChange', state.boxList);
	}
	const delete2 = (row, index) => {
		proxy.$refs.tableListZGDZ.state.tableData.splice(index, 1)
		state.boxList[state.boxIndex].container_loading_addresses = proxy.$refs.tableListZGDZ.state.tableData;
		emit('boxInfoChange', state.boxList);
		// console.log('paymentDelete', row, index)
	}
	//新增装柜地址
	const router = useRouter();
	function addAddress(){
		router.push({
			path: "/company/company-loading-address",
			query: {
				add: true
			},
		});
	}

	const emit = defineEmits(['boxInfoChange','containerInfo'])
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