<template>
	<div class="send-and-receive">
		<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
			<el-row :gutter="10">
				<el-col :span="12">
					<el-form-item label="代码(税号)" prop="code">
						<el-input v-model="form.code" placeholder="请输入代码" @input="handleInputTaxNumber('code', form.code, 2)" :disabled="disabled?true:false"/>
					</el-form-item>
				</el-col>
			
				<el-col :span="12">
					<el-form-item label="名称" prop="name">
						<el-input v-model="form.name" placeholder="请输入名称" @input="handleInputTaxNumber('name', form.name,2)" :disabled="disabled?true:false"/>
					</el-form-item>
				</el-col>
			
				<el-col :span="12">
					<el-form-item label="地址" prop="address">
						<el-input v-model="form.address" placeholder="请输入地址" @input="handleInputTaxNumber('address', form.address, 2)" :disabled="disabled?true:false"/>
					</el-form-item>
				</el-col>
			
				<el-col :span="12">
					<el-form-item label="国家/地区代码" prop="country">
						<el-input v-model="form.country" placeholder="请输入国家/地区代码" @input="handleInputTaxNumber('country', form.country, 2)" :disabled="disabled?true:false"/>
					</el-form-item>
				</el-col>
			
				<el-col :span="12">
					<el-form-item label="电话" prop="phone">
						<el-input v-model="form.phone" placeholder="请输入电话" @input="handleInputTaxNumber('phone', form.phone, 2)"  :disabled="disabled?true:false" />
					</el-form-item>
				</el-col>
			
				<el-col :span="12">
					<el-form-item label="AEO企业编码" prop="aeo_company_code">
						<el-input v-model="form.aeo_company_code" placeholder="请输入AEO企业编码" @input="handleInputTaxNumber('aeo_company_code', form.aeo_company_code, 2)" :disabled="disabled?true:false"/>
					</el-form-item>
				</el-col>
			
				<el-col :span="12">
					<el-form-item label="具体联系人" prop="contact_name">
						<el-input v-model="form.contact_name" placeholder="请输入具体联系人" @input="handleInputTaxNumber('contact_name', form.contact_name, 2)" :disabled="disabled?true:false"/>
					</el-form-item>
				</el-col>
			
			
				<el-col :span="12">
					<el-form-item label="联系人电话" prop="contact_phone">
						<el-input v-model="form.contact_phone" placeholder="请输入联系人电话" @input="handleInputTaxNumber('contact_phone', form.contact_phone, 2)" :disabled="disabled?true:false"/>
					</el-form-item>
				</el-col>
			
				<el-col :span="24">
					<el-form-item label="舱单网址" prop="url">
						<el-input v-model="form.url" placeholder="请输入舱单网址" @input="handleInputTaxNumber('url', form.url, 3)" :disabled="disabled?true:false"/>
					</el-form-item>
				</el-col>
				
				<el-col :span="12">
					<el-form-item label="收发通类型">
						<el-select v-model="form.type" placeholder="请选择收发通类型" @click="getTypeContentLabel(form.type)" :disabled="disabled?true:false">
							<el-option v-for="item in TYPE_LIST" :key="item.value" :label="item.label"
								:value="item.value" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="生成" style="display: flex;">
						<el-button type="primary" @click="openDialog">生成</el-button>
						<el-input style="flex: 1;margin-left: 10px;" v-model="form.keyword" placeholder="方便搜索" :disabled="disabled?true:false"/>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item :label="type_content_label" prop="type_content" >
						<el-input v-model="form.type_content" :placeholder="'请输入'+form.type_content" :rows="7" type="textarea" @input="handleInputTaxNumber('type_content', form.type_content, 4)" :disabled="disabled?true:false"/>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="备注" prop="remark">
						<el-input v-model="form.remark" placeholder="请输入备注" :rows="7" type="textarea" :disabled="disabled?true:false"/>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="是否确认" prop="is_confirm">
						<el-select v-model="form.is_confirm" placeholder="请选择是否确认" @change="getIsConfirmValue" :disabled="disabled?true:false">
							<el-option v-for="item in IS_CONFIRM_LIST" :key="item.value" :label="item.label"
								:value="item.value" />
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="操作员" prop="operation_user_ids">
						<UserSelect :value="form.operation_user_ids" @update:value="form.operation_user_ids= $event" :user-type="'OPERATE'" :btn-type="btnType" :role-type-user-id-list="roleTypeUserIdList"></UserSelect>
						<!-- <el-select v-model="form.operation_user_ids" placeholder="请选择操作员" filterable clearable multiple>
							<el-option v-for="item in OPERATION_USER" :key="item.id" :label="item.name" :value="item.id" :disabled="item.select"/>
						</el-select> -->
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="单证员" prop="document_user_ids">
						<UserSelect :value="form.document_user_ids" @update:value="form.document_user_ids= $event" :user-type="'DOCUMENT'" :btn-type="btnType" :role-type-user-id-list="roleTypeUserIdList"></UserSelect>
						<!-- <el-select v-model="form.document_user_ids" placeholder="请选择操作员" filterable clearable multiple>
							<el-option v-for="item in DOCUMENT_USER" :key="item.id" :label="item.name" :value="item.id" />
						</el-select> -->
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="商务" prop="commerce_user_ids">
						<UserSelect :value="form.commerce_user_ids" @update:value="form.commerce_user_ids= $event" :user-type="'COMMERCE'" :btn-type="btnType" :role-type-user-id-list="roleTypeUserIdList"></UserSelect>
						<!-- <el-select v-model="form.commerce_user_ids" placeholder="请选择商务" filterable clearable multiple>
							<el-option v-for="item in COMMERCE_USER" :key="item.id" :label="item.name" :value="item.id" />
						</el-select> -->
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div>
			<!-- <template name='footer'> -->
				<div class="dialog-footer">
					<el-button type="primary" @click="submitForm">保 存</el-button>
					<el-button @click="cancel">取 消</el-button>
				</div>
			<!-- </template> -->
		</div>
		<el-dialog class="generate_dialog" title="生成信息" v-model="openInformation" :destroy-on-close='true' width="30%">
			<el-input v-model="form.generate_information" placeholder="请输入生成信息" :rows="10" type="textarea" id="myTextarea"/>
		</el-dialog>
	</div>
