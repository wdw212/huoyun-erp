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
							<el-select v-model="value1" placeholder="选择发货人" size="large" style="width: 440px" filterable
								@change='senderChange'>
								<template #label="{ label, value }">
								    <span>{{ label.indexOf('——')>-1?label.split['——'][1]:label }}</span>
								</template>
								<el-option v-for="item in SENDER_LIST" :key="item.id" :label="item.label"
									:value="item.id" />
							</el-select>
						</div>

						<div class="mt10 mb10">
							<el-input v-model="senderInfoContent" style="width: 440px" :rows="5" type="textarea"
								placeholder="具体发货人信息" />
						</div>
					</td>
					<td class="br-none" height="60">
						<div class="sub-tit">(5)Document No.</div>
						<div class="mt10 mb10 ml10">
							<el-input v-model="textarea2" style="width: 250px" type="text"
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
							<!-- <el-button type="primary" :icon="Refresh" circle style="margin-left: 10px;"
							@click="getSelectDataList(true)"/> -->
						</div>
					</td>
				</tr>
				<tr>
					<td colspan="2" class="bl-none">
						<div class="sub-tit">(3)Consignee(complete name and address)</div>
						<div class="mt10">
							<el-select v-model="value2" placeholder="选择收货人" size="large" style="width: 440px" filterable
								@change='receiveChange'>
								<template #label="{ label, value }">
								    <span>{{ label.indexOf('——')>-1?label.split['——'][1]:label }}</span>
								</template>
								<el-option v-for="item in RECEIVE_LIST" :key="item.id" :label="item.label"
									:value="item.id" />
							</el-select>
						</div>
						<div class="mt10 mb10">
							<el-input v-model="receiveInfoContent" style="width: 440px" :rows="5" type="textarea"
								placeholder="具体收货人信息" />
						</div>
					</td>
					<td class="br-none">
						<div class="sub-tit">(7)Forwarding Agent-References</div>
						<div class="mt10 ml10">
							<el-input v-model="textarea4" style="width: 440px" :rows="7" type="textarea"
								placeholder="请输入" />
						</div>
					</td>
				</tr>
				<tr>
					<td rowspan="2" colspan="2" class="bl-none">
						<div class="sub-tit">(4) Notify Party (complete name and address)</div>
						<div class="mt10">
							<el-select v-model="value3" placeholder="选择通知人" size="large" style="width: 440px" filterable
								@change='notiferChange'>
								<template #label="{ label, value }">
								    <span>{{ label.indexOf('——')>-1?label.split['——'][1]:label }}</span>
								</template>
								<el-option v-for="item in NOTIFER_LIST" :key="item.id" :label="item.label"
									:value="item.id" />
							</el-select>
						</div>
						<div class="mt10 mb10">
							<el-input v-model="notiferInfoContent" style="width: 440px" :rows="5" type="textarea"
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
							<el-input v-model="textarea6" style="width: 240px" type="text"
								placeholder="船名/航次，数据来源于单据中的船名/航次" />
						</div>
					</td>
					<td>(15) Port of Loading
						<div class="mt10 mb10 ml10">
							<el-input v-model="textarea7" style="width: 240px" type="text"
								placeholder="起运港，数据来源于单据中的起运港" />
						</div>
					</td>
					<td rowspan="2" class="br-none">(10) Onward inland Routing/Export instructions (which are contracted
						separately by Merchants entirely for their own account and risk)</td>
				</tr>
				<tr>
					<td class="bl-none">(16) Port of Discharge
						<div class="mt10 mb10">
							<el-input v-model="textarea8" style="width: 240px" type="text"
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
							<el-input v-model="textarea9" style="width: 300px" type="textarea" :rows="8"
								placeholder="箱封号，数据来源于箱子信息中的箱号/封号（有多组数据）" />
						</div>
						<p class="p2">TOTAL NUMBER OF CONTAINERS OR PACKAGES(IN WORDS)</p>
					</td>
					<td>
						<div class="mt10 p10">
							<el-input v-model="textarea10" style="width: 150px" :rows="9" type="textarea"
								placeholder="件数" />
						</div>
					</td>
					<td>
						<div class="mt10 p10">
							<el-input v-model="textarea11" style="width: 240px;font-size:12px" :rows="11"
								type="textarea" placeholder="货描" />
						</div>
					</td>
					<td>
						<div class="mt10 p10">
							<el-input v-model="textarea12" style="width: 150px" :rows="9" type="textarea"
								placeholder="毛重" />
						</div>
					</td>
					<td class="br-none">
						<div class="mt10 p10">
							<el-input v-model="textarea13" style="width: 150px" :rows="9" type="textarea"
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
			<el-button type="primary" @click="save">保存</el-button>
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
							<!-- <div class="mt10">
								<div style="color: #222;">{{value1&&SENDER_LIST.find(v=> v.id==value1)&&SENDER_LIST.find(v=> v.id==value1).name}}</div>
							</div> -->

							<div class="mt10 mb10 font-black">
								<div style="width: 440px;white-space: pre-wrap;min-height: 120px;">{{ senderInfoContent }}</div>
							</div>
						</td>
						<td class="br-none" height="60">
							<div class="sub-tit">(5)Document No.</div>
							<div class="mt10 mb10 ml10 font-black">
								<div style="width: 250px; white-space: pre-wrap;">{{ textarea2 }}</div>
							</div>
						</td>
					</tr>
					<tr>
						<td class="br-none">
							<div class="sub-tit">(6) Export References</div>
							<div class="mt10 mb10 ml10 font-black">
								<!-- <div>舱单网址</div> -->
							</div>
						</td>
					</tr>
					<tr>
						<td colspan="2" class="bl-none">
							<div class="sub-tit">(3)Consignee(complete name and address)</div>
							<!-- <div class="mt10">
								<div style="color: #222;">{{value2&&RECEIVE_LIST.find(v=> v.id==value2)&&RECEIVE_LIST.find(v=> v.id==value2).name}}</div>
							</div> -->
							<div class="mt10 mb10 font-black">
								<div style="width: 440px;white-space: pre-wrap;min-height: 120px;">{{ receiveInfoContent }}</div>
							</div>
						</td>
						<td class="br-none">
							<div class="sub-tit">(7)Forwarding Agent-References</div>
							<div class="mt10 ml10 font-black">
								<div style="width: 440px; white-space: pre-wrap;">{{ textarea4 }}</div>
							</div>
						</td>
					</tr>
					<tr>
						<td rowspan="2" colspan="2" class="bl-none">
							<div class="sub-tit">(4) Notify Party (complete name and address)</div>
							<!-- <div class="mt10">
								<div style="color: #222;">{{value3&&NOTIFER_LIST.find(v=> v.id==value3)&&NOTIFER_LIST.find(v=> v.id==value3).name}}</div>
							</div> -->
							<div class="mt10 mb10 font-black">
								<div style="width: 440px;white-space: pre-wrap;min-height: 120px;">{{ notiferInfoContent }}</div>
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
								<!-- <el-input v-model="textarea6" style="width: 240px" type="text"
									placeholder="数据来源于对应系统" /> -->
								<div style="width: 240px;">{{ textarea6 }}</div>
							</div>
						</td>
						<td>(15) Port of Loading
							<div class="mt10 mb10 ml10 font-black">
								<!-- <el-input v-model="textarea7" style="width: 240px" type="text"
									placeholder="数据来源于对应系统" /> -->
								<div style="width: 240px;">{{ textarea7 }}</div>
							</div>
						</td>
						<td rowspan="2" class="br-none">(10) Onward inland Routing/Export instructions (which are
							contracted
							separately by Merchants entirely for their own account and risk)</td>
					</tr>
					<tr>
						<td class="bl-none">(16) Port of Discharge
							<div class="mt10 mb10 font-black">
								<!-- <el-input v-model="textarea8" style="width: 240px" type="text"
									placeholder="数据来源于对应系统" /> -->
								<div style="width: 240px; ">{{ textarea8 }}</div>
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
							<div class="mt10 mb10 font-black" style="text-align: center">
								<!-- <el-input v-model="textarea9" style="width: 300px" type="textarea" :rows="8"
									placeholder="数据来源于对应系统" /> -->
								<div style="width: 300px; white-space: pre-wrap;">{{ textarea9 }}</div>
							</div>
							<p class="p2">TOTAL NUMBER OF CONTAINERS OR PACKAGES(IN WORDS)</p>
						</td>
						<td>
							<div class="mt10 p10 font-black">
								<!-- <el-input v-model="textarea10" style="width: 150px" :rows="9" type="textarea"
									placeholder="我是文本输入框，请输入" /> -->
								<div style="width: 150px;white-space: pre-wrap;">{{ textarea10 }}</div>
							</div>
						</td>
						<td>
							<div class="mt10 p10 font-black">
								<div style="width: 240px;font-size:12px;white-space: pre-wrap;">{{ textarea11 }}</div>
							</div>
						</td>
						<td>
							<div class="mt10 p10 font-black">
								<!-- <el-input v-model="textarea12" style="width: 150px" :rows="9" type="textarea"
									placeholder="我是文本输入框，请输入" /> -->
								<div style="width: 150px;white-space: pre-wrap;">{{ textarea12 }}</div>
							</div>
						</td>
						<td class="br-none">
							<div class="mt10 p10 font-black">
								<!-- <el-input v-model="textarea13" style="width: 150px" :rows="9" type="textarea"
									placeholder="我是文本输入框，请输入" @input="handleInput" /> -->
								<div style="width: 150px;white-space: pre-wrap;">{{ textarea13 }}</div>
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
	import {ref,defineExpose,defineEmits} from 'vue';
	import html2canvas from "html2canvas";
	import {listData} from "@/api/company/send-and-receive";
	import {
		exportWordImage,
		getWordImage
	} from "@/utils/exportFile";
	import { Refresh } from '@element-plus/icons-vue'
	const {
		proxy
	} = getCurrentInstance();
	

	const textarea = ref('')
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
	const senderInfoContent = ref('')
	// 收货人
	const RECEIVE_LIST = ref([])
	const receiveInfoContent = ref('')
	const receiveUrl = ref('')
	// 通知人
	const NOTIFER_LIST = ref([])
	const notiferInfoContent = ref('')
	const value1 = ref('')
	const value2 = ref('')
	const value3 = ref('')
	const textarea1 = ref('')
	const textarea2 = ref('')
	const textarea3 = ref('')
	const textarea4 = ref('')
	const textarea5 = ref('')
	const textarea6 = ref('')
	const textarea7 = ref('')
	const textarea8 = ref('')
	const textarea9 = ref('')
	const textarea10 = ref('')
	const textarea11 = ref('')
	const textarea12 = ref('')
	const textarea13 = ref('')

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
			textarea2.value = val.bl_no;
			textarea6.value = val.ship_name+'/'+val.ship_no;
			textarea7.value = val.origin_port;
			textarea8.value = val.destination_port;
			textarea9.value = '';
			if(val.boxInfo&&val.boxInfo.length>0){
				val.boxInfo.forEach((vv,ii)=>{
					textarea9.value = textarea9.value + vv.no+'/'+vv.seal_number+'\n';
				})
			}
		}
		console.log('billForm提单数据', saveData.value);
	}
	function save(){
		saveState.value = true;
		proxy.$modal.msgSuccess("保存成功");
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
		textarea.value = ''
		value1.value = ''
		value2.value = ''
		value3.value = ''
		textarea1.value = ''
		textarea2.value = ''
		textarea3.value = ''
		textarea4.value = ''
		textarea5.value = ''
		textarea6.value = ''
		textarea7.value = ''
		textarea8.value = ''
		textarea9.value = ''
		textarea10.value = ''
		textarea11.value = ''
		textarea12.value = ''
		textarea13.value = ''
	}
	reset()

	function getSelectDataList() { //sender  发货人  receiver  //收货人  notifier  //通知人
		Promise.all([getList('sender'), getList('receiver'), getList('notifier')]).then(([senders, receivers,
			notifiers]) => {
				console.log('senders', senders)
				SENDER_LIST.value = senders ? senders.map(v=>{return {...v,label:v.keyword?v.keyword+'——'+v.name:v.name}}) : []
				RECEIVE_LIST.value = receivers ? receivers.map(v=>{return {...v,label:v.keyword?v.keyword+'——'+v.name:v.name}}) : []
				NOTIFER_LIST.value = notifiers ? notifiers.map(v=>{return {...v,label:v.keyword?v.keyword+'——'+v.name:v.name}}) : []
			})
	}
	// 发货人下拉框变化
	function senderChange(e) {
		if (e) {
			senderInfoContent.value = SENDER_LIST.value.find(item => item.id === e).type_content
		} else {
			senderInfoContent.value = ''
		}
	}
	// 收货人下拉框变化
	function receiveChange(e) {
		if (e) {
			receiveInfoContent.value = RECEIVE_LIST.value.find(item => item.id === e)?.type_content
			receiveUrl.value = RECEIVE_LIST.value.find(item => item.id === e).url
		} else {
			receiveInfoContent.value = ''
			receiveUrl.value = ''
		}
		console.log(e, 'e', receiveUrl.value)
	}
	// 通知人下拉框变化
	function notiferChange(e) {
		if (e) {
			notiferInfoContent.value = NOTIFER_LIST.value.find(item => item.id === e).type_content
		} else {
			notiferInfoContent.value = ''
		}
	}
	
	//增加收发通信息
	const router = useRouter();
	function addCompanyHead(){
		router.push({
			path: "/company/company-headers",
			query: {
				add: true
			},
		});
	}

	function openReceive() {
		if (value2.value) {
			let is_confirm = RECEIVE_LIST.value.find(item => item.id === value2.value).is_confirm
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
		let queryParams = {
			type
		}
		return new Promise((resolve, reject) => {
			listData(queryParams).then(response => {
					resolve(response.data)
				}).catch((e) => reject(e))
				.finally(() => {})
		})
	}
	
	
	// 导出文件
	const startSchemeTemplate = ref({
		VALUE1: value1.value&&SENDER_LIST.value.find(v=> v.id==value1.value)&&SENDER_LIST.value.find(v=> v.id==value1.value).name,
		SENDERINFOCONTENT: senderInfoContent.value,
	});
	const downLoad = (type) => {
		if(type==1){
			exportWordImage(
				"../template1.docx",
				startSchemeTemplate.value,
				'订舱托书',
				''
			);
		}else{
			exportWordImage(
				"../template.docx",
				startSchemeTemplate.value,
				'提单确认件',
				''
			);
		}
	};
	
	const emit = defineEmits([])
	defineExpose({
		openBill
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
		margin: 20px auto;
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
</style>