<template>
	<div class="bill-of-lading-draft">
		<div class="header">
			<h1>宁波凌亚国际物流有限公司</h1>
			<div class="tit">提单草稿件PPPPP</div>
		</div>
		<table class="table1">
			<tbody>
				<tr>
					<td rowspan="2" colspan="2" class="bl-none" width="900">
						<div class="sub-tit">(2)Shipper/ Exporter</div>
						<div class="mt10">
							<el-select v-model="sender_id" placeholder="选择发货人" size="large" style="width: 440px" filterable
								@visible-change="() => getSelectDataList()"
								@change='senderChange'>
								<template #label="{ value }">
									<span>{{ resolvePartyDisplayName('sender', value) }}</span>
								</template>
								<el-option v-for="item in senderOptions" :key="item.id" :label="item.label"
									:value="item.id">
									<div :class="['snapshot-select-option', { 'is-snapshot': item.__snapshotOption }]">
										<span class="snapshot-select-option__name">{{ item.label }}</span>
										<span v-if="item.__snapshotOption" class="snapshot-select-option__tag is-snapshot">{{ item.__snapshotTagLabel || '历史快照' }}</span>
									</div>
								</el-option>
							</el-select>
						</div>

						<div class="mt10 mb10">
							<el-input v-model="sender_info" style="width: 440px" :rows="5" type="textarea"
								placeholder="具体发货人信息" />
						</div>
					</td>
					<td class="br-none" height="60">
						<div class="sub-tit">(5)Document No.</div>
						<div class="mt10 mb10 ml10">
							<el-input v-model="bl_no" style="width: 250px" type="text"
								placeholder="提单号，数据来源于单据中的提单号" />
						</div>
					</td>
				</tr>
				<tr>
					<td class="br-none">
						<div class="sub-tit">(6) Export References</div>
						<div class="mt10 mb10 ml10">
							<el-button type="primary" @click='openReceive'>舱单网址</el-button>
						</div>
						<div class="mt10 mb10 ml10">
							<el-button type="primary" @click='addCompanyHead'>增加收发通信息</el-button>
						</div>
					</td>
				</tr>
				<tr>
					<td colspan="2" class="bl-none">
						<div class="sub-tit">(3)Consignee(complete name and address)</div>
						<div class="mt10">
							<el-select v-model="receiver_id" placeholder="选择收货人" size="large" style="width: 440px" filterable
								@visible-change="() => getSelectDataList()"
								@change='receiveChange'>
								<template #label="{ value }">
									<span>{{ resolvePartyDisplayName('receiver', value) }}</span>
								</template>
								<el-option v-for="item in receiverOptions" :key="item.id" :label="item.label"
									:value="item.id">
									<div :class="['snapshot-select-option', { 'is-snapshot': item.__snapshotOption }]">
										<span class="snapshot-select-option__name">{{ item.label }}</span>
										<span v-if="item.__snapshotOption" class="snapshot-select-option__tag is-snapshot">{{ item.__snapshotTagLabel || '历史快照' }}</span>
									</div>
								</el-option>
							</el-select>
						</div>
						<div class="mt10 mb10">
							<el-input v-model="receiver_info" style="width: 440px" :rows="5" type="textarea"
								placeholder="具体收货人信息" />
						</div>
					</td>
					<td class="br-none">
						<div class="sub-tit">(7)Forwarding Agent-References</div>
						<div class="mt10 ml10">
							<el-input v-model="freight_forwarding" style="width: 440px" :rows="7" type="textarea"
								placeholder="请输入" />
						</div>
					</td>
				</tr>
				<tr>
					<td rowspan="2" colspan="2" class="bl-none">
						<div class="sub-tit">(4) Notify Party (complete name and address)</div>
						<div class="mt10">
							<el-select v-model="notifier_id" placeholder="选择通知人" size="large" style="width: 440px" filterable
								@visible-change="() => getSelectDataList()"
								@change='notiferChange'>
								<template #label="{ value }">
								    <span>{{ resolvePartyDisplayName('notifier', value) }}</span>
								</template>
								<el-option v-for="item in notifierOptions" :key="item.id" :label="item.label"
									:value="item.id">
									<div :class="['snapshot-select-option', { 'is-snapshot': item.__snapshotOption }]">
										<span class="snapshot-select-option__name">{{ item.label }}</span>
										<span v-if="item.__snapshotOption" class="snapshot-select-option__tag is-snapshot">{{ item.__snapshotTagLabel || '历史快照' }}</span>
									</div>
								</el-option>
							</el-select>
						</div>
						<div class="mt10 mb10">
							<el-input v-model="notifier_info" style="width: 440px" :rows="5" type="textarea"
								placeholder="具体通知人信息" />
						</div>
					</td>
					<td class="br-none">
						<div class="sub-tit">(8) Point and Country of Origin (for the Merchant's reference only)</div>
					</td>
				</tr>
				<tr>
					<td class="br-none">(9) Also Notify Party (complete name and address)</td>
				</tr>
				<tr>
					<td class="bl-none">(12)Pre-carriage By
						<p>&nbsp;</p>
					</td>
					<td>(13) Place of Receipt/Date
						<p>&nbsp;</p>
					</td>
					<td class="br-none"></td>
				</tr>
				<tr>
					<td class="bl-none">(14)Ocean Vessel/Voy.No.
						<div class="mt10 mb10">
							<el-input v-model="ship_info" style="width: 240px" type="text"
								placeholder="船名/航次，数据来源于单据中的船名/航次" />
						</div>
					</td>
					<td>(15) Port of Loading
						<div class="mt10 mb10 ml10">
							<el-input v-model="origin_port" style="width: 240px" type="text"
								placeholder="起运港，数据来源于单据中的起运港" />
						</div>
					</td>
					<td rowspan="2" class="br-none">(10) Onward inland Routing/Export instructions (which are contracted
						separately by Merchants entirely for their own account and risk)</td>
				</tr>
				<tr>
					<td class="bl-none">(16) Port of Discharge
						<div class="mt10 mb10">
							<el-input v-model="destination_port" style="width: 240px" type="text"
								placeholder="目的港，数据来源于单据中的目的港" />
						</div>
					</td>
					<td>(17)Place of Delivery</td>
				</tr>
			</tbody>
		</table>
		<h2>Particulars furnished by the Merchant</h2>
		<table class="table4">
			<tbody>
				<tr>
					<td class="bl-none">(18) Container No. And Seal No.Marks & Nos.</td>
					<td>
						(19)Quantity And Kind of Packages
					</td>
					<td>(20)Description of Goods</td>
					<td>
						(21)Gross Weight (KGS)
					</td>
					<td class="br-none">
						<div class="sub-tit">(22)Measurement(M³)</div>
					</td>
				</tr>
				<tr>
					<td class="bl-none">
						<p class="p1">CONTAINER NO./SEAL NO.</p>
						<div class="mt10 mb10" style="text-align: center">
							<el-input v-model="no" style="width: 300px" type="textarea" :rows="8"
								placeholder="箱封号，数据来源于箱子信息中的箱号/封号（有多组数据）" />
						</div>
						<p class="p2">TOTAL NUMBER OF CONTAINERS OR PACKAGES(IN WORDS)</p>
					</td>
					<td>
						<div class="mt10 p10">
							<el-input v-model="number" style="width: 150px" :rows="9" type="textarea"
								placeholder="件数" />
						</div>
					</td>
					<td>
						<div class="mt10 p10">
							<el-input v-model="description" style="width: 240px;font-size:12px" :rows="11"
								type="textarea" placeholder="货描" />
						</div>
					</td>
					<td>
						<div class="mt10 p10">
							<el-input v-model="gross_weight" style="width: 150px" :rows="9" type="textarea"
								placeholder="毛重" />
						</div>
					</td>
					<td class="br-none">
						<div class="mt10 p10">
							<el-input v-model="volume" style="width: 150px" :rows="9" type="textarea"
								placeholder="体积" @input="handleInput" />
						</div>
					</td>
				</tr>
			</tbody>
		</table>
		<table class="table2">
			<tbody>
				<tr>
					<td class="bl-none">(24)FREIGHT & CHARGES</td>
					<td>Revenue Tons</td>
					<td>Rate Per</td>
					<td>Prepaid
						<div class="aciton-btns">
							<el-radio-group v-model="radio3" size="large">
								<el-radio-button label="FREIGHT_PREPAID" value="FREIGHT_PREPAID" type="primary" />
							</el-radio-group>
						</div>
					</td>
					<td class="br-none">Collect
						<div class="aciton-btns">
							<el-radio-group v-model="radio3" size="large">
								<el-radio-button label="FREIGHT_COLLECT" value="FREIGHT_COLLECT" />
							</el-radio-group>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
		<table class="table3">
			<tbody>
				<tr>
					<td rowspan="2" class="bl-none">(25) B/L NO.</td>
					<td>(27) Number of Original B(s)/L</td>
					<td>(29) Prepaid at</td>
					<td class="br-none">(30) Collect at</td>
				</tr>
				<tr>
					<td>(28) Place of B(s)/L Issue/Date</td>
					<td>(31)Exchange Rate</td>
					<td class="br-none">(32)Exchange Rate</td>
				</tr>
				<tr>
					<td class="bl-none bb-none">(26) Service Type/Mode</td>
					<td colspan="3" class="br-none bb-none">(33) Laden on Board</td>
				</tr>

			</tbody>
		</table>
		<div class="footer">
			<el-button @click="openBill(true, saveData)">提单重置</el-button>
			<el-button type="primary" @click="open = true">提单预览</el-button>
			<el-button @click="downLoad(1)">订舱托书</el-button>
			<el-button @click="downLoad(2)">提单确认件</el-button>
			<!-- <el-button type="primary" @click="save(1)">保存</el-button> -->
		</div>
	</div>

	<el-dialog title="" v-model="open" width="1400px" append-to-body>
		<div ref="captureDiv" class="bill-of-lading-draft">
			<div class="header">
				<h1>宁波凌亚国际物流有限公司</h1>
				<div class="tit">提单草稿件PPPPP</div>
			</div>
			<table class="table1">
				<tbody>
					<tr>
						<td rowspan="2" colspan="2" class="bl-none" width="900">
							<div class="sub-tit">(2)Shipper/ Exporter</div>
								<!-- <div style="color: #222;">{{sender_id&&SENDER_LIST.find(v=> v.id==sender_id)&&SENDER_LIST.find(v=> v.id==sender_id).name}}</div> -->

							<div class="mt10 mb10 font-black">
								<div style="width: 440px;white-space: pre-wrap;min-height: 120px;">{{ sender_info }}</div>
							</div>
						</td>
						<td class="br-none" height="60">
							<div class="sub-tit">(5)Document No.</div>
							<div class="mt10 mb10 ml10 font-black">
								<div style="width: 250px; white-space: pre-wrap;">{{ bl_no }}</div>
							</div>
						</td>
					</tr>
					<tr>
						<td class="br-none">
							<div class="sub-tit">(6) Export References</div>
							<div class="mt10 mb10 ml10 font-black">
							</div>
						</td>
					</tr>
					<tr>
						<td colspan="2" class="bl-none">
							<div class="sub-tit">(3)Consignee(complete name and address)</div>
								<!-- <div style="color: #222;">{{receiver_id&&RECEIVE_LIST.find(v=> v.id==receiver_id)&&RECEIVE_LIST.find(v=> v.id==receiver_id).name}}</div> -->
							<div class="mt10 mb10 font-black">
								<div style="width: 440px;white-space: pre-wrap;min-height: 120px;">{{ receiver_info }}</div>
							</div>
						</td>
						<td class="br-none">
							<div class="sub-tit">(7)Forwarding Agent-References</div>
							<div class="mt10 ml10 font-black">
								<div style="width: 440px; white-space: pre-wrap;">{{ freight_forwarding }}</div>
							</div>
						</td>
					</tr>
					<tr>
						<td rowspan="2" colspan="2" class="bl-none">
							<div class="sub-tit">(4) Notify Party (complete name and address)</div>
								<!-- <div style="color: #222;">{{notifier_id&&NOTIFER_LIST.find(v=> v.id==notifier_id)&&NOTIFER_LIST.find(v=> v.id==notifier_id).name}}</div> -->
							<div class="mt10 mb10 font-black">
								<div style="width: 440px;white-space: pre-wrap;min-height: 120px;">{{ notifier_info }}</div>
							</div>
						</td>
						<td class="br-none">
							<div class="sub-tit">(8) Point and Country of Origin (for the Merchant's reference only)
							</div>
						</td>
					</tr>
					<tr>
						<td class="br-none">(9) Also Notify Party (complete name and address)</td>
					</tr>
					<tr>
						<td class="bl-none">(12)Pre-carriage By
							<p>&nbsp;</p>
						</td>
						<td>(13) Place of Receipt/Date
							<p>&nbsp;</p>
						</td>
						<td class="br-none"></td>
					</tr>
					<tr>
						<td class="bl-none">(14)Ocean Vessel/Voy.No.
							<div class="mt10 mb10 font-black">
								<div style="width: 240px;">{{ ship_info }}</div>
							</div>
						</td>
						<td>(15) Port of Loading
							<div class="mt10 mb10 ml10 font-black">
								<div style="width: 240px;">{{ origin_port }}</div>
							</div>
						</td>
						<td rowspan="2" class="br-none">(10) Onward inland Routing/Export instructions (which are
							contracted
							separately by Merchants entirely for their own account and risk)</td>
					</tr>
					<tr>
						<td class="bl-none">(16) Port of Discharge
							<div class="mt10 mb10 font-black">
								<div style="width: 240px; ">{{ destination_port }}</div>
							</div>
						</td>
						<td>(17)Place of Delivery</td>
					</tr>
				</tbody>
			</table>
			<h2>Particulars furnished by the Merchant</h2>
			<table class="table4">
				<tbody>
					<tr style="height: 40px;">
						<td class="bl-none">(18) Container No. And Seal No.Marks & Nos.</td>
						<td>
							(19)Quantity And Kind of Packages
						</td>
						<td>(20)Description of Goods</td>
						<td>
							(21)Gross Weight (KGS)
						</td>
						<td class="br-none">
							<div class="sub-tit">(22)Measurement(M³)</div>
						</td>
					</tr>
					<tr>
						<td class="bl-none">
							<p class="p1">CONTAINER NO./SEAL NO.</p>
							<div class="mt10 mb10 font-black" style="text-align: center">
								<div style="width: 300px; white-space: pre-wrap;">{{ no }}</div>
							</div>
							<p class="p2">TOTAL NUMBER OF CONTAINERS OR PACKAGES(IN WORDS)</p>
						</td>
						<td>
							<div class="mt10 p10 font-black">
								<div style="width: 150px;white-space: pre-wrap;">{{ number }}</div>
							</div>
						</td>
						<td>
							<div class="mt10 p10 font-black">
								<div style="width: 240px;font-size:12px;white-space: pre-wrap;">{{ description }}</div>
							</div>
						</td>
						<td>
							<div class="mt10 p10 font-black">
								<div style="width: 150px;white-space: pre-wrap;">{{ gross_weight }}</div>
							</div>
						</td>
						<td class="br-none">
							<div class="mt10 p10 font-black">
								<div style="width: 150px;white-space: pre-wrap;">{{ volume }}</div>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
			<table class="table2">
				<tbody>
					<tr>
						<td class="bl-none">(24)FREIGHT & CHARGES</td>
						<td>Revenue Tons</td>
						<td>Rate Per</td>
						<td>Prepaid
							<div class="aciton-btns">
								<el-radio-group v-model="radio3" size="large">
									<el-radio-button label="FREIGHT_PREPAID" value="FREIGHT_PREPAID" type="primary" />
								</el-radio-group>
							</div>
						</td>
						<td class="br-none">Collect
							<div class="aciton-btns">
								<el-radio-group v-model="radio3" size="large">
									<el-radio-button label="FREIGHT_COLLECT" value="FREIGHT_COLLECT" />
								</el-radio-group>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
			<table class="table3">
				<tbody>
					<tr>
						<td rowspan="2" class="bl-none">(25) B/L NO.</td>
						<td>(27) Number of Original B(s)/L</td>
						<td>(29) Prepaid at</td>
						<td class="br-none">(30) Collect at</td>
					</tr>
					<tr>
						<td>(28) Place of B(s)/L Issue/Date</td>
						<td>(31)Exchange Rate</td>
						<td class="br-none">(32)Exchange Rate</td>
					</tr>
					<tr>
						<td class="bl-none bb-none">(26) Service Type/Mode</td>
						<td colspan="3" class="br-none bb-none">(33) Laden on Board</td>
					</tr>

				</tbody>
			</table>
		</div>

		<div class="ml20">
			<el-button type="primary" @click="generateImage">生成图片</el-button>
		</div>
	</el-dialog>
</template>

<script setup>
	import {ref,computed,defineExpose,defineEmits} from 'vue';
	import html2canvas from "html2canvas";
	import {listData} from "@/api/company/send-and-receive";
	import {
		exportWord,
		getWordImage
	} from "@/utils/exportFile";
	import { Refresh } from '@element-plus/icons-vue'
	import { commonParam } from '@/utils/common'
	import { buildSelectSnapshotOption, normalizeSelectSnapshotValue } from '@/utils/selectSnapshot'
	const {
		proxy
	} = getCurrentInstance();
	

	const options = [{
			value: 'Option1',
			label: 'Option1',
		},
		{
			value: 'Option2',
			label: 'Option2',
		},
		{
			value: 'Option3',
			label: 'Option3',
		}
	]
	// 发货人
	const SENDER_LIST = ref([])
	const sender_info = ref('')
	// 收货人
	const RECEIVE_LIST = ref([])
	const receiver_info = ref('')
	const receiveUrl = ref('')
	// 通知人
	const NOTIFER_LIST = ref([])
	const notifier_info = ref('')
	const sender_id = ref('')
	const receiver_id = ref('')
	const notifier_id = ref('')
	const senderDetail = ref({})
	const receiverDetail = ref({})
	const notifierDetail = ref({})

	const PARTY_FIELD_MAP = {
		sender: { list: SENDER_LIST, idRef: sender_id, detailRef: senderDetail },
		receiver: { list: RECEIVE_LIST, idRef: receiver_id, detailRef: receiverDetail },
		notifier: { list: NOTIFER_LIST, idRef: notifier_id, detailRef: notifierDetail },
	}

	const buildPartyOptions = (partyKey) => {
		const config = PARTY_FIELD_MAP[partyKey]
		const list = Array.isArray(config?.list?.value) ? config.list.value : []
		const currentValue = config?.idRef?.value
		const normalizedCurrentValue = normalizeSelectSnapshotValue(currentValue)
		const snapshotLabel = (config?.detailRef?.value?.name || '').toString().trim()
		const snapshotMeta = buildSelectSnapshotOption({
			fieldKey: partyKey,
			originValue: normalizedCurrentValue,
			snapshotLabel,
			options: list,
			valueKey: 'id',
			labelKey: 'label',
		})
		if (!snapshotMeta) {
			return list
		}
		return [snapshotMeta.option, ...list]
	}

	const senderOptions = computed(() => buildPartyOptions('sender'))
	const receiverOptions = computed(() => buildPartyOptions('receiver'))
	const notifierOptions = computed(() => buildPartyOptions('notifier'))

	const resolvePartyDisplayName = (partyKey, value) => {
		const config = PARTY_FIELD_MAP[partyKey]
		const list = buildPartyOptions(partyKey)
		const normalizedValue = normalizeSelectSnapshotValue(value)
		const matched = list.find((item) => String(item.id) === String(value) || String(item.id) === String(normalizedValue))
		return matched?.name || config?.detailRef?.value?.name || matched?.label || ''
	}

	const syncPartySnapshotToken = (partyKey) => {
		const config = PARTY_FIELD_MAP[partyKey]
		if (!config) return
		const currentValue = normalizeSelectSnapshotValue(config.idRef.value)
		if (!currentValue) {
			config.idRef.value = ''
			return
		}
		const snapshotLabel = (config.detailRef.value?.name || '').toString().trim()
		const latest = (Array.isArray(config.list.value) ? config.list.value : []).find((item) => String(item.id) === String(currentValue))
		if (latest && (latest.name || latest.label || '').toString().trim() === snapshotLabel) {
			config.idRef.value = currentValue
			return
		}
		const snapshotMeta = buildSelectSnapshotOption({
			fieldKey: partyKey,
			originValue: currentValue,
			snapshotLabel,
			options: Array.isArray(config.list.value) ? config.list.value : [],
			valueKey: 'id',
			labelKey: 'label',
		})
		config.idRef.value = snapshotMeta ? snapshotMeta.token : currentValue
	}

	const syncAllPartySnapshotTokens = () => {
		;['sender', 'receiver', 'notifier'].forEach((partyKey) => syncPartySnapshotToken(partyKey))
	}

	const findPartyOption = (list, id) => (Array.isArray(list) ? list.find((item) => String(item.id) === String(id)) : null)

	const buildPartySnapshotPayload = (partyKey) => {
		const config = PARTY_FIELD_MAP[partyKey]
		const normalizedId = normalizeSelectSnapshotValue(config.idRef.value)
		if (!normalizedId) return {}
		const latestOption = findPartyOption(config.list.value, normalizedId)
		const detail = config.detailRef.value || {}
		return {
			...(latestOption || {}),
			...(detail || {}),
			id: Number(normalizedId),
			name: (detail.name || latestOption?.name || '').toString(),
		}
	}
	const bl_no = ref('')
	const freight_forwarding = ref('')
	const ship_info = ref('')
	const ship_name = ref('')
	const ship_no = ref('')
	const origin_port = ref('')
	const destination_port = ref('')
	const no = ref('')
	const number = ref('')
	const description = ref('')
	const gross_weight = ref('')
	const volume = ref('')

	const open = ref(false)
	//单据数据
	const saveData = ref({});
	const saveState = ref(false)
	const openBill = (resetType, val, selectData) => {
		saveData.value = val;
		if(resetType){
			saveState.value = false;
			reset()
		}
		if(!saveState.value){
			bl_no.value = val.bl_no;
			ship_info.value = val.ship_name+'/'+val.ship_no;
			ship_name.value = val.ship_name;
			ship_no.value = val.ship_no;
			origin_port.value = val.origin_port;
			destination_port.value = val.destination_port;
			no.value = '';
			if(val.boxInfo&&val.boxInfo.length>0){
				val.boxInfo.forEach((vv,ii)=>{
					no.value = no.value + vv.no+'/'+vv.seal_number+'\n';
				})
			}
		}
		// console.log('billForm提单数据', saveData.value);
	}
	function save(type){
		var newData = {
			sender_id: normalizeSelectSnapshotValue(sender_id.value),
			receiver_id: normalizeSelectSnapshotValue(receiver_id.value),
			notifier_id: normalizeSelectSnapshotValue(notifier_id.value),
			sender: buildPartySnapshotPayload('sender'),
			receiver: buildPartySnapshotPayload('receiver'),
			notifier: buildPartySnapshotPayload('notifier'),
			sender_info: sender_info.value,
			receiver_info: receiver_info.value,
			notifier_info: notifier_info.value,
			bl_no: bl_no.value,
			freight_forwarding: freight_forwarding.value,
			ship_name: ship_name.value,
			ship_no: ship_no.value,
			origin_port: origin_port.value,
			destination_port: destination_port.value,
			no: no.value,
			number: number.value,
			description: description.value,
			gross_weight: gross_weight.value,
			volume: volume.value,
		}
		if(type==1){  //当前页面保存
			saveState.value = true;
			emit('saveBill', newData);
			proxy.$modal.msgSuccess("保存成功");
		}else{   //只要保存数据
			return newData;
		}
	}
	const updateBill = (data, state) => {
		senderDetail.value = data.sender_detail?.snapshot || data.sender || data.sender_detail || {};
		receiverDetail.value = data.receiver_detail?.snapshot || data.receiver || data.receiver_detail || {};
		notifierDetail.value = data.notifier_detail?.snapshot || data.notifier || data.notifier_detail || {};
		sender_id.value = data.sender_id||'';
		receiver_id.value = data.receiver_id||'';
		notifier_id.value = data.notifier_id||'';
		sender_info.value = data.sender_info||'';
		receiver_info.value = data.receiver_info||'';
		notifier_info.value = data.notifier_info||'';
		bl_no.value = data.bl_no||'';
		freight_forwarding.value = data.freight_forwarding||'';
		ship_name.value = data.ship_name||'';
		ship_no.value = data.ship_no||'';
		ship_info.value = ship_name.value+'/'+ship_no.value;
		origin_port.value = data.origin_port||'';
		destination_port.value = data.destination_port||'';
		no.value = data.no||'';
		number.value = data.number||'';
		description.value = data.description||'';
		gross_weight.value = data.gross_weight||'';
		volume.value = data.volume||'';
		saveState.value = state;
		syncAllPartySnapshotTokens();
		// console.log('updateBill提单数据', data, state);
	}

	const radio3 = ref("FREIGHT_PREPAID")

	/*字母小写强制转换大写
	示例：
	在需要引用的input 加入@input="handleInput"
	*/

	const inputValue = ref('');
	const handleInput = (event) => {
		inputValue.value = event.target.value.toUpperCase();
	};


	const captureDiv = ref(null); // 引用目标 div

	// 生成图片的方法
	const generateImage = () => {
		if (captureDiv.value) {
			html2canvas(captureDiv.value, {
				scale: 2, // 提高清晰度
				useCORS: true, // 支持跨域图片
			}).then((canvas) => {
				// 将 canvas 转换为图片 URL
				const imageURL = canvas.toDataURL("image/png");

				// 创建一个新的窗口或标签页显示图片
				const newWindow = window.open();
				newWindow.document.write(
					`<img src="${imageURL}" alt="Generated Image" style="max-width: 100%;">`);
				newWindow.document.close();

				// 或者直接下载图片
				// downloadImage(imageURL, 'bill_of_lading.png');
			});
		}
	};

	const reset = () => {
		sender_id.value = ''
		receiver_id.value = ''
		notifier_id.value = ''
		senderDetail.value = {}
		receiverDetail.value = {}
		notifierDetail.value = {}
		sender_info.value = ''
		receiver_info.value = ''
		notifier_info.value = ''
		bl_no.value = ''
		freight_forwarding.value = ''
		ship_info.value = ''
		ship_name.value = ''
		ship_no.value = ''
		origin_port.value = ''
		destination_port.value = ''
		no.value = ''
		number.value = ''
		description.value = ''
		gross_weight.value = ''
		volume.value = ''
	}
	reset()

	function getSelectDataList() { //sender  发货人  receiver  //收货人  notifier  //通知人
		Promise.all([getList('sender'), getList('receiver'), getList('notifier')]).then(([senders, receivers,
			notifiers]) => {
				console.log('senders', senders)
				SENDER_LIST.value = senders ? senders.map(v=>{return {...v,label:v.keyword?v.keyword+'——'+v.name:v.name}}) : []
				RECEIVE_LIST.value = receivers ? receivers.map(v=>{return {...v,label:v.keyword?v.keyword+'——'+v.name:v.name}}) : []
				NOTIFER_LIST.value = notifiers ? notifiers.map(v=>{return {...v,label:v.keyword?v.keyword+'——'+v.name:v.name}}) : []
				syncAllPartySnapshotTokens()
			})
	}
	// 发货人下拉框变化
	function senderChange(e) {
		const normalizedId = normalizeSelectSnapshotValue(e)
		const selected = findPartyOption(SENDER_LIST.value, normalizedId)
		if (selected) {
			senderDetail.value = { ...selected, id: Number(normalizedId) }
			sender_info.value = selected.type_content || sender_info.value
		} else if (!normalizedId) {
			senderDetail.value = {}
			sender_info.value = ''
		}
	}
	// 收货人下拉框变化
	function receiveChange(e) {
		const normalizedId = normalizeSelectSnapshotValue(e)
		const selected = findPartyOption(RECEIVE_LIST.value, normalizedId)
		if (selected) {
			receiverDetail.value = { ...selected, id: Number(normalizedId) }
			receiver_info.value = selected.type_content || receiver_info.value
			receiveUrl.value = selected.url || ''
		} else if (!normalizedId) {
			receiverDetail.value = {}
			receiver_info.value = ''
			receiveUrl.value = ''
		}
		console.log(e, 'e', receiveUrl.value)
	}
	// 通知人下拉框变化
	function notiferChange(e) {
		const normalizedId = normalizeSelectSnapshotValue(e)
		const selected = findPartyOption(NOTIFER_LIST.value, normalizedId)
		if (selected) {
			notifierDetail.value = { ...selected, id: Number(normalizedId) }
			notifier_info.value = selected.type_content || notifier_info.value
		} else if (!normalizedId) {
			notifierDetail.value = {}
			notifier_info.value = ''
		}
	}
	
	//增加收发通信息
	const router = useRouter();
	function addCompanyHead(){
		router.push({
			path: "/company/send-and-receive",
			query: {
				add: true
			},
		});
	}

	function openReceive() {
		if (receiver_id.value) {
			let is_confirm = RECEIVE_LIST.value.find(item => item.id === receiver_id.value).is_confirm
			if (is_confirm === 1) {
				if (receiveUrl.value) {
					window.open(receiveUrl.value, "_blank");
				} else {
					proxy.$modal.msgWarning("此收货人无舱单信息");
				}
			} else {
				proxy.$modal.msgWarning("此收货人舱单信息未确认暂不能获取");
			}
		} else {
			proxy.$modal.msgWarning("请选择收货人");
		}
	}
	getSelectDataList()
	// -----------------------接口------------------
	/** 查询列表 */
	function getList(type) {
		let queryParams = commonParam().SFT_params;
		queryParams.type = type;
		return new Promise((resolve, reject) => {
			listData(queryParams).then(response => {
					resolve(response.data)
				}).catch((e) => reject(e))
				.finally(() => {})
		})
	}
	
	
	// 导出文件
	const downLoad = (type) => {
		const startSchemeTemplate = {
			VALUE1: sender_id.value&&SENDER_LIST.value.find(v=> v.id==sender_id.value)&&SENDER_LIST.value.find(v=> v.id==sender_id.value).name,
			SENDERINFOCONTENT: sender_info.value,
		};
		console.log('startSchemeTemplate', startSchemeTemplate);
		if(type==1){
			exportWord(
				"../template1.docx",
				startSchemeTemplate,
				'订舱托书'
			);
		}else{
			exportWord(
				"../template.docx",
				startSchemeTemplate,
				'提单确认件'
			);
		}
	};
	
	const emit = defineEmits(['saveBill'])
	defineExpose({
		openBill,
		updateBill,
		save
	})
</script>

<style scoped>
	:deep(.el-input__inner) {
		color: #000;
	}

	.bill-of-lading-draft {
		/* max-width: 1200px; */
		margin: 20px auto;
		padding: 20px;
	}

	.header {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.header h1 {
		font-size: 40px;
		color: green;
	}

	h2 {
		font-size: 14px;
		color: green;
		font-weight: bold;
		margin: 0 auto;
		text-align: center;
	}

	.header .tit {
		font-size: 30px;
		color: #000;
		margin-left: 20%;
	}

	.sub-tit {
		color: green;
		font-size: 14px;
		text-align: left;
		font-weight: bold;
	}

	.mt10 {
		margin-top: 10px;
	}

	.mb10 {
		margin-bottom: 15px;
	}

	.ml10 {
		margin-left: 15px;
	}

	.mr10 {
		margin-right: 15px;
	}

	.p10 {
		padding: 0 10px;
	}

	.p1 {
		text-align: center;
		font-weight: bold;
		text-decoration: underline;
	}

	.p2 {
		text-align: center;
		font-weight: bold;
		margin-top: 30px;
	}

	.aciton-btns {
		margin: 20px auto;
		text-align: center;
	}

	.footer {
		text-align: right;
	}

	/* 全局设置 */

	table {
		width: 100%;
		max-width: 1200px;
		margin: 15px auto;
		border-collapse: collapse;
		background: white;
		/* box-shadow: 0 1px 3px rgba(0,0,0,0.12); */
	}

	th,
	td {
		padding: 0;
		text-align: left;
		border: 2px solid green;
		vertical-align: top;
		color: green;
		font-size: 14px;
		font-weight: bold;
		min-height: 80px;
	}

	th {
		background-color: #f5f7fa;
		font-weight: 600;
	}

	.bl-none {
		border-left: 0;
	}

	.br-none {
		border-right: 0;
	}

	.bb-none {
		border-bottom: 0;
	}

	.table1 {
		height: 500px;
	}

	.table2 {
		height: 200px;
	}

	.table3 {
		height: 110px;
	}

	.table4 {
		height: 300px;
	}

	.font-black {
		color: #000;
	}

	.snapshot-select-option {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		width: 100%;
	}

	.snapshot-select-option__name {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.snapshot-select-option__tag {
		flex: none;
		padding: 2px 8px;
		border-radius: 999px;
		background: #fff3cd;
		color: #c67a00;
		font-size: 12px;
		line-height: 1.2;
	}

	.snapshot-select-option.is-snapshot {
		color: #c67a00;
		font-weight: 600;
	}
</style>
