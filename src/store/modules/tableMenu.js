const useTableMenuStore = defineStore("tableMenu", {
	state: () => ({
		menuList: {}
	}),
	actions: {
		//更新表格列表信息
		updateMenu(key, data){
			this.menuList[key] = data;
		},
		//清空表格列表信息
		clearMenu(){
			this.menuList = {};
		}
	},
});

export default useTableMenuStore;