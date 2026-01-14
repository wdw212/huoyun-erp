<template>
	<div>
		<table-list 
		    :tableConfig="tableConfig" 
		    :tableColumn="tableColumn" 
		    :toolbar="true" 
		    class="px-2" 
		    ref="tableList" 
		    :number="true" 
		    :multiple="false"
		  >
		    <template #headerCon></template>
		    <template #headerLeft> </template>
		    <template #headerRight>
		      <el-button type="primary" plain icon="Plus" @click="addDocument()" class="mb-1 mr-1">新增</el-button>
		    </template>
		  </table-list>
		  <el-dialog v-model="dialogFormVisible" title="新增" width="90%" :close-on-click-modal="false">
			  <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
			  	<el-row :gutter="10">
					<el-col :span="12">
						<el-form-item label="当前新增项">
							<el-radio v-model="radio1" label="2">公告</el-radio>
							  <el-radio v-model="radio1" label="1">投票</el-radio>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="编号">
							<el-input v-model="form.code" placeholder="请输入名称"/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="是否必选">
							<el-select v-model="form.code" placeholder="请选择是否必选" clearable>
								<el-option v-for="item in optionsComm['是否必选']" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="是否单选">
							<el-select v-model="form.code" placeholder="请选择是否单选" clearable>
								<el-option v-for="item in optionsComm['是否单选']" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="建议栏是否必填">
							<el-select v-model="form.code" placeholder="请选择是否必选" clearable>
								<el-option v-for="item in optionsComm['是否必选']" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="可参与人员" prop="code">
							<el-cascader
							    :options="options"
							    :props="props"
							    clearable></el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="公告栏内容" prop="code">
							<editor v-model="form.content" :min-height="300" />
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="投票选项">
							<div class="d-flex w-100 mb-2 a-center" v-for="(item,index) in voteContentList" :key="index">
								<span style="width: 36px;height: 36px;background-color: #409EFF;color: #fff;line-height: 36px;text-align: center;border-radius: 5px;margin-right: 5px;">{{item.label}}</span>
								<el-input :value="item.name" placeholder="请输入选项内容"/>
								<el-button type="danger" @click="deleteVoteContent" class="ml-2" v-if="voteContentList.length> 2">删 除</el-button>
							</div>
							<el-button type="primary" @click="addVoteContentList" v-if="voteContentList.length< 6">增 加</el-button>
						</el-form-item>
					</el-col>
			  	</el-row>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="submitForm">立即发布</el-button>
					<el-button @click="cancel">取 消</el-button>
				</div>
			</template>
		  </el-dialog>
		  <el-dialog v-model="dialogFormVisibleTest" title="员工投票栏" width="90%" :close-on-click-modal="false">
				<p>今天吃啥呀？这种情况下我可以显示公告+投票公告可以多行<p></p>，或者换行显示投票可以设置 是否单选 多选(必填且单选)</p>
				<div class="mt-1">
					<el-radio-group v-model="radio1">
					  <el-radio label="1" border style="flex1" class="my-1">大盘鸡</el-radio>
					  <el-radio label="2" border style="flex2" class="my-1">口水鸡</el-radio>
					  <el-radio label="2" border style="flex2" class="my-1">白切鸡</el-radio>
					  <el-radio label="2" border style="flex2" class="my-1">走地鸡</el-radio>
					  <el-radio label="2" border style="flex2" class="my-1">老母鸡</el-radio>
					</el-radio-group>
					<!-- <el-checkbox-group v-model="checkList">
					    <el-checkbox label="复选框 A20260114-财务测试人员120260114-财务测试人员120260114-财务测试人员120260114-财务测试人员120260114-财务测试人员1" border class="my-1"></el-checkbox>
					    <el-checkbox label="复选框 B" border class="my-1"></el-checkbox>
					    <el-checkbox label="复选框 C20260114-财务测试人员120260114-财务测试人员120260114-财务测试人员120260114-财务测试人员1" border class="my-1"></el-checkbox>
					    <el-checkbox label="禁用C20260114-财务测试人员120260114-财务测试人员120260114-财务测试人员120260114-财务测试人员1"  border class="my-1"></el-checkbox>
					    <el-checkbox label="选中且禁用"  border class="my-1"></el-checkbox>
					  </el-checkbox-group> -->
				</div>
				<el-input
				        type="textarea"
				        v-model="form.code"
				        placeholder="请输入建议"
				        :rows="3"
				        :maxrows="4"
				        class="flex-1"
				        style="resize: none;margin-top: 40px;"
				      />
				<template #footer>
					<div class="dialog-footer">
						<el-button type="primary" @click="submitForm">是否已阅读</el-button>
						<el-button type="primary" @click="submitForm">提交</el-button>
						<el-button @click="cancel">取 消</el-button>
					</div>
				</template>
		  </el-dialog>
		  
	</div>
	
