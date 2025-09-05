<template>
	<div>
		
		<el-upload ref="uploadRef" :action="baseUrl + '/uploads/file'"
			v-model:file-list="order_files" :on-change="handleFilesChange" :auto-upload="true"
			multiple :limit="props.limit"
			:show-file-list="props.showFile" :on-success="handleUploadSuccess"
			:on-error="handleUploadError">
			<div class="avatar-uploader" v-if="uploadType==1">
				<img v-if="fileList&&fileList.url"
				:src="fileList.url" 
				class="avatar" />
				<el-icon color="#8c939d" v-else><Plus /></el-icon>
			</div>
			<el-button type="primary" size="small" v-else>点击上传</el-button>
		</el-upload>
		
	</div>
</template>

<script setup>
	import { ref, defineProps, watch, defineExpose, defineEmits, onMounted } from "vue";
	
	const props = defineProps({
		modelValue: [String, Object, Array],
		// 展示类型
		uploadType: {
			type: Number,
			default: 0
		},
		// 数量限制
		limit: {
			type: Number,
			default: 5
		},
		// 大小限制(MB)
		fileSize: {
			type: Number,
			default: 5
		},
		// 文件类型, 例如['png', 'jpg', 'jpeg']
		fileType: {
			type: Array,
			default: () => ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "pdf"]
		},
		// 是否显示提示
		isShowTip: {
			type: Boolean,
			default: true
		},
		// 禁用组件（仅查看文件）
		disabled: {
			type: Boolean,
			default: false
		},
		// 是否显示文件列表
		showFile: {
			type: Boolean,
			default: true
		}
	})
	
	const baseUrl = import.meta.env.VITE_APP_BASE_API;
	const order_files = ref([]);
	const fileList = ref(null);
	const uploadRef = ref();
	
	onMounted(()=>{
		if(props.uploadType==1){
			fileList.value = {};
		}else{
			fileList.value = [];
		}
	})
	
	function handleFilesChange(uploadFile, uploadFiles) {
		// 更新文件列表
		// this.fileList = uploadFiles.map(file => file.raw);
		// console.log(uploadFiles);
		// uploadRef.value.submit();
		// console.log('order_files', uploadFile, uploadFiles,order_files.value);
	}
	
	const handleUploadSuccess = (response) => {
		console.log('上传成功:', response);
		if(props.uploadType==1){
			fileList.value = {
				path: response.path,
				url: response.url
			}
		}else{
			fileList.value.push({
				file: response.path,
				url: response.url
			})
		}
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

<style scoped>
	.avatar-uploader{
		width: 50px;
		height: 50px;
		border: 1px dashed var(--el-border-color);
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		transition: var(--el-transition-duration-fast);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.avatar{
		width: 50px;
		height: 50px;
	}
	
	.avatar-uploader:hover {
		border-color: var(--el-color-primary);
	}
</style>