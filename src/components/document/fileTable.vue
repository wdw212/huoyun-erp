<template>
	<div>
		<el-upload ref="uploadRef" :action="baseUrl + '/uploads/file'"
			v-model:file-list="order_files" :on-change="handleFilesChange" :auto-upload="false"
			multiple :show-file-list="false" :on-success="handleUploadSuccess"
			:on-error="handleUploadError">
			<el-button type="primary">点击上传</el-button>
		</el-upload>
		
		<el-table :data="order_files" border  style="margin-top: 20px;">
			<el-table-column label="文件名" align="center" prop="name" />
			<el-table-column label="大小" align="center" prop="size">
				<template #default="scope">
					{{ (scope.row.size / 1024).toFixed(2) }} KB
				</template>
			</el-table-column>
			<el-table-column label="状态" align="center" prop="status">
				<template #default="scope">
					<span v-if="scope.row.status === 'success'">上传成功</span>
					<span v-else-if="scope.row.status === 'error'">上传失败</span>
					<span v-else>等待上传</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="280"
				class-name="small-padding fixed-width">
				<template #default="scope">
					<el-button type="success"
						v-if="order_files[scope.$index].status === 'success'"
						@click="toUploadFile(form.order_files[scope.$index].url)">查看详情</el-button>
					<el-button plain type="danger" icon="Delete"
						@click="removeFile(scope.$index)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		
		<el-button style="margin-top: 20px;" type="success" @click="submitUploadFiles">确定上传</el-button>
	</div>
</template>

<script setup>
	import { ref, defineProps, watch, defineExpose, defineEmits, onMounted } from "vue";
	
	const baseUrl = import.meta.env.VITE_APP_BASE_API;
	const order_files = ref([]);
	const fileList = ref([]);
	const uploadRef = ref();
	
	function handleFilesChange(uploadFile, uploadFiles) {
		// 更新文件列表
		// this.fileList = uploadFiles.map(file => file.raw);
		// console.log(uploadFiles);
		// console.log(order_files.value);
	}
	
	// 手动触发上传
	const submitUploadFiles = () => {
		uploadRef.value.submit()
	}
	
	const handleUploadSuccess = (response) => {
		console.log('上传成功:', response);
		fileList.value.push({
			file: response.path,
			url: response.url
		})
		emit('uploadFile', fileList.value);
	};
	
	const handleUploadError = (error) => {
		console.error('上传失败:', error);
	};
	const removeFile = (index) => {
		console.log(order_files.value);
		order_files.value.splice(index, 1) // 从本地文件列表中移除
		fileList.value.splice(index, 1) // 从本地文件列表中移除
		emit('uploadFile', fileList.value);
	}
	
	function toUploadFile(url) {
		window.open(url)
	}
	
	function dafultFile(file) {
		fileList.value = file?file:[];
	}
	
	const emit = defineEmits(['uploadFile'])
	defineExpose({
		dafultFile
	})
</script>

<style>
</style>