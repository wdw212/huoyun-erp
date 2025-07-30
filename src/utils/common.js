//详情数据回显
export const detailInfo = (formList, data) => {
	formList.forEach((item, index) => {
		item.formData && item.formData.forEach((v, i) => {
			if (v.formItem && v.formItem.length > 0) {
				v.formItem.forEach((vv, ii) => {
					if(!vv.key) return;
					if (vv.key.indexOf('.')>-1){
						var key = vv.key.split('.');
						formList[index].formData[i].formItem[ii].defaultValue = data[key[0]][key[1]];
					} else {
						formList[index].formData[i].formItem[ii].defaultValue = data[vv.key];
					}
				})
			}
		})
	})
	return formList;
}