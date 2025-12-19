// 当前月份起始结束日期
export function currentMonthFirst() {
	var date = new Date();
	date.setDate(1);
	return date;
}
export function currentMonthLast() {
	var date = new Date();
	var currentMonth = date.getMonth();
	var nextMonth = ++currentMonth;
	var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
	var oneDay = 1000 * 60 * 60 * 24;
	return new Date(nextMonthFirstDay - oneDay);
}

// 指定月份起始结束日期
export function monthFirst(date) {
	date.setDate(1);
	return date;
}
export function monthLast(date) {
	var month = date.getMonth();
	var nextMonth = ++month;
	var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
	var oneDay = 1000 * 60 * 60 * 24;
	return new Date(nextMonthFirstDay - oneDay);
}

//中国标准时间转换为自己想要的格式
// 用法  Utils.formatChinaTime(dateValue,'yyyy-MM-dd HH:mm:ss')
export function formatChinaTime(time, format) {
	let t = new Date(time);
	let tf = function(i) {
		return (i < 10 ? '0' : '') + i
	};
	return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
		switch (a) {
			case 'yyyy':
				return tf(t.getFullYear());
			case 'MM':
				return tf(t.getMonth() + 1);
			case 'mm':
				return tf(t.getMinutes());
			case 'dd':
				return tf(t.getDate());
			case 'HH':
				return tf(t.getHours());
			case 'ss':
				return tf(t.getSeconds());
		}
	})
}

//时间转时间戳
export function strFormatTime(time) {
	var newTime = time.replace(/\-/g, '/');
	return new Date(newTime).getTime()
}

// 时间戳转日期时间
export function formatDateStamp(num) { //时间戳数据处理
	let date = new Date(num);
	//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	let y = date.getFullYear();
	let MM = date.getMonth() + 1;
	MM = MM < 10 ? ('0' + MM) : MM; //月补0
	let d = date.getDate();
	d = d < 10 ? ('0' + d) : d; //天补0
	return y + '-' + MM + '-' + d;
}

// 时间戳转日期时间
export function formatTimeStamp(num) { //时间戳数据处理
	let date = new Date(num);
	//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	let y = date.getFullYear();
	let MM = date.getMonth() + 1;
	MM = MM < 10 ? ('0' + MM) : MM; //月补0
	let d = date.getDate();
	d = d < 10 ? ('0' + d) : d; //天补0
	let h = date.getHours();
	h = h < 10 ? ('0' + h) : h; //小时补0
	let m = date.getMinutes();
	m = m < 10 ? ('0' + m) : m; //分钟补0
	let s = date.getSeconds();
	s = s < 10 ? ('0' + s) : s; //秒补0
	return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
}

// 时间戳转当月时间
export function formatDateMonthStamp(num) { //时间戳数据处理
	let date = new Date(num);
	//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	let y = date.getFullYear();
	let MM = date.getMonth() + 1;
	MM = MM < 10 ? ('0' + MM) : MM; //月补0
	return y + '-' + MM;
}

//获取本周日期
export function getCurrentWeekDates() {
	let today = new Date();
	let currentDayOfWeek = today.getDay(); // 获取今天是周几（0表示周日，1表示周一，...，6表示周六）
	let startDate = new Date(today.setDate(today.getDate() - currentDayOfWeek)); // 获取本周第一天的日期

	let weekDates = [];
	for (let i = 0; i < 7; i++) {
		let currentDate = new Date(startDate);
		currentDate.setDate(startDate.getDate() + i);
		weekDates.push(currentDate);
	}

	return weekDates;
}

//获取时间戳为星期几，显示格式
export function getWeek(time, type) {
	var data = '';
	if (!type) {
		var type = '';
	}
	var day = new Date(time).getDay();
	switch (day) {
		case 0:
			data = type + '日';
			break;
		case 1:
			data = type + '一';
			break;
		case 2:
			data = type + '二';
			break;
		case 3:
			data = type + '三';
			break;
		case 4:
			data = type + '四';
			break;
		case 5:
			data = type + '五';
			break;
		case 6:
			data = type + '六';
			break;
	}
	return data;
}