<template>
	<div>
		
		<el-dialog v-model="packFormShow" width="1400px">
			<div class="pack-of-lading-draft">
				<div class="wrapper" ref="contentRef">
					<el-form>
						<table>
							<tbody>
								<tr>
									<td style="width:25%" colspan="4">Reefer Temperature Required<br />冷藏温度
										<p>&nbsp;</p>
									</td>
									<td colspan="3" style="width:40%;text-align: center;">
										<h1>CONTAINER LOAD PLAN</h1>
									</td>
									<td rowspan="2" valign="middle" style="width:15%;text-align:center"><img
											src="../../assets/logo_pack.jpg" alt="logo" class="logo"></td>
									<td rowspan="2" style="width:20%">
										请在提箱预约前确认序列号是否完成支付
										<p class="p10 mt40">
											<el-input @input="changeValue" v-model="form.workNumber" placeholder="序列号" />
										</p>
									</td>
								</tr>
								<tr>
									<td class="center">Class<br />等级</td>
									<td class="center">IMDG<br>Page<br />危规页</td>
									<td class="center">UN NO.<br />联合国<br>编码</td>
									<td class="center">Flashpoint<br />闪点</td>
									<td colspan="3">
										<h2>装箱单</h2>
										<p class="mt10">装箱编号:领到箱单后，数据务必认真再核对一次！</p>
									</td>
								</tr>
								<tr>
									<td colspan="4" rowspan="4">
										<div class="section">
											<div class="tit">Ship's Name/Voy No.船名/航次</div>
											<div class="area">
												<el-input @input="changeValue" v-model="form.ship_info" :rows="2" type="textarea" placeholder="船名/航次" />
											</div>
											<p class="tit mt10">进箱开始时间：<el-date-picker @change="changeValue" v-model="form.startTime" type="datetime"
													:prefix-icon="null" style="width:160px" placeholder="开港时间"
													format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" time-format="HH:mm" />
											</p>
											<p class="tit mt10 mb10">进箱截止时间：<el-date-picker @change="changeValue" v-model="form.endTime"
													type="datetime" :prefix-icon="null" style="width:160px" placeholder="进港时间"
													format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" time-format="HH:mm" />
											</p>
										</div>
									</td>
									<td rowspan="4" width="200px">
										<div class="section">
											<div>
												<div class="tit">port of Loading<br>装货港</div>
												<div class="p10">
													<el-input @input="changeValue" v-model="form.port" placeholder="起运港" />
												</div>
											</div>
											<div class="mt30">
												<div class="tit">进箱码头</div>
												<div class="p10">
													<el-input @input="changeValue" v-model="form.wharf" placeholder="进港码头" />
												</div>
											</div>
										</div>
									</td>
									<td rowspan="4" width="200px">Port of Tranship <br>中转港
										<p class="p10">
											<el-input @input="changeValue" v-model="form.value1" placeholder="中转港代码" />
										</p>
									</td>
									<td rowspan="4" width="200px">Place of Delivery<br>交货地
										<p class="p10">
											<el-input @input="changeValue" v-model="form.value2" placeholder="目的港" />
										</p>
									</td>
									<td rowspan="4">订舱货代代码<br>&nbsp;&nbsp;&nbsp;
										<p class="p10">
											<el-input @input="changeValue" v-model="form.value3" placeholder="" />
										</p>
									</td>
									<td align="center">
										<div class="mtb5 tit">箱主:<el-input @input="changeValue" v-model="form.value4" style="width: 60px"
												placeholder="船公司" />&nbsp;箱型:<el-input @input="changeValue" v-model="form.value5" style="width: 70px"
												placeholder="箱型" /></div>
									</td>
								</tr>
								<tr>
									<td>
										<div class="mtb5 tit">EIR号:<el-input @input="changeValue" v-model="form.value6" style="width: 155px"
												placeholder="" /></div>
									</td>
								</tr>
								<tr>
									<td>
										<div class="mtb5 tit">提箱堆场:<el-input @input="changeValue" v-model="form.value7" style="width: 135px"
												placeholder="提箱码头" /></div>
									</td>
								</tr>
								<tr>
									<td>
										<div class="mtb5 tit redColor">有效期:<el-date-picker @change="changeValue" v-model="form.periodTime" :prefix-icon="null"
												type="datetime" style="width:155px;color: red;" placeholder="条码有效期"
												format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" time-format="HH:mm"/>
										</div>
									</td>
								</tr>
								<tr>
									<td colspan="4" style="height: 60px;">Container No.箱号
										<p class="p10 mb10">
											<el-input @input="changeValue" v-model="form.value8" placeholder="箱号" />
										</p>
									</td>
									<td colspan="5" rowspan="4" valgin="top">
										<!--物流单列表 start-->
										<table class="list">
											<tbody>
												<tr style="height: 61px;">
													<td class="center" width="148">Bill of Lading No.<br />提单号</td>
													<td class="center" width="149">Packages&Packing<br />件数与包装</td>
													<td class="center" width="148">Gross Weight<br />毛重</td>
													<td class="center">Measurements<br />尺码</td>
													<td class="center">Description of Goods<br />货名</td>
													<td class="center">Marks&Numbers<br />唛头</td>
												</tr>
												<tr>
													<td colspan="6">
														<div class="box">
															<div class="detail-box">
																<div class="detail">
																	<el-table :data="tableData" border style="width: 100%"
																		:show-header="false">
																		<el-table-column prop="name" width="210">
																			<template #default="{ row }">
																				<el-input @input="changeValue" v-model="row.no" placeholder="提单号" />
																			</template>
																		</el-table-column>
																		<el-table-column width="100">
																			<template #default="{ row }">
																				<el-input @input="changeValue" v-model="row.unit" placeholder="件数" />
																			</template>
																		</el-table-column>
																		<el-table-column width="140">
																			<template #default="{ row }">
																				<el-input @input="changeValue" v-model="row.quantity"
																					placeholder="毛重" />
																			</template>
																		</el-table-column>
																		<el-table-column width="115">
																			<template #default="{ row }">
																				<el-input @input="changeValue" v-model="row.formattedValue"
																					placeholder="体积" />
																			</template>
																		</el-table-column>
																		<el-table-column width="80">
																			<template v-if="tableData.length>0"
																				#default="{ $index }">
																				<el-button type="text" @click="delRow($index)"
																					class="del">删除</el-button>
																			</template>
																		</el-table-column>
																	</el-table>
																</div>
																<div class="ml10 mt10"><el-button type="primary"
																		@click="addRow">增行</el-button></div>
															</div>
															<!--章-->
															<div class="badge-box">
																<div class="circle-badge">更正章</div>
																<div class="circle-badge">更正章</div>
																<div class="circle-badge">更正章</div>
															</div>
															<!--地址列表-->
															<div class="address-list">
																<ul v-for="(address, index) in addresses" :key="index"
																	class="address-item">
																	<li>
																		<div class="flex gap-4 items-center">
																			<el-input @input="changeValue" v-model="address.address"
																				placeholder="装柜地址" />
																			<el-input @input="changeValue" v-model="address.name"
																				placeholder="联系人/电话" style="width:300px" />
																			<el-button @click="deleteAddress(index)"
																				class="delete-btn" type="primary">删除</el-button>
																		</div>
																	</li>
																</ul>
																<div v-if="addresses.length === 0" class="empty-tip">
																	暂无地址信息，请添加地址</div>
															</div>
														</div>
													</td>
												</tr>
											</tbody>
										</table>
										<!--物流单列表 end-->
									</td>
								</tr>
								<tr>
									<td colspan="4">Seal No.封号
										<p class="p10 mb10">
											<el-input @input="changeValue" v-model="form.value9" placeholder="封号" />
										</p>
									</td>
								</tr>
								<tr>
									<td colspan="4">Cont. size&type 箱型尺寸
										<p class="p10 mb10"><el-input @input="changeValue" v-model="form.value10" style="width:150px"
												placeholder="箱型" /></p>
									</td>
								</tr>
								<tr>
									<td colspan="4">
										<div class="section">
											<div class="tit">Packer's Name/Address装箱人名称/地址</div>
											<p class="ml10 mb10"><el-button type="primary" @click="addAddress">增加</el-button>
											</p>
											<p class="tit">Tel No.电话号码</p>
											<p>&nbsp;</p>
										</div>
									</td>
								</tr>
								<tr>
									<td colspan="4">
										<div class="section">
											<div>
												<div class="tit">Packing Date 装箱日期</div>
												<p class="ml10"><el-date-picker @change="changeValue" v-model="form.endTime2" type="datetime"
														placeholder="装柜时间" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm"
													 time-format="HH:mm" /></p>
											</div>
											<p class="tit">Packed By</p>
										</div>
									</td>
									<td>Total Packages<br>总件数
										<p class="p10"><el-input @input="changeValue" v-model="form.value11" placeholder="总件数" /></p>
									</td>
									<td>Total Cargo Wt<br>总货重
										<p class="p10"><el-input @input="changeValue" v-model="form.value12" placeholder="总货重" /></p>
									</td>
									<td>Total Meas<br>总尺码
										<p class="p10"><el-input @input="changeValue" v-model="form.value13" placeholder="总体积" /></p>
									</td>
									<td colspan="2" rowspan="2">
										Remarks备注
										<p>1、如对装箱单数据有疑义，请及时联系货代确认，未经确认产生的错误和费用自行承担;</p>
										<p>2、在装箱单上如实填写货物毛重，保证每柜的实际数据与进港装箱单上的数据相符；</p>
										<p>3、此序列号可在手机APP端预约成功后进行提箱，请妥善保管，避免遗失或被他人盗用;</p>
										<p>4、请在提箱出门前确认情况，如无异议视同情况良好。</p>
									</td>
								</tr>
								<tr>
									<td colspan="4">Received By Drayman<br>驾驶员签收及车号
										<p class="p10 ml10"><el-input @input="changeValue" v-model="form.value14" placeholder="司机信息" /></p>
									</td>
									<td colspan="2">Cont. Tare Wt集装箱皮重<br>
										<p class="p10 ml10"><el-input @input="changeValue" v-model="form.value15" placeholder="集装箱皮重" /></p>
									</td>
									<td>Cgo/cont Total WT货/箱总重量</td>
								</tr>
							</tbody>
						</table>
						<div class="action-btns">
							<el-button @click="reset()">箱单重置</el-button>
							<el-button type="primary" @click="generateImage" :disabled="loading">箱单预览</el-button>
						</div>
					</el-form>
				</div>
			
				<!--弹出层-->
				<el-dialog v-model="dialogTableVisible" title="箱单预览" width="1150">
					<div class="wrapper" ref="captureDiv">
						<el-form>
							<table>
								<tbody>
									<tr>
										<td style="width:25%" colspan="4">Reefer Temperature Required<br />冷藏温度
											<p>&nbsp;</p>
										</td>
										<td colspan="3" style="width:40%;text-align: center;">
											<h1>CONTAINER LOAD PLAN</h1>
										</td>
										<td rowspan="2" valign="middle" style="width:15%;text-align:center"><img
												src="../../assets/logo_pack.jpg" alt="logo" class="logo"></td>
										<td rowspan="2" style="width:20%">
											请在提箱预约前确认序列号是否完成支付
											<p class="p10 mt40">
												{{ form.workNumber }}
											</p>
										</td>
									</tr>
									<tr>
										<td class="center">Class<br />等级</td>
										<td class="center">IMDG<br>Page<br />危规页</td>
										<td class="center">UN NO.<br />联合国<br>编码</td>
										<td class="center">Flashpoint<br />闪点</td>
										<td colspan="3">
											<h2>装箱单</h2>
											<p class="mt10">装箱编号:领到箱单后，数据务必认真再核对一次！</p>
										</td>
									</tr>
									<tr>
										<td colspan="4" rowspan="4">
											<div class="section">
												<div class="tit">Ship's Name/Voy No.船名/航次</div>
												<div class="area" style="white-space: pre-wrap;">
													{{ form.ship_info }}
												</div>
												<p class="tit mt10">进箱开始时间：
													{{form.startTime}}
												</p>
												<p class="tit mt10 mb10">进箱截止时间：
													{{form.endTime}}
												</p>
											</div>
										</td>
										<td rowspan="4" width="200px">
											<div class="section">
												<div>
													<div class="tit">port of Loading<br>装货港</div>
													<div class="p10">
														{{form.port}}
													</div>
												</div>
												<div class="mt30">
													<div class="tit">进箱码头</div>
													<div class="p10">
														{{form.wharf}}
													</div>
												</div>
											</div>
										</td>
										<td rowspan="4" width="200px">Port of Tranship <br>中转港
											<p class="p10">
												{{form.value1}}
											</p>
										</td>
										<td rowspan="4" width="200px">Place of Delivery<br>交货地
											<p class="p10">
												{{form.value2}}
											</p>
										</td>
										<td rowspan="4">订舱货代代码<br>&nbsp;&nbsp;&nbsp;
											<p class="p10">
												{{form.value3}}
											</p>
										</td>
										<td align="center">
											<div class="mtb5 tit">箱主:
												{{form.value4}}
												&nbsp;箱型:
												{{form.value5}}
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div class="mtb5 tit">EIR号:
												{{form.value6}}
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div class="mtb5 tit">提箱堆场:
												{{form.value7}}
											</div>
										</td>
									</tr>
									<tr>
										<td>
											<div class="mtb5 tit">有效期:
												<span style="color: red;">{{form.periodTime}}</span>
											</div>
										</td>
									</tr>
									<tr>
										<td colspan="4">Container No.箱号
											<p class="p10 mb10">
												{{form.value8}}
											</p>
										</td>
										<td colspan="5" rowspan="4" valgin="top">
											<!--物流单列表 start-->
											<table class="list">
												<tbody>
													<tr>
														<td class="center" width="148">Bill of Lading No.<br />提单号</td>
														<td class="center" width="149">Packages&Packing<br />件数与包装</td>
														<td class="center" width="148">Gross Weight<br />毛重</td>
														<td class="center">Measurements<br />尺码</td>
														<td class="center">Description of Goods<br />货名</td>
														<td class="center">Marks&Numbers<br />唛头</td>
													</tr>
													<tr>
														<td colspan="6">
															<div class="box">
																<div class="detail-box">
																	<div class="detail">
																		<el-table :data="tableData" border style="width: 100%"
																			:show-header="false">
																			<el-table-column prop="name" width="210">
																				<template #default="{ row }">
																					{{row.no}}
																				</template>
																			</el-table-column>
																			<el-table-column width="100">
																				<template #default="{ row }">
																					{{row.unit}}
																				</template>
																			</el-table-column>
																			<el-table-column width="140">
																				<template #default="{ row }">
																					{{row.quantity}}
																				</template>
																			</el-table-column>
																			<el-table-column width="115">
																				<template #default="{ row }">
																					{{row.formattedValue}}
																				</template>
																			</el-table-column>
																			<el-table-column width="80">
																				<template v-if="tableData.length>0"
																					#default="{ $index }">
																				</template>
																			</el-table-column>
																		</el-table>
																	</div>
																	<div class="ml10 mt10">
																		<!-- <el-button type="primary" @click="addRow">增行</el-button> -->
																	</div>
																</div>
																<!--章-->
																<div class="badge-box">
																	<div class="circle-badge">更正章</div>
																	<div class="circle-badge">更正章</div>
																	<div class="circle-badge">更正章</div>
																</div>
																<!--地址列表-->
																<div class="address-list">
																	<ul v-for="(address, index) in addresses" :key="index"
																		class="address-item">
																		<li>
																			<div class="flex gap-4 items-center">
																				{{address.address}}
																				{{address.name}}
																			</div>
																		</li>
																	</ul>
																	<div v-if="addresses.length === 0" class="empty-tip">
																		暂无地址信息，请添加地址</div>
																</div>
															</div>
														</td>
													</tr>
												</tbody>
											</table>
											<!--物流单列表 end-->
										</td>
									</tr>
									<tr>
										<td colspan="4">Seal No.封号
											<p class="p10 mb10">
												{{form.value9}}
											</p>
										</td>
									</tr>
									<tr>
										<td colspan="4">Cont. size&type 箱型尺寸
											<p class="p10 mb10">
												{{form.value10}}
											</p>
										</td>
									</tr>
									<tr>
										<td colspan="4">
											<div class="section">
												<div class="tit">Packer's Name/Address装箱人名称/地址</div>
												<p class="ml10 mb10">
													<!-- <el-button type="primary" @click="addAddress">增加</el-button> -->
												</p>
												<p class="tit">Tel No.电话号码</p>
												<p>&nbsp;</p>
											</div>
										</td>
									</tr>
									<tr>
										<td colspan="4">
											<div class="section">
												<div>
													<div class="tit">Packing Date 装箱日期</div>
													<p class="ml10">
														{{form.endTime2}}
													</p>
												</div>
												<p class="tit">Packed By</p>
											</div>
										</td>
										<td>Total Packages<br>总件数
											<p class="p10">
												{{form.value11}}
											</p>
										</td>
										<td>Total Cargo Wt<br>总货重
											<p class="p10">
												{{form.value12}}
											</p>
										</td>
										<td>Total Meas<br>总尺码
											<p class="p10">
												{{form.value13}}
											</p>
										</td>
										<td colspan="2" rowspan="2">
											Remarks备注
											<p>1、如对装箱单数据有疑义，请及时联系货代确认，未经确认产生的错误和费用自行承担;</p>
											<p>2、在装箱单上如实填写货物毛重，保证每柜的实际数据与进港装箱单上的数据相符；</p>
											<p>3、此序列号可在手机APP端预约成功后进行提箱，请妥善保管，避免遗失或被他人盗用;</p>
											<p>4、请在提箱出门前确认情况，如无异议视同情况良好。</p>
										</td>
									</tr>
									<tr>
										<td colspan="4">Received By Drayman<br>驾驶员签收及车号
											<p class="p10 ml10">
												{{form.value14}}
											</p>
										</td>
										<td colspan="2">Cont. Tare Wt集装箱皮重
											<p class="p10 ml10">
												{{form.value15}}
											</p>
										</td>
										<td>Cgo/cont Total WT货/箱总重量</td>
									</tr>
								</tbody>
							</table>
						</el-form>
					</div>
					<div class="action-btns">
						<el-button type="primary" @click="generateImage2()">图片生成</el-button>
					</div>
				</el-dialog>
			</div>
			
		</el-dialog>
		
	</div>
	