</template>

<script setup>
	import {
		ElButton
	} from 'element-plus'
	import { httpPost, httpGet, httpPut, httpDelete } from '@/api/apiCommon';
	import { Close, Plus, Refresh } from '@element-plus/icons-vue'
	const { proxy } = getCurrentInstance();
	import TableList from "@/components/tableList/index";
	import { optionsComm } from '@/api/commonList';
	const dialogFormVisible = ref(false);
	const dialogFormVisibleTest = ref(true);
	const form=ref({code: ''})
	const props=ref({ multiple: true })
	const options=ref([{
          value: 1,
          label: '财务',
          children: [{
            value: 2,
            label: '20260114-财务测试人员1'
          }, {
            value: 7,
            label: '20260114-财务测试人员2'
          }, {
            value: 12,
            label: '20260114-财务测试人员3'
          }]
        }, {
          value: 17,
          label: '操作',
          children: [{
            value: 2,
            label: '20260114-操作测试人员1'
          }, {
            value: 7,
            label: '20260114-操作测试人员2'
          }, {
            value: 12,
            label: '20260114-操作测试人员3'
          }]
        }])
	const voteContentList= ref([
		{label: 'A', name: ''},
		{label: 'B', name: ''}
	])
	const voteContentLabel= ref(['A','B','C','D','E','F'])
	
	
	const radio1= ref('1')
	const checkList= ref(['复选框 A','复选框 B'])
	/** 查询列表 */
	const tableColumn = ref([
		{label: '名字',prop: 'name'},
		{label: '提交时间',prop: 'createTime'},
		{label: '是否阅读',prop: 'author'},
		{label: '编号',prop: 'name'},
		{label: '公告栏',prop: 'name'},
		{label: '投票内容',prop: 'name'},
		{label: '建议栏',prop: 'name'},
		{ 
			label: '操作',
			prop: 'actions',
			actions: [
				{
					label: '查看',
					onClick: (row) => handleLook(row),
					style: (row) => ({
					        display: row.is_claimed === 1 ? 'block' : 'none'
					    })
				},
				{
					label: '修改',
					onClick: (row) => handleEdit(row),
					style: (row) => ({
					        display: row.is_claimed === 1 ? 'none' : 'block'
					    })
				},
				{
					label: '删除',
					type: 'danger',
					onClick: (row) => handleDelete(row),
					style: (row) => ({
					        display: row.is_claimed === 1 ? 'none' : 'block'
					    })
				},
			],
			fixed: "right",
			width: '190px'
		}
	]);
	// const tableConfig = ref({
	// 	url: '/orders/commerce-index',
	// 	requestMethod: httpGet,
	// 	isQuery: false,
	// 	// tableRowClassName: (row, rowIndex) => {
	// 	// 	console.log('列表类名', row.id, rowIndex)
	// 	// 	if(row.is_delivery===2){
	// 	// 		return 'danger-row'
	// 	// 	}
	// 	// 	return '';
	// 	// }
	// })
	const tableConfig = ref({
		url: '/orders',
		requestMethod: httpGet,
		isQuery: true
	})
	
	// 增加投票选项
	const addVoteContentList = () => {
	  // 获取当前列表长度，作为新选项的label索引
	  const newIndex = voteContentList.value.length
	  // 添加新选项（label从voteContentLabel中取）
	  voteContentList.value.push({
	    label: voteContentLabel.value[newIndex],
	    name: ''
	  })
	}
	
	// 删除投票选项并重新整理label顺序
	const deleteVoteContent = (index) => {
	  if (voteContentList.value.length > 2) {
	    // 1. 删除指定索引的选项
	    voteContentList.value.splice(index, 1)
	    // 2. 重新遍历列表，重置所有label为连续的A、B、C...
	    voteContentList.value.forEach((item, idx) => {
	      item.label = voteContentLabel.value[idx]
	    })
	  }
	}

</script>

<style>
	.el-cascader{
		width: 100%;
	}
</style>