</template>

<script setup>
	import {
		addData,
		updateData
	} from "@/api/company/send-and-receive";
	import {
			listUser as userListData
		} from "@/api/system/user";
	import { onMounted, toRefs,watchEffect } from 'vue';
	import UserSelect from '@/components/UserSelect'
	import useUserStore from "@/store/modules/user";
	const Emit = defineEmits(['handleCancle'])
	const {proxy} = getCurrentInstance();
	const userStore = useUserStore();  //vuex缓存的用户信息
	const roleTypeList= ref(['SUPER_ADMIN'])  //当前页面有所有人权限的角色
	const roleTypeNowList= ref(['OPERATE','DOCUMENT','COMMERCE'])  //当前页面共享人所有人权限的角色
	// 验证大小写
	const handleInputTaxNumber = (lable, value, isChar = 0) => {
		if (isChar == 0) {
			form.value[lable] = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(); // 转换为大写
		} else if (isChar == 1) {
			form.value[lable] = value.replace(/[^a-zA-Z0-9\+\-\*]/g, "").toUpperCase(); // 转换为大写
		} else if (isChar == 2) {
			form.value[lable] = value.replace(/[^a-zA-Z0-9+\ ·`~!@#$%^&*()_+{}|:";{}|\/.<>;'',，\-@: //.=?*]/g, "").toUpperCase();
		}else if (isChar == 3) {
			form.value[lable] = value.replace(/[^a-zA-Z0-9+\ ·`~!@#$%^&*()_+{}|:";{}|\/.<>;'',，\-@: //.=?*]/g, "");  //大小写不转化
		}else if (isChar == 4) {
			form.value[lable] = value.replace(/[^a-zA-Z0-9+\ ·`~!@#$%^&*()_+{}|:";{}|\/.<>;'',，\-@: //.=?\n*]/g, "").toUpperCase();  //转化为大写  加上换行符
		}
	}
	const props  = defineProps({
		btnType: {
		  type: String,
		  default: 'add'
		},
		openView: {
			type: Boolean,
			default: false,	
		},
		model: {
			type: Object,
			validator: (value) => value == null
		}
	})
	const openInformation= ref(false)
	const data = reactive({
		form: {
			code: '',  //代码
			name: '',  //名称
			url: '',  //网址
			type: 'receiver',  //收发通类型
			operation_user_ids: [],  //操作员
			document_user_ids: [],  //单证员
			commerce_user_ids: [],  //商务
			generate_information: '',  //生成信息
			remark: '',  //备注
			is_confirm: 0,  //是否确认
			address:'',  //地址
			country:'',  //国家地区代码
			phone:'',  //电话
			aeo_company_code:'',  //AEO企业编码
			contact_name:'',  //具体联系人
			contact_phone:'',  //联系人电话
			type_content:'', //一个框（对应操作单据页面的具体发货人/收货人/通知人信息，根据收发通类型确认是哪个）
			keyword: '' ,// 方便搜索
		},
		rules: {
			name: [{required: true,message: "名称不能为空",trigger: "blur"}],
			type: [{required: true,message: "收发通类型不能为空",trigger: "change"}],
			type_content: [{required: true,message: "具体信息不能为空",trigger: "blur"}],
			is_confirm: [{required: true,message: "是否确认不能为空",trigger: "change"}],
		}
	});
	const {
		form,
		rules
	} = toRefs(data);
	const disabled = ref(false);
	
	const formRef= ref()
	watch(() => [form.value.is_confirm, form.value.type, form.value.operation_user_ids, form.value.document_user_ids, form.value.commerce_user_ids], (newVal, oldVal) => {
	console.log(newVal, oldVal,200); // 输出新旧值的数组
		formRef.value?.clearValidate()
		if(newVal[0]=== 0){
			rules.value = {};
			rules.value= {
						name: [{required: true,message: "名称不能为空",trigger: "blur"}],
						type_content: [{required: true,message: "具体信息不能为空",trigger: "blur"}]
					}
		}else if(newVal[0]=== 1){
			rules.value = {};
			if(newVal[1]=== 'sender'){
				rules.value= {
					code: [{required: true,message: "代码不能为空",trigger: "blur"}],
					name: [{required: true,message: "名称不能为空",trigger: "blur"}],
					address: [{required: true,message: "地址不能为空",trigger: "blur"}],
					type_content: [{required: true,message: "具体信息不能为空",trigger: "blur"}]
				}
			}else if(newVal[1]=== 'receiver'){
				rules.value= {
					code: [{required: true,message: "代码不能为空",trigger: "blur"}],
					name: [{required: true,message: "名称不能为空",trigger: "blur"}],
					address: [{required: true,message: "地址不能为空",trigger: "blur"}],
					country: [{required: true,message: "国家/地区代码不能为空",trigger: "blur"}],
					phone: [{required: true,message: "电话不能为空",trigger: "blur"}],
					contact_name: [{required: true,message: "具体联系人不能为空",trigger: "blur"}],
					contact_phone: [{required: true,message: "联系人电话不能为空",trigger: "blur"}],
					url: [{required: true,message: "舱单网址不能为空",trigger: "blur"}],
					type_content: [{required: true,message: "具体信息不能为空",trigger: "blur"}]
				}
			}else if(newVal[1]=== 'notifier'){
				rules.value= {
					code: [{required: true,message: "代码不能为空",trigger: "blur"}],
					name: [{required: true,message: "名称不能为空",trigger: "blur"}],
					address: [{required: true,message: "地址不能为空",trigger: "blur"}],
					country: [{required: true,message: "国家/地区代码不能为空",trigger: "blur"}],
					phone: [{required: true,message: "电话不能为空",trigger: "blur"}],
					type_content: [{required: true,message: "具体信息不能为空",trigger: "blur"}]
				}
			}
			if((form.value.confirm_user_id && userStore.id === form.value.confirm_user_id) || roleTypeList.value.includes(userStore.userRoleCode)){
				if(!newVal[2].find(item=> item=== form.value.confirm_user_id) && !newVal[3].find(item=> item=== form.value.confirm_user_id) && !newVal[4].find(item=> item=== form.value.confirm_user_id) && !roleTypeList.value.includes(userStore.userRoleCode)){
					form.value.is_confirm= 0
				}
				// if(!newVal[3].find(item=> item=== userStore.id)){
				// 	form.value.is_confirm= 0
				// }
				// if(!newVal[4].find(item=> item=== userStore.id)){
				// 	form.value.is_confirm= 0
				// }
				// if(userStore.userRoleCode=== 'OPERATE'){
				// 	if(!newVal[2].find(item=> item=== userStore.id)){
				// 		form.value.is_confirm= 0
				// 		console.log(259)
				// 	}
				// }else if(userStore.userRoleCode=== 'DOCUMENT'){
				// 	if(!newVal[3].find(item=> userStore.id)){
				// 		form.value.is_confirm= 0
				// 	}
				// }else if(userStore.userRoleCode=== 'COMMERCE'){
				// 	if(!newVal[4].find(item=> userStore.id)){
				// 		form.value.is_confirm= 0
				// 	}
				// }
			}
			
		}
	})
	const roleTypeUserIdList= ref([])
	// 非增加操作时,获取详情信息
	watchEffect(()=>{
		console.log('props.btnType', props.btnType)
		if(props.model){
			form.value =  JSON.parse(JSON.stringify(props.model))
			// 收发通类型:代码:名称:地址:国家/地区代码AEO企业编码:具体联系人:联系人电话:
			if(props.btnType == 'edit' && props.model.is_confirm=== 1 && props.model.confirm_user_id!== userStore.id && !roleTypeList.value.includes(userStore.userRoleCode)){
				disabled.value = true;
			// if(props.btnType == 'edit' && props.model.is_confirm=== 1 && (!roleTypeList.value.includes(userStore.userRoleCode) && userStore.id !== props.model.confirm_user_id)){
				// 1.当当前登录人权限不为最高权限时不可修改确认人
				// 2.当前登录人id不为确认人id时不可修改确认人共享权限
				console.log(userStore.id !== form.value.confirm_user_id,293)
				roleTypeUserIdList.value.push(form.value.confirm_user_id)
				console.log(roleTypeUserIdList.value,286)
			}
		}
		// console.log(props.model,202)
		// console.log(form.value,203)
	})
	// 点击生成信息
	function openDialog(){
		openInformation.value= true
		let typeLabel= TYPE_LIST.value.find(item =>item.value=== form.value.type)?TYPE_LIST.value.find(item =>item.value=== form.value.type).label : ''
		form.value.generate_information= `收发通类型:${typeLabel}\r\n代码:${form.value.code}\r\n名称:${form.value.name?form.value.name:''}\r\n电话:${form.value.phone?form.value.phone:''}\r\n地址:${form.value.address?form.value.address:''}\r\n国家/地区代码:${form.value.country}\r\nAEO企业编码:${form.value.aeo_company_code?form.value.aeo_company_code:''}\r\n具体联系人:${form.value.contact_name? form.value.contact_name:''}\r\n联系人电话:${form.value.contact_phone? form.value.contact_phone:''}\r\n备注:${form.value.remark?form.value.remark:''}`
	}
	// 收发通类型
	const TYPE_LIST = ref([{
			label: '发货人',
			value: 'sender',
			contentLabel: '发货人具体信息'
		},
		{
			label: '收货人',
			value: 'receiver',
			contentLabel: '收货人具体信息'
		},
		{
			label: '通知人',
			value: 'notifier',
			contentLabel: '通知人具体信息'
		}
	])
	// 是否确认
	const IS_CONFIRM_LIST = ref([{
			label: '未确认',
			value: 0
		},
		{
			label: '已确认',
			value: 1
		}
	])
	// 操作员
	const OPERATION_USER = ref([])
	// 单证员
	const DOCUMENT_USER = ref([])
	// 商务
	const COMMERCE_USER = ref([])
	const type_content_label = ref('收货人具体信息')
	
	// function getSelectDataList(){  // 角色  1  超管  2  操作  3 单证  4 商务
	// 	Promise.all([userDataSelect('OPERATE'), userDataSelect('DOCUMENT'), userDataSelect('COMMERCE')]).then(([operates,documents,commerces]) => {
	// 		OPERATION_USER.value= operates?operates: []
	// 		DOCUMENT_USER.value= documents?documents: []
	// 		COMMERCE_USER.value= commerces?commerces: []

	// 		if(userStore.userRole !== 1){
	// 			if(userStore.userRole=== 2){
	// 				userSelectEdit(OPERATION_USER.value,form.value.operation_user_ids)
	// 			}else if(userStore.userRole=== 3){
	// 				userSelectEdit(DOCUMENT_USER.value,form.value.document_user_ids)
	// 			}else if(userStore.userRole=== 4){
	// 				userSelectEdit(COMMERCE_USER.value,form.value.commerce_user_ids)
	// 			}
	// 		}
			
	// 	})
	// }
	// function userDataSelect(code){
	// 	return new Promise((resolve, reject) => {
	// 	  userListData({
	// 	  	is_paginate: 0,
	// 	  	code: code
	// 	  }).then(response => {
	// 	  	resolve(response.data)
	// 	  }).catch((e) =>reject(e))
	// 	  .finally(()=>{})
	// 	})
	// } 
	//  已确认默认增加自己的共享权限
	function userSelectEdit(list,val){
		if(!val.find(item => item=== userStore.id)){
			val.push(userStore.id)
		}
	}
	// getSelectDataList()
	// 获取收发通类型后的提示文字
	function getTypeContentLabel(type){
		var label = TYPE_LIST.value.find(item =>{item.value=== type});
		if(label){
			type_content_label.value = label.contentLabel
		}
	}
	// 是否确认
	function getIsConfirmValue(e){
		if(e=== 1 && (roleTypeNowList.value.includes(userStore.userRoleCode))){
			if(userStore.userRoleCode=== 'OPERATE'){
				userSelectEdit(OPERATION_USER.value,form.value.operation_user_ids)
			}else if(userStore.userRoleCode=== 'DOCUMENT'){
				userSelectEdit(DOCUMENT_USER.value,form.value.document_user_ids)
			}else if(userStore.userRoleCode=== 'COMMERCE'){
				userSelectEdit(COMMERCE_USER.value,form.value.commerce_user_ids)
			}
		}
	}
	// 必填
	function checkInfo(){
		if((!form.value.commerce_user_ids || form.value.commerce_user_ids.length=== 0) && (!form.value.operation_user_ids || form.value.operation_user_ids.length=== 0) && (!form.value.document_user_ids || form.value.document_user_ids.length=== 0)){
			proxy.$modal.msgWarning("请选择至少一个共享人");
			return false;
		}
		return true;
	}
	// 提交/保存
	function submitForm(){
		console.log(form.value)
		if(!checkInfo()) return;
		proxy.$refs["formRef"].validate(valid => {
		  if (valid) {
		    if (props.btnType=== 'add') {
		      addDataForm()
		    } else {
		      updateDataForm()
		    }
		  }
		});
	}
	// 备注可换行
	function handleKeyCode(event){
		console.log(1111)
		console.log(event,'event')
		if (event.keyCode == 13) {
		  if (!event.ctrlKey) {
			  event.preventDefault();
			} else {
			  form.value.remark += "\n";
			}
		}

	}
	// --------------------接口-------------------------
	function addDataForm(){
		let param = JSON.parse(JSON.stringify(form.value));
		param.operation_user_ids = JSON.stringify(param.operation_user_ids);
		param.document_user_ids = JSON.stringify(param.document_user_ids);
		param.commerce_user_ids = JSON.stringify(param.commerce_user_ids);
		addData(param).then(response => {
		  proxy.$modal.msgSuccess("新增成功");
		  cancel()
		  // open.value = false;
		  // getList();
		});
	}
	function updateDataForm(){
		let param = JSON.parse(JSON.stringify(form.value));
		param.operation_user_ids = JSON.stringify(param.operation_user_ids);
		param.document_user_ids = JSON.stringify(param.document_user_ids);
		param.commerce_user_ids = JSON.stringify(param.commerce_user_ids);
		updateData(param).then(response => {
		  proxy.$modal.msgSuccess("修改成功")
		  cancel()
		  // open.value = false;
		  // getList();
		});
	}
	
	const cancel = () =>{
		roleTypeUserIdList.value= []
	    Emit('handleCancle');
	  // openView.value= false
	}
	
</script>

<style>
	.send-and-receive .el-form-item__label{
		width: 120px !important;
	}
	#myTextarea {
	white-space: pre-wrap;
	}
	.generate_dialog{
		top: 20%
	}
	.generate_dialog .el-textarea__inner{
		padding-bottom: 40px
	}
</style>
<style scoped>
	.dialog-footer{
		text-align: right
	}
</style>