</template>

<script setup lang="ts">
	import { ref, defineExpose, defineEmits } from 'vue';
	import html2canvas from 'html2canvas';
	import { optionsComm } from '@/api/commonList';
	const form = ref({
		ship_info: '',
		workNumber: '',
		phone: '',
		invoiceType: '',
		email: '',
		dollarType: '',
		rmbType: '',
		isDisabled: true,
		startTime: '',
		endTime: '',
		endTime2: '',
		periodTime: '',
		port: '',
		wharf: '',
		value1: '',
		value2: '',
		value3: '',
		value4: '',
		value5: '',
		value6: '',
		value7: '',
		value8: '',
		value9: '',
		value10: '',
		value11: '',
		value12: '',
		value13: '',
		value14: '',
		value15: ''
	})

	const dialogTableVisible = ref(false)
	// const tableData = ref([{ name: '', no: '', unit: '', quantity: null, formattedValue: null }])
	const tableData = ref([])
	const addRow = () => {
		if (tableData.value.length < 8) {
			tableData.value.push({ name: '', no: '', unit: '', quantity: null, formattedValue: null })
		}
	}
	const delRow = (index) => {
		tableData.value.splice(index, 1)
	}

	/*html转换图片预览*/
	// 内容区域引用
	const contentRef = ref<HTMLElement | null>(null)
	// 预览图片URL
	const previewImage = ref<string>('')
	// 加载状态
	const loading = ref(false)

	// 生成图片
	const generateImage = async () => {
		// if (!contentRef.value) return

		// loading.value = true
		// try {
		// 	const canvas = await html2canvas(contentRef.value, {
		// 		backgroundColor: null, // 透明背景
		// 		useCORS: true, // 允许跨域图片
		// 		scale: 2 // 提高分辨率
		// 	})

		// 	// 转换为DataURL
		// 	previewImage.value = canvas.toDataURL('image/png')
		// 	dialogTableVisible.value = true
		// } catch (error) {
		// 	console.error('生成图片失败:', error)
		// 	alert('生成图片失败，请重试')
		// } finally {
		// 	loading.value = false
		// }
		dialogTableVisible.value = true
		loading.value = false
	}
	// 地址数据
	// const addresses = ref([{name: '',address: '',}]);
	const addresses = ref([]);

	// 新地址表单数据
	const newAddress = ref({
		name: '',
		address: ''
	});

	// 添加地址
	const addAddress = () => {
		// 创建新地址对象（避免引用问题）
		const address = { ...newAddress.value };
		addresses.value.push(address);

		// 清空表单
		newAddress.value = {
			name: '',
			address: ''
		};
	};

	// 删除地址
	const deleteAddress = (index) => {
		addresses.value.splice(index, 1);
	};

	/*字母小写强制转换大写
	示例：
	在需要引用的input 加入@input="handleInput"
	*/

	const inputValue = ref('');
	const handleInput = (event) => {
		inputValue.value = event.target.value.toUpperCase();
	};

	const reset = (isNew) => {
		form.value = {
			workNumber: '',
			phone: '',
			invoiceType: '',
			email: '',
			dollarType: '',
			rmbType: '',
			isDisabled: true,
			startTime: '',
			endTime: '',
			endTime2: '',
			periodTime: '',
			port: '',
			wharf: '',
			value1: '',
			value2: '',
			value3: '',
			value4: '',
			value5: '',
			value6: '',
			value7: '',
			value8: '',
			value9: '',
			value10: '',
			value11: '',
			value12: '',
			value13: '',
			value14: '',
			value15: ''
		}

		tableData.value = [{ name: '', no: '', unit: '', quantity: null, formattedValue: null }]
		addresses.value = [
			{
				name: '',
				address: '',
			}
		];
		newAddress.value = {
			name: '',
			address: ''
		};
		inputValue.value = '';
		
		if(!isNew){
			newData.value = true;
			openPackForm(saveData.value, dataOptions.value, true);
		}
	}
	reset(true)
	
	function countQuantity(){
		form.value.value11 = 0;
		form.value.value12 = 0;
		form.value.value13 = 0;
		tableData.value.forEach((item)=>{
			form.value.value11 += (parseFloat(item.unit)||0);
			form.value.value12 += (parseFloat(item.quantity)||0);
			form.value.value13 += (parseFloat(item.formattedValue)||0);
		})
	}
	
	const changeValue = () => {
		emit('changePackForm', form.value);
	}
	
	const packFormShow = ref(false);
	const saveData = ref({});
	const dataOptions = ref([]);
	const newData = ref(true);
	const openPackForm = (data, options, open) => {
		saveData.value = data;
		dataOptions.value = options;
		// console.log('装箱单',data, options);
		if(open&&!newData.value) {
			newData.value = false;
			packFormShow.value = open;
			return;
		};
		var boxInfo = data.boxInfo;
		
		var entered_port_wharf = data.entered_port_wharf_id?options.MT.find(v=>{return v.id==data.entered_port_wharf_id}):{};  //进港码头
		var boxType = boxInfo.container_type_id&&options.XZLX?options.XZLX.find(v=>{return v.id==boxInfo.container_type_id}):{};  //箱型
		var lxdc = boxInfo.drop_off_wharf_id&&options.LX?options.LX.find(v=>{return v.id==boxInfo.drop_off_wharf_id}):{};  //落箱堆场
		var yt = boxInfo.pre_pull_wharf_id&&options.YT?options.YT.find(v=>{return v.id==boxInfo.pre_pull_wharf_id}):{};  //预提
		var txmt = boxInfo.wharf_id&&options.MT?options.MT.find(v=>{return v.id==boxInfo.wharf_id}):{};  //提箱码头
		var shipping_company = data.shipping_company_id&&options.CGS?options.CGS.find(v=>{return v.id==data.shipping_company_id}):{};  //船公司
		var freight_status = boxInfo.freight_status?optionsComm['运费情况'].find(v=>{return v.value==boxInfo.freight_status}):{};  //运费情况
		
		form.value.ship_info = (data.ship_name||'')+'/'+(data.ship_no||'');  //船名/航次
		form.value.startTime = data.port_open_at;  //开港时间
		form.value.endTime = data.port_close_at;  //进港时间
		form.value.port = data.origin_port;  //起运港
		form.value.wharf = entered_port_wharf.name||'';  //进港码头
		form.value.value2 = data.destination_port;  //目的港
		form.value.value4 = shipping_company.name||'';  //船公司
		form.value.value7 = txmt.name||'';  //提箱码头
		form.value.value8 = boxInfo.no;  //箱号
		form.value.value9 = boxInfo.seal_number;  //封号
		form.value.value10 = boxType.name||'';  //箱型
		form.value.value5 = boxType.name||'';  //箱型
		form.value.workNumber = boxInfo.serial_number;  //序列号
		form.value.endTime2 = boxInfo.loading_at?boxInfo.loading_at+':00':'';  //装柜时间
		form.value.value14 = boxInfo.driver;  //司机信息
		// console.log('form.value', form.value)
		
		tableData.value = [];
		if(boxInfo.container_items){
			boxInfo.container_items.forEach((item)=>{
				tableData.value.push({
					no: item.bl_no,
					unit: item.quantity||0,
					quantity: item.gross_weight||0,
					formattedValue: item.volume||0,
				})
			})
			countQuantity();
		}else{
			tableData.value = [[{ name: '', no: '', unit: '', quantity: null, formattedValue: null }]]
		}
		addresses.value = [];
		if(boxInfo.container_loading_addresses){
			boxInfo.container_loading_addresses.forEach((item)=>{
				addresses.value.push({
					address: item.loading_address,
					name: item.contact_name+'/'+item.phone,
					remark: item.remark
				})
			})
		}else{
			addresses.value = [{name: '',address: '',}]
		}
		packFormShow.value = open;
	}
	const emit = defineEmits(['changePackForm'])
	defineExpose({
		openPackForm,
		form,
		reset
	})

	// 生成图片的方法
	const captureDiv = ref(null); // 引用目标 div
	const generateImage2 = () => {
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
	}
