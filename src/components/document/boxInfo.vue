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
	import { optionsComm, getCGS, getMT, getCHD, getXZLX, getLX, getZGDZ,getSJ } from '@/api/commonList';
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
	const SJ = ref([]);  //司机
	const containerTypeSourceLoading = ref(false);
	const fleetSourceLoading = ref(false);
	const driverSourceLoading = ref(false);
	const containerWharfSourceLoading = ref(false);

	const buildNoCacheQuery = () => ({ _t: Date.now() });
	
	const formListBox = ref([]);
	const FLEET_SNAPSHOT_TOKEN_PREFIX = '__fleet_snapshot__';
	const FLEET_LATEST_TOKEN_PREFIX = '__fleet_latest__';
	const DRIVER_SNAPSHOT_TOKEN_PREFIX = '__driver_snapshot__';
	const DRIVER_LATEST_TOKEN_PREFIX = '__driver_latest__';
	const CONTAINER_TYPE_SNAPSHOT_TOKEN_PREFIX = '__container_type_snapshot__';
	const CONTAINER_TYPE_LATEST_TOKEN_PREFIX = '__container_type_latest__';
	const CONTAINER_WHARF_SNAPSHOT_TOKEN_PREFIX = '__container_wharf_snapshot__';
	const CONTAINER_WHARF_LATEST_TOKEN_PREFIX = '__container_wharf_latest__';
	const CONTAINER_WHARF_FIELD_CONFIG = {
		pre_pull_wharf_id: {
			snapshotNamePaths: ['pre_pull_wharf_name', 'pre_pull_wharf', 'pre_pull_wharf_detail.name'],
			sourceKey: 'YT',
		},
		wharf_id: {
			snapshotNamePaths: ['wharf_name', 'wharf', 'wharf_detail.name'],
			sourceKey: 'MT',
		},
		drop_off_wharf_id: {
			snapshotNamePaths: ['drop_off_wharf_name', 'drop_off_wharf', 'drop_off_wharf_detail.name'],
			sourceKey: 'LX',
		},
	};
	const CONTAINER_WHARF_REFRESH_FIELDS = Object.keys(CONTAINER_WHARF_FIELD_CONFIG);

	function isContainerTypeSnapshotToken(value) {
		return typeof value === 'string' && value.startsWith(CONTAINER_TYPE_SNAPSHOT_TOKEN_PREFIX);
	}

	async function refreshContainerTypeSource() {
		if (containerTypeSourceLoading.value) return;
		containerTypeSourceLoading.value = true;
		try {
			const latestContainerTypes = await getXZLX(buildNoCacheQuery());
			XZLX.value = Array.isArray(latestContainerTypes) ? latestContainerTypes : [];
		} finally {
			containerTypeSourceLoading.value = false;
		}
	}

	function isContainerTypeLatestToken(value) {
		return typeof value === 'string' && value.startsWith(CONTAINER_TYPE_LATEST_TOKEN_PREFIX);
	}

	function parseContainerTypeToken(value) {
		if (isContainerTypeSnapshotToken(value)) {
			return value.slice(CONTAINER_TYPE_SNAPSHOT_TOKEN_PREFIX.length);
		}
		if (isContainerTypeLatestToken(value)) {
			return value.slice(CONTAINER_TYPE_LATEST_TOKEN_PREFIX.length);
		}
		return value;
	}

	function normalizeContainerTypeId(value) {
		const parsedValue = parseContainerTypeToken(value);
		if (parsedValue === '' || parsedValue === null || parsedValue === undefined) {
			return null;
		}
		return String(parsedValue);
	}

	function isFleetSnapshotToken(value) {
		return typeof value === 'string' && value.startsWith(FLEET_SNAPSHOT_TOKEN_PREFIX);
	}

	async function refreshFleetSource() {
		if (fleetSourceLoading.value) return;
		fleetSourceLoading.value = true;
		try {
			const latestFleets = await getCHD(buildNoCacheQuery());
			CHD.value = Array.isArray(latestFleets) ? latestFleets : [];
		} finally {
			fleetSourceLoading.value = false;
		}
	}

	function isFleetLatestToken(value) {
		return typeof value === 'string' && value.startsWith(FLEET_LATEST_TOKEN_PREFIX);
	}

	function parseFleetToken(value) {
		if (isFleetSnapshotToken(value)) {
			return value.slice(FLEET_SNAPSHOT_TOKEN_PREFIX.length);
		}
		if (isFleetLatestToken(value)) {
			return value.slice(FLEET_LATEST_TOKEN_PREFIX.length);
		}
		return value;
	}

	function normalizeFleetId(value) {
		const parsedValue = parseFleetToken(value);
		if (parsedValue === '' || parsedValue === null || parsedValue === undefined) {
			return null;
		}
		return String(parsedValue);
	}

	function isDriverSnapshotToken(value) {
		return typeof value === 'string' && value.startsWith(DRIVER_SNAPSHOT_TOKEN_PREFIX);
	}

	async function refreshDriverSource() {
		if (driverSourceLoading.value) return;
		driverSourceLoading.value = true;
		try {
			const latestDrivers = await getSJ(buildNoCacheQuery());
			SJ.value = Array.isArray(latestDrivers) ? latestDrivers : [];
		} finally {
			driverSourceLoading.value = false;
		}
	}

	function isDriverLatestToken(value) {
		return typeof value === 'string' && value.startsWith(DRIVER_LATEST_TOKEN_PREFIX);
	}

	function parseDriverToken(value) {
		if (isDriverSnapshotToken(value)) {
			return value.slice(DRIVER_SNAPSHOT_TOKEN_PREFIX.length);
		}
		if (isDriverLatestToken(value)) {
			return value.slice(DRIVER_LATEST_TOKEN_PREFIX.length);
		}
		return value;
	}

	function normalizeDriver(value) {
		const parsedValue = parseDriverToken(value);
		if (parsedValue === '' || parsedValue === null || parsedValue === undefined) {
			return '';
		}
		return String(parsedValue);
	}

	function getPathValue(source = {}, path = '') {
		if (!source || !path) return undefined;
		return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), source);
	}

	function getFormItemByKey(fieldKey) {
		return formListBox.value?.[0]?.formData?.[0]?.formItem?.find((item) => item.key === fieldKey);
	}

	function getContainerWharfSourceByField(fieldKey) {
		const sourceKey = CONTAINER_WHARF_FIELD_CONFIG[fieldKey]?.sourceKey;
		if (sourceKey === 'YT') return YT.value;
		if (sourceKey === 'LX') return LX.value;
		return MT.value;
	}

	function splitYardWharfSourceByType(list = []) {
		const sourceList = Array.isArray(list) ? list : [];
		const normalizeType = (value) => {
			if (value === null || value === undefined || value === '') return null;
			const numberValue = Number(value);
			return Number.isNaN(numberValue) ? null : numberValue;
		};
		const prePullList = sourceList.filter((item) => normalizeType(item?.type) === 0);
		const dropOffList = sourceList.filter((item) => normalizeType(item?.type) === 1);
		return { prePullList, dropOffList };
	}

	function buildContainerWharfToken(prefix, fieldKey, originId) {
		return `${prefix}${fieldKey}::${originId}`;
	}

	function parseContainerWharfToken(value) {
		if (typeof value !== 'string') return null;
		const parseWithPrefix = (prefix, type) => {
			if (!value.startsWith(prefix)) return null;
			const payload = value.slice(prefix.length);
			const separatorIndex = payload.indexOf('::');
			if (separatorIndex < 0) return null;
			return {
				type,
				fieldKey: payload.slice(0, separatorIndex),
				originId: payload.slice(separatorIndex + 2),
			};
		};
		return (
			parseWithPrefix(CONTAINER_WHARF_SNAPSHOT_TOKEN_PREFIX, 'snapshot') ||
			parseWithPrefix(CONTAINER_WHARF_LATEST_TOKEN_PREFIX, 'latest')
		);
	}

	function isContainerWharfSnapshotToken(value, fieldKey) {
		const parsedToken = parseContainerWharfToken(value);
		if (!parsedToken) return false;
		return parsedToken.type === 'snapshot' && (!fieldKey || parsedToken.fieldKey === fieldKey);
	}

	function isContainerWharfLatestToken(value, fieldKey) {
		const parsedToken = parseContainerWharfToken(value);
		if (!parsedToken) return false;
		return parsedToken.type === 'latest' && (!fieldKey || parsedToken.fieldKey === fieldKey);
	}

	function normalizeContainerWharfId(value, fieldKey) {
		const parsedToken = parseContainerWharfToken(value);
		const parsedValue = parsedToken && (!fieldKey || parsedToken.fieldKey === fieldKey)
			? parsedToken.originId
			: value;
		if (parsedValue === '' || parsedValue === null || parsedValue === undefined) {
			return null;
		}
		return String(parsedValue);
	}

	function getContainerWharfSnapshotName(fieldKey, boxData = {}) {
		const snapshotNamePaths = CONTAINER_WHARF_FIELD_CONFIG[fieldKey]?.snapshotNamePaths || [];
		for (const path of snapshotNamePaths) {
			const value = getPathValue(boxData, path);
			const trimmedValue = (value ?? '').toString().trim();
			if (trimmedValue) {
				return trimmedValue;
			}
		}
		return '';
	}

	function getContainerWharfSnapshotMetaKey(fieldKey, suffix) {
		return `__container_wharf_snapshot_${suffix}_${fieldKey}`;
	}

	function clearContainerWharfSnapshotMeta(boxData = {}, fieldKey, clearRefresh = false) {
		if (!fieldKey) return;
		delete boxData[getContainerWharfSnapshotMetaKey(fieldKey, 'origin_id')];
		delete boxData[getContainerWharfSnapshotMetaKey(fieldKey, 'name')];
		if (clearRefresh) {
			delete boxData[getContainerWharfSnapshotMetaKey(fieldKey, 'refresh')];
		}
	}

	function syncContainerWharfRefreshFlag(boxData = {}) {
		const hasRefreshField = CONTAINER_WHARF_REFRESH_FIELDS.some((fieldKey) => {
			const refreshMetaKey = getContainerWharfSnapshotMetaKey(fieldKey, 'refresh');
			return !!boxData?.[refreshMetaKey];
		});
		if (hasRefreshField) {
			boxData.__container_wharf_snapshot_refresh = 1;
		} else {
			delete boxData.__container_wharf_snapshot_refresh;
		}
	}

	function setContainerWharfRefreshField(boxData = {}, fieldKey, enabled) {
		const refreshMetaKey = getContainerWharfSnapshotMetaKey(fieldKey, 'refresh');
		if (enabled) {
			boxData[refreshMetaKey] = 1;
		} else {
			delete boxData[refreshMetaKey];
		}
		syncContainerWharfRefreshFlag(boxData);
	}

	function refreshContainerWharfOptionsForField(boxData = {}, fieldKey) {
		const wharfFormItem = getFormItemByKey(fieldKey);
		if (!wharfFormItem) return;
		const latestSource = getContainerWharfSourceByField(fieldKey);
		const latestOptions = Array.isArray(latestSource) ? latestSource
			.map((item) => ({
				...item,
				id: normalizeContainerWharfId(item?.id, fieldKey),
			}))
			.filter((item) => item.id !== null) : [];
		const wharfId = normalizeContainerWharfId(boxData?.[fieldKey], fieldKey);
		const snapshotName = getContainerWharfSnapshotName(fieldKey, boxData);
		if (!wharfId || !snapshotName) {
			wharfFormItem.options = latestOptions;
			boxData[fieldKey] = wharfId;
			clearContainerWharfSnapshotMeta(boxData, fieldKey, true);
			syncContainerWharfRefreshFlag(boxData);
			return;
		}

		const latestMatch = latestOptions.find((item) => String(item.id) === String(wharfId));
		const latestName = (latestMatch?.name || '').toString().trim();
		if (latestName && latestName === snapshotName) {
			wharfFormItem.options = latestOptions;
			boxData[fieldKey] = wharfId;
			clearContainerWharfSnapshotMeta(boxData, fieldKey, false);
			syncContainerWharfRefreshFlag(boxData);
			return;
		}

		const snapshotToken = buildContainerWharfToken(CONTAINER_WHARF_SNAPSHOT_TOKEN_PREFIX, fieldKey, wharfId);
		const latestToken = buildContainerWharfToken(CONTAINER_WHARF_LATEST_TOKEN_PREFIX, fieldKey, wharfId);
		const otherLatestOptions = latestOptions.filter((item) => String(item.id) !== String(wharfId));
		const latestOption = latestMatch ? [{
			...latestMatch,
			id: latestToken,
			__containerWharfLatestOption: true,
			__originId: wharfId,
			__snapshotField: fieldKey,
		}] : [];
		wharfFormItem.options = [
			{
				...(latestMatch || {}),
				id: snapshotToken,
				name: snapshotName,
				__snapshotOption: true,
				__snapshotField: fieldKey,
				__originId: wharfId,
			},
			...latestOption,
			...otherLatestOptions,
		];
		boxData[fieldKey] = snapshotToken;
		boxData[getContainerWharfSnapshotMetaKey(fieldKey, 'origin_id')] = wharfId;
		boxData[getContainerWharfSnapshotMetaKey(fieldKey, 'name')] = snapshotName;
	}

	function refreshContainerWharfOptionsForBox(boxData = {}) {
		CONTAINER_WHARF_REFRESH_FIELDS.forEach((fieldKey) => {
			refreshContainerWharfOptionsForField(boxData, fieldKey);
		});
	}

	function syncContainerWharfValueToForm(boxData = {}) {
		if (!proxy?.$refs?.boxInfoForm) return;
		proxy.$refs.boxInfoForm.changeSave({
			pre_pull_wharf_id: boxData?.pre_pull_wharf_id ?? null,
			wharf_id: boxData?.wharf_id ?? null,
			drop_off_wharf_id: boxData?.drop_off_wharf_id ?? null,
		});
	}

	function refreshCurrentContainerWharfOptions() {
		const currentBox = state.boxList?.[state.boxIndex] || {};
		refreshContainerWharfOptionsForBox(currentBox);
		syncContainerWharfValueToForm(currentBox);
	}

	async function refreshContainerWharfSource(fieldKey) {
		if (containerWharfSourceLoading.value) return;
		containerWharfSourceLoading.value = true;
		try {
			if (!fieldKey || fieldKey === 'wharf_id') {
				const latestWharves = await getMT(buildNoCacheQuery());
				MT.value = Array.isArray(latestWharves) ? latestWharves : [];
			}
			if (!fieldKey || fieldKey === 'pre_pull_wharf_id' || fieldKey === 'drop_off_wharf_id') {
				// 始终拉全量后本地按 type 拆分，避免接口过滤参数导致的旧数据问题
				const latestYardWharves = await getLX(buildNoCacheQuery());
				const { prePullList, dropOffList } = splitYardWharfSourceByType(latestYardWharves);
				YT.value = prePullList;
				LX.value = dropOffList;
			}
		} finally {
			containerWharfSourceLoading.value = false;
		}
	}

	async function handleContainerWharfSelectVisibleChange(visible, item) {
		if (!visible || !item?.key) return;
		await refreshContainerWharfSource(item.key);
		const currentBox = state.boxList?.[state.boxIndex] || {};
		refreshContainerWharfOptionsForField(currentBox, item.key);
		syncContainerWharfValueToForm(currentBox);
		updateKeyRemark(currentBox);
	}

	function bindFormItemVisibleChangeHandlers(formConfigList = []) {
		const handlerMap = {
			container_type_id: handleContainerTypeSelectVisibleChange,
			pre_pull_wharf_id: handleContainerWharfSelectVisibleChange,
			wharf_id: handleContainerWharfSelectVisibleChange,
			drop_off_wharf_id: handleContainerWharfSelectVisibleChange,
			fleet_id: handleFleetSelectVisibleChange,
		};
		formConfigList.forEach((tabItem) => {
			tabItem?.formData?.forEach((formDataItem) => {
				formDataItem?.formItem?.forEach((formItem) => {
					if (!formItem?.key) return;
					const handler = handlerMap[formItem.key];
					if (handler) {
						formItem.onVisibleChange = handler;
					}
				});
			});
		});
		return formConfigList;
	}

	function getContainerTypeFormItem() {
		return getFormItemByKey('container_type_id');
	}

	function getContainerTypeSnapshotName(boxData = {}) {
		return (
			boxData?.container_type_name ||
			boxData?.container_type ||
			boxData?.container_type_detail?.name ||
			''
		).toString().trim();
	}

	function clearContainerTypeSnapshotMeta(boxData = {}) {
		delete boxData.__container_type_snapshot_origin_id;
		delete boxData.__container_type_snapshot_name;
	}

	function refreshContainerTypeOptionsForBox(boxData = {}) {
		const containerTypeFormItem = getContainerTypeFormItem();
		if (!containerTypeFormItem) return;

		const latestOptions = Array.isArray(XZLX.value) ? XZLX.value
			.map((item) => ({
				...item,
				id: normalizeContainerTypeId(item?.id),
			}))
			.filter((item) => item.id !== null) : [];
		const containerTypeId = normalizeContainerTypeId(boxData?.container_type_id);
		const snapshotName = getContainerTypeSnapshotName(boxData);
		if (!containerTypeId || !snapshotName) {
			containerTypeFormItem.options = latestOptions;
			boxData.container_type_id = containerTypeId;
			clearContainerTypeSnapshotMeta(boxData);
			return;
		}

		const latestMatch = latestOptions.find((item) => String(item.id) === String(containerTypeId));
		const latestName = (latestMatch?.name || '').toString().trim();
		if (latestName && latestName === snapshotName) {
			containerTypeFormItem.options = latestOptions;
			boxData.container_type_id = containerTypeId;
			clearContainerTypeSnapshotMeta(boxData);
			return;
		}

		const containerTypeSnapshotToken = `${CONTAINER_TYPE_SNAPSHOT_TOKEN_PREFIX}${containerTypeId}`;
		const containerTypeLatestToken = `${CONTAINER_TYPE_LATEST_TOKEN_PREFIX}${containerTypeId}`;
		const otherLatestOptions = latestOptions.filter((item) => String(item.id) !== String(containerTypeId));
		const latestOption = latestMatch ? [{
			...latestMatch,
			id: containerTypeLatestToken,
			__containerTypeLatestOption: true,
			__originId: containerTypeId,
		}] : [];
		containerTypeFormItem.options = [
			{
				id: containerTypeSnapshotToken,
				name: snapshotName,
				__snapshotOption: true,
				__snapshotField: 'container_type_id',
				__originId: containerTypeId,
			},
			...latestOption,
			...otherLatestOptions,
		];
		boxData.container_type_id = containerTypeSnapshotToken;
		boxData.__container_type_snapshot_origin_id = containerTypeId;
		boxData.__container_type_snapshot_name = snapshotName;
	}

	function syncContainerTypeValueToForm(boxData = {}) {
		if (!proxy?.$refs?.boxInfoForm) return;
		proxy.$refs.boxInfoForm.changeSave({
			container_type_id: boxData?.container_type_id ?? null,
			container_type_name: boxData?.container_type_name || '',
		});
	}

	function refreshCurrentContainerTypeOptions() {
		const currentBox = state.boxList?.[state.boxIndex] || {};
		refreshContainerTypeOptionsForBox(currentBox);
		syncContainerTypeValueToForm(currentBox);
	}

	async function handleContainerTypeSelectVisibleChange(visible) {
		if (!visible) return;
		await refreshContainerTypeSource();
		refreshCurrentContainerTypeOptions();
	}

	function getFleetFormItem() {
		return getFormItemByKey('fleet_id');
	}

	function getFleetSnapshotName(boxData = {}) {
		return (
			boxData?.fleet_name ||
			boxData?.fleet ||
			boxData?.fleet_detail?.name ||
			''
		).toString().trim();
	}

	function clearFleetSnapshotMeta(boxData = {}) {
		delete boxData.__fleet_snapshot_origin_id;
		delete boxData.__fleet_snapshot_name;
	}

	function refreshFleetOptionsForBox(boxData = {}) {
		const fleetFormItem = getFleetFormItem();
		if (!fleetFormItem) return;

		const latestOptions = Array.isArray(CHD.value) ? CHD.value
			.map((item) => ({
				...item,
				id: normalizeFleetId(item?.id),
			}))
			.filter((item) => item.id !== null) : [];
		const fleetId = normalizeFleetId(boxData?.fleet_id);
		const snapshotName = getFleetSnapshotName(boxData);
		if (!fleetId || !snapshotName) {
			fleetFormItem.options = latestOptions;
			boxData.fleet_id = fleetId;
			clearFleetSnapshotMeta(boxData);
			return;
		}

		const latestMatch = latestOptions.find((item) => String(item.id) === String(fleetId));
		const latestName = (latestMatch?.name || '').toString().trim();
		if (latestName && latestName === snapshotName) {
			fleetFormItem.options = latestOptions;
			boxData.fleet_id = fleetId;
			clearFleetSnapshotMeta(boxData);
			return;
		}

		const fleetSnapshotToken = `${FLEET_SNAPSHOT_TOKEN_PREFIX}${fleetId}`;
		const fleetLatestToken = `${FLEET_LATEST_TOKEN_PREFIX}${fleetId}`;
		const otherLatestOptions = latestOptions.filter((item) => String(item.id) !== String(fleetId));
		const latestOption = latestMatch ? [{
			...latestMatch,
			id: fleetLatestToken,
			__fleetLatestOption: true,
			__originId: fleetId,
		}] : [];
		fleetFormItem.options = [
			{
				id: fleetSnapshotToken,
				name: snapshotName,
				__snapshotOption: true,
				__snapshotField: 'fleet_id',
				__originId: fleetId,
			},
			...latestOption,
			...otherLatestOptions,
		];
		boxData.fleet_id = fleetSnapshotToken;
		boxData.__fleet_snapshot_origin_id = fleetId;
		boxData.__fleet_snapshot_name = snapshotName;
	}

	function refreshCurrentFleetOptions() {
		const currentBox = state.boxList?.[state.boxIndex] || {};
		refreshFleetOptionsForBox(currentBox);
		syncFleetValueToForm(currentBox);
	}

	async function handleFleetSelectVisibleChange(visible) {
		if (!visible) return;
		await refreshFleetSource();
		refreshCurrentFleetOptions();
	}

	function syncFleetValueToForm(boxData = {}) {
		if (!proxy?.$refs?.boxInfoForm) return;
		proxy.$refs.boxInfoForm.changeSave({
			fleet_id: boxData?.fleet_id ?? null,
			fleet_name: boxData?.fleet_name || '',
		});
	}

	function getDriverFormItem() {
		return getFormItemByKey('driver');
	}

	function getDriverSnapshotName(boxData = {}) {
		return (
			boxData?.driver_name ||
			boxData?.driver_detail ||
			boxData?.driver ||
			''
		).toString().trim();
	}

	function clearDriverSnapshotMeta(boxData = {}) {
		delete boxData.__driver_snapshot_origin;
		delete boxData.__driver_snapshot_name;
	}

	function refreshDriverOptionsForBox(boxData = {}) {
		const driverFormItem = getDriverFormItem();
		if (!driverFormItem) return;

		const latestOptions = Array.isArray(SJ.value) ? SJ.value
			.map((item) => ({
				...item,
				id: item?.name || item?.id,
			}))
			.filter((item) => item.id) : [];
		const driver = normalizeDriver(boxData?.driver);
		const snapshotName = getDriverSnapshotName(boxData);
		if (!driver || !snapshotName) {
			driverFormItem.options = latestOptions;
			boxData.driver = driver;
			clearDriverSnapshotMeta(boxData);
			return;
		}

		const latestMatch = latestOptions.find((item) => String(item.id) === String(driver));
		const latestName = (latestMatch?.name || latestMatch?.id || '').toString().trim();
		if (latestName && latestName === snapshotName) {
			driverFormItem.options = latestOptions;
			boxData.driver = driver;
			clearDriverSnapshotMeta(boxData);
			return;
		}

		const driverSnapshotToken = `${DRIVER_SNAPSHOT_TOKEN_PREFIX}${driver}`;
		const driverLatestToken = `${DRIVER_LATEST_TOKEN_PREFIX}${driver}`;
		const otherLatestOptions = latestOptions.filter((item) => String(item.id) !== String(driver));
		const latestOption = latestName && latestName !== snapshotName ? [{
			id: driverLatestToken,
			name: latestName,
			__driverLatestOption: true,
			__originId: driver,
		}] : [];
		driverFormItem.options = [
			{
				id: driverSnapshotToken,
				name: snapshotName,
				__snapshotOption: true,
				__snapshotField: 'driver',
				__originId: driver,
			},
			...latestOption,
			...otherLatestOptions,
		];
		boxData.driver = driverSnapshotToken;
		boxData.__driver_snapshot_origin = driver;
		boxData.__driver_snapshot_name = snapshotName;
	}

	function refreshCurrentDriverOptions() {
		const currentBox = state.boxList?.[state.boxIndex] || {};
		refreshDriverOptionsForBox(currentBox);
		syncDriverValueToForm(currentBox);
	}

	async function handleDriverSelectVisibleChange(visible) {
		if (!visible) return;
		await refreshDriverSource();
		refreshCurrentDriverOptions();
	}

	function syncDriverValueToForm(boxData = {}) {
		if (!proxy?.$refs?.boxInfoForm) return;
		proxy.$refs.boxInfoForm.changeSave({
			driver: boxData?.driver ?? '',
			driver_name: boxData?.driver_name || '',
		});
	}

	function normalizeFleetSnapshotBox(boxData = {}) {
		const normalizedBox = JSON.parse(JSON.stringify(boxData || {}));
		normalizedBox.container_type_id = normalizeContainerTypeId(normalizedBox.container_type_id);
		normalizedBox.fleet_id = normalizeFleetId(normalizedBox.fleet_id);
		normalizedBox.driver = normalizeDriver(normalizedBox.driver);
		normalizedBox.pre_pull_wharf_id = normalizeContainerWharfId(normalizedBox.pre_pull_wharf_id, 'pre_pull_wharf_id');
		normalizedBox.wharf_id = normalizeContainerWharfId(normalizedBox.wharf_id, 'wharf_id');
		normalizedBox.drop_off_wharf_id = normalizeContainerWharfId(normalizedBox.drop_off_wharf_id, 'drop_off_wharf_id');
		if (normalizedBox.__container_type_snapshot_refresh) {
			normalizedBox.container_type_snapshot_refresh = 1;
		} else {
			delete normalizedBox.container_type_snapshot_refresh;
		}
		if (normalizedBox.__fleet_snapshot_refresh) {
			normalizedBox.fleet_snapshot_refresh = 1;
		} else {
			delete normalizedBox.fleet_snapshot_refresh;
		}
		const hasContainerWharfRefresh = !!normalizedBox.__container_wharf_snapshot_refresh
			|| CONTAINER_WHARF_REFRESH_FIELDS.some((fieldKey) => {
				const refreshMetaKey = getContainerWharfSnapshotMetaKey(fieldKey, 'refresh');
				return !!normalizedBox[refreshMetaKey];
			});
		if (hasContainerWharfRefresh) {
			normalizedBox.container_wharf_snapshot_refresh = 1;
		} else {
			delete normalizedBox.container_wharf_snapshot_refresh;
		}
		delete normalizedBox.__container_type_snapshot_origin_id;
		delete normalizedBox.__container_type_snapshot_name;
		delete normalizedBox.__container_type_snapshot_refresh;
		delete normalizedBox.__fleet_snapshot_origin_id;
		delete normalizedBox.__fleet_snapshot_name;
		delete normalizedBox.__fleet_snapshot_refresh;
		delete normalizedBox.__container_wharf_snapshot_refresh;
		CONTAINER_WHARF_REFRESH_FIELDS.forEach((fieldKey) => {
			delete normalizedBox[getContainerWharfSnapshotMetaKey(fieldKey, 'origin_id')];
			delete normalizedBox[getContainerWharfSnapshotMetaKey(fieldKey, 'name')];
			delete normalizedBox[getContainerWharfSnapshotMetaKey(fieldKey, 'refresh')];
		});
		return normalizedBox;
	}

	function normalizeFleetSnapshotBoxList(boxList = []) {
		if (!Array.isArray(boxList)) return [];
		return boxList.map((item) => normalizeFleetSnapshotBox(item));
	}

	function emitBoxInfoChange() {
		emit('boxInfoChange', normalizeFleetSnapshotBoxList(state.boxList));
	}
	
	onMounted(async () => {
		// console.log('boxInfo', props);
		await refreshContainerWharfSource();
		await refreshFleetSource();
		await refreshContainerTypeSource();
		ZGDZ.value = await getZGDZ();
		SJ.value = await getSJ();
		formList.value[0].formData[0].formItem[2].options = XZLX.value;
		formList.value[0].formData[0].formItem[4].options = YT.value;
		formList.value[0].formData[0].formItem[5].options = MT.value;
		formList.value[0].formData[0].formItem[6].options = LX.value;
		formList.value[0].formData[0].formItem[8].options = SJ.value;
		formList.value[0].formData[0].formItem[13].options = CHD.value;
		formListBox.value = bindFormItemVisibleChangeHandlers(JSON.parse(JSON.stringify(formList.value)));
		refreshCurrentContainerTypeOptions();
		refreshCurrentFleetOptions();
		refreshCurrentDriverOptions();
		refreshCurrentContainerWharfOptions();

		ZGDZ.value = ZGDZ.value.map((item,index)=>{
			return {
				...item,
				label: item.keyword?item.keyword+'—'+item.address:item.address
			}
		})
		tableColumn2.value[0].form.options = ZGDZ.value;
		proxy.$refs.boxInfoForm.resetKey(formListBox.value);
		syncContainerTypeValueToForm(state.boxList?.[state.boxIndex] || {});
		syncFleetValueToForm(state.boxList?.[state.boxIndex] || {});
		syncDriverValueToForm(state.boxList?.[state.boxIndex] || {});
		syncContainerWharfValueToForm(state.boxList?.[state.boxIndex] || {});
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
			container_type_name: '',
			driver: null,
			drop_off_wharf_id: null,
			drop_off_wharf_name: '',
			fleet_id: null,
			fleet_name: '',
			is_entered_port: '0',
			loading_at: null,
			no: '箱号',
			pre_pull_wharf_id: null,
			pre_pull_wharf_name: '',
			seal_number: null,
			serial_number: null,
			wharf_id: null,
			wharf_name: '',
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
		const currentBox = state.boxList[state.boxIndex] || data;
		refreshContainerTypeOptionsForBox(currentBox);
		refreshFleetOptionsForBox(currentBox);
		refreshContainerWharfOptionsForBox(currentBox);
		proxy.$refs.boxInfoForm.changeSave(currentBox);
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
		emitBoxInfoChange();
		// console.log('boxList新增', state.boxIndex, state.boxList)
	}
	// 切换选中箱号
	const changeBox = (index) => {
		state.boxIndex = index;
		const currentBox = state.boxList[index] || {};
		console.log('changeBox239', state.boxList, currentBox)
		refreshContainerTypeOptionsForBox(currentBox);
		refreshFleetOptionsForBox(currentBox);
		refreshContainerWharfOptionsForBox(currentBox);
		var val = JSON.parse(JSON.stringify(currentBox));
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
			refreshContainerTypeOptionsForBox(val[0]);
			refreshFleetOptionsForBox(val[0]);
			refreshContainerWharfOptionsForBox(val[0]);
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
		refreshCurrentContainerTypeOptions();
		refreshCurrentFleetOptions();
		refreshCurrentContainerWharfOptions();
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
		const currentBox = normalizeFleetSnapshotBox(state.boxList[state.boxIndex] || {});
		var saveData = {
			...state.saveData,
			boxInfo: {
				...currentBox,
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
		const currentBox = normalizeFleetSnapshotBox(state.boxList[state.boxIndex] || {});
		var saveData = {
			...state.saveData,
			boxInfo: {
				...currentBox,
				container_items: proxy.$refs.tableListJMT.state.tableData,
			}
		};
		proxy.$refs.arrivalPort.openLoading(saveData, state.options);
	}
	//装箱单数据生成
	function openPackForm(open){
		if(proxy.$refs.tableListJMT&&proxy.$refs.tableListZGDZ){
			const currentBox = normalizeFleetSnapshotBox(state.boxList[state.boxIndex] || {});
			var newData = {
				...state.saveData,
				boxInfo: {
					...currentBox,
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
		if(item.key == 'container_type_id'){
			const currentBox = state.boxList[state.boxIndex] || {};
			const normalizedContainerTypeId = normalizeContainerTypeId(val);
			const selectedOption = item.options ? item.options.find(v=>{return String(v.id) == String(val)}) : null;
			const containerTypeData = XZLX.value.find(v=>{return String(v.id) == String(normalizedContainerTypeId)});
			currentBox.container_type_id = normalizedContainerTypeId;
			currentBox.container_type_name = selectedOption?.name || containerTypeData?.name || '';
			if (isContainerTypeLatestToken(val)) {
				currentBox.__container_type_snapshot_refresh = 1;
			} else if (isContainerTypeSnapshotToken(val)) {
				delete currentBox.__container_type_snapshot_refresh;
			}
			refreshContainerTypeOptionsForBox(currentBox);
		}
		if(item.key == 'fleet_id'){
			const currentBox = state.boxList[state.boxIndex] || {};
			const normalizedFleetId = normalizeFleetId(val);
			const selectedOption = item.options ? item.options.find(v=>{return String(v.id) == String(val)}) : null;
			const fleetData = CHD.value.find(v=>{return String(v.id) == String(normalizedFleetId)});
			currentBox.fleet_id = normalizedFleetId;
			currentBox.fleet_name = selectedOption?.name || fleetData?.name || '';
			if (isFleetLatestToken(val)) {
				currentBox.__fleet_snapshot_refresh = 1;
			} else if (isFleetSnapshotToken(val)) {
				delete currentBox.__fleet_snapshot_refresh;
			}
			refreshFleetOptionsForBox(currentBox);
		}
		if(CONTAINER_WHARF_FIELD_CONFIG[item.key]){
			const currentBox = state.boxList[state.boxIndex] || {};
			const fieldKey = item.key;
			const normalizedWharfId = normalizeContainerWharfId(val, fieldKey);
			const selectedOption = item.options ? item.options.find(v => { return String(v.id) == String(val) }) : null;
			const wharfSource = getContainerWharfSourceByField(fieldKey);
			const wharfData = Array.isArray(wharfSource)
				? wharfSource.find(v => { return String(v.id) == String(normalizedWharfId) })
				: null;
			const wharfName = selectedOption?.name || wharfData?.name || '';
			const wharfNameField = fieldKey.replace(/_id$/, '_name');
			const wharfAliasField = fieldKey.replace(/_id$/, '');
			currentBox[fieldKey] = normalizedWharfId;
			currentBox[wharfNameField] = wharfName;
			currentBox[wharfAliasField] = wharfName;
			if (isContainerWharfLatestToken(val, fieldKey)) {
				setContainerWharfRefreshField(currentBox, fieldKey, true);
			} else if (isContainerWharfSnapshotToken(val, fieldKey)) {
				setContainerWharfRefreshField(currentBox, fieldKey, false);
			}
			refreshContainerWharfOptionsForField(currentBox, fieldKey);
		}
		// state.boxList[state.boxIndex][item.key] = val;
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
				const normalizedContainerTypeId = normalizeContainerTypeId(vv.container_type_id);
				var container = item.options?item.options.find(v=>{return String(normalizeContainerTypeId(v.id)) == String(normalizedContainerTypeId)}):{};
				if((!container || !container.id) && normalizedContainerTypeId){
					container = XZLX.value.find(v=>{return String(v.id) == String(normalizedContainerTypeId)}) || {};
				}
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
		emitBoxInfoChange();
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
						{ labelWidth:'auto',type: 'select',value: '',label: '柜型',placeholder: '请选择柜型',key: 'container_type_id',options: [], labelName: 'name', valueName: 'id',rules: { required: true, message: '请选择柜型', trigger: 'change' }, onVisibleChange: handleContainerTypeSelectVisibleChange },
						{ labelWidth:'auto',type: 'input',value: '',label: '序列号',placeholder: '请输入序列号',key: 'serial_number' },
						{ labelWidth:'auto',type: 'select',value: '',label: '预提',placeholder: '请选择预提',key: 'pre_pull_wharf_id',options: [], labelName: 'name', valueName: 'id',popover: true, clearable: true, filterable: true, remark: '', onVisibleChange: handleContainerWharfSelectVisibleChange },
						{ labelWidth:'auto',type: 'select',value: '',label: '提箱码头',placeholder: '请选择提箱码头',key: 'wharf_id',options: [], labelName: 'name', valueName: 'id',popover: true, clearable: true, filterable: true, remark: '', onVisibleChange: handleContainerWharfSelectVisibleChange },
						{ labelWidth:'auto',type: 'select',value: '',label: '落箱',placeholder: '请选择落箱',key: 'drop_off_wharf_id',options: [], labelName: 'name', valueName: 'id',popover: true, clearable: true, filterable: true, remark: '', onVisibleChange: handleContainerWharfSelectVisibleChange },
						{ labelWidth:'auto',type: 'select',value: '',label: '是否进港',placeholder: '请选择是否进港',key: 'is_entered_port',options: optionsComm['是否进港'], clearable: true, filterable: true,defaultValue: '0' },
						{ labelWidth:'auto',type: 'select',value: '',label: '司机信息',placeholder: '请选择司机信息',key: 'driver', popover: true, options: [],labelName: 'name', valueName: 'id', clearable: true, filterable: true, onVisibleChange: handleDriverSelectVisibleChange },
						{ label: '进港数据', soltName: 'arrivalPort' },
						{ label: '件毛体', soltName: 'containerItemsBtn' },
						{ labelWidth:'auto',type: 'select',value: '',label: '运费情况',placeholder: '请选择运费情况',key: 'freight_status',options: optionsComm['运费情况'] },
						{ soltName: 'containerItemsTable', value: [], span: 24 },
						{ labelWidth:'auto',type: 'select',value: '',label: '车队',placeholder: '请选择车队',key: 'fleet_id',options: [], labelName: 'name', valueName: 'id', clearable: true, filterable: true, onVisibleChange: handleFleetSelectVisibleChange },
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
		emitBoxInfoChange();
	}
	const tableItemChangeJMT = (item, index) => {
		var dataNew = item.options?item.options.find(v=>{return v.address == item.value}):{};
		var tableDataNew = proxy.$refs.tableListJMT.state.tableData;
		state.boxList[state.boxIndex].container_items = tableDataNew;
		emitBoxInfoChange();
		// console.log('箱子数据', state.boxList)
	}
	const delete1 = (row, index) => {
		proxy.$refs.tableListJMT.state.tableData.splice(index, 1)
		state.boxList[state.boxIndex].container_items = proxy.$refs.tableListJMT.state.tableData;
		emitBoxInfoChange();
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
		emitBoxInfoChange();
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
		emitBoxInfoChange();
	}
	const delete2 = (row, index) => {
		proxy.$refs.tableListZGDZ.state.tableData.splice(index, 1)
		state.boxList[state.boxIndex].container_loading_addresses = proxy.$refs.tableListZGDZ.state.tableData;
		emitBoxInfoChange();
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