</script>

<style scoped>
	:deep(.el-input__inner) {
		color: #000;
	}

	:deep(.el-input__wrapper) {
		background-color: transparent;
	}

	:deep(.el-table tr:hover) {
		background-color: transparent;
	}
	
	:deep(.redColor .el-input__inner){
		color: red;
	}

	.pack-of-lading-draft {
		max-width: 1200px;
		margin: 20px auto;
		padding: 20px;
	}

	.wrapper {
		width: 1100px;
	}

	.area {
		padding: 0 10px;
	}

	.box {
		position: relative;
	}

	.detail-box {
		display: flex;
		/* align-items: center; */
	}

	.badge-box {
		display: flex;
		align-items: center;
		margin: 10px auto;
		width: 400px;
		padding-top: 30px;
		position: absolute;
		left: 30%;
		top: 20%;
	}

	.circle-badge {
		width: 50px;
		/* 圆的宽度 */
		height: 50px;
		/* 圆的高度 */
		background-color: #fff;
		/* 圆的背景颜色 */
		border: 2px solid #3498db;
		/*圆的边 */
		border-radius: 50%;
		/* 关键属性，使元素变为圆形 */
		display: flex;
		/* 使用flex布局使文本居中 */
		justify-content: center;
		/* 水平居中 */
		align-items: center;
		/* 垂直居中 */
		color: #3498db;
		/* 文字颜色 */
		font-weight: bold;
		/* 文字加粗 */
		margin-right: 50px;
	}

	ul,
	li {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.address-list {
		padding-top: 100px;
	}

	.address-list ul li {
		padding: 0 10px;
		margin-bottom: 10px;
	}

	.header {
		display: flex;
		align-items: center;
		width: 100%;
	}

	h1 {
		font-weight: bold
	}

	.header h1 {
		font-size: 40px;
		color: green;
	}

	.tit {
		font-weight: bold;
	}

	h2 {
		font-size: 18px;
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

	.mtb5 {
		margin-top: 5px;
		margin-bottom: 5px;
	}

	.mt40 {
		margin-top: 40px;
	}

	.mt30 {
		margin-top: 25px;
	}

	.mb10 {
		margin-bottom: 10px;
	}

	.ml10 {
		margin-left: 10px;
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

	.action-btns {
		text-align: right;
	}

	.center {
		text-align: center;
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
		border: 1px solid #000;
		vertical-align: top;
		color: #000;
		font-size: 14px;
		font-weight: bold;
		min-height: 80px;
	}

	th {
		background-color: #f5f7fa;
		font-weight: 600;
	}

	.list {
		vertical-align: top;
		margin: 0;
		border-collapse: collapse;
		min-height: 282px;
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

	.logo {
		max-width: 150px;
		vertical-align: text-top;
	}

	.flex {
		display: flex;
	}

	.gap-4 {
		gap: 1rem;
	}

	.items-center {
		align-items: center;
	}
</style>