import auth from "@/plugins/auth";
import router, {
	constantRoutes,
	dynamicRoutes
} from "@/router";
import {
	getRouters
} from "@/api/menu";
import Layout from "@/layout/index";
import ParentView from "@/components/ParentView";
import InnerLink from "@/layout/components/InnerLink";

// 匹配views里面所有的.vue文件
const modules = import.meta.glob("./../../views/**/*.vue");


const routerList = [{
	alwaysShow: true,
	children: [{
			component: "system/user/index",
			hidden: false,
			meta: {
				icon: "user",
				link: null,
				noCache: false,
				title: "用户管理",
			},
			name: "User",
			path: "user",
		},
		{
			component: "system/role/index",
			hidden: false,
			meta: {
				icon: "peoples",
				link: null,
				noCache: false,
				title: "角色管理",
			},
			name: "Role",
			path: "role",
		},
		{
			component: "system/menu/index",
			hidden: false,
			meta: {
				icon: "tree-table",
				link: null,
				noCache: false,
				title: "权限管理",
			},
			name: "Menu",
			path: "menu",
		},
		{
			component: "system/dept/index",
			hidden: false,
			meta: {
				icon: "tree",
				link: null,
				noCache: false,
				title: "部门管理",
			},
			name: "Dept",
			path: "dept",
		},
		{
			component: "system/log/index",
			hidden: false,
			meta: {
				icon: "log",
				link: null,
				noCache: false,
				title: "日志管理",
			},
			name: "Log",
			path: "log",
		},
		{
			component: "system/tags/index",
			hidden: false,
			meta: {
				icon: "edit",
				link: null,
				noCache: false,
				title: "公告标签",
			},
			name: "Tags",
			path: "tags",
		},
		{
			component: "system/notices/index",
			hidden: false,
			meta: {
				icon: "message",
				link: null,
				noCache: false,
				title: "公告管理",
			},
			name: "Notices",
			path: "notices",
		},
		{
			component: "system/system-parameter/index",
			hidden: false,
			meta: {
				icon: "edit",
				link: null,
				noCache: false,
				title: "系统参数",
			},
			name: "SystemParameter",
			path: "systemParameter",
		},
		{
			component: "system/pull-down-options/index",
			hidden: false,
			meta: {
				icon: "edit",
				link: null,
				noCache: false,
				title: "下拉选项",
			},
			name: "PullDownOptions",
			path: "pull-down-options",
		}
	],
	component: "Layout",
	hidden: false,
	meta: {
		icon: "system",
		link: null,
		noCache: false,
		title: "系统管理",
	},
	name: "System",
	path: "/system",
	redirect: "noRedirect",
}, {
	alwaysShow: true,
	children: [{
		component: "operation-page/operating-document/index",
		hidden: false,
		meta: {
			icon: "edit",
			link: null,
			noCache: false,
			title: "操作单据",
		},
		name: "OperatingDocument",
		path: "operating-document",
	}],
	component: "Layout",
	hidden: false,
	meta: {
		icon: "edit",
		link: null,
		noCache: false,
		title: "操作页面",
	},
	name: "OperationPage",
	path: "/operation-page",
	redirect: "noRedirect",
}, {
	alwaysShow: true,
	children: [{
		component: "company/type/index",
		hidden: false,
		meta: {
			icon: "edit",
			link: null,
			noCache: false,
			title: "公司类型",
		},
		name: "Type",
		path: "type",
	}, {
		component: "company/headers/index",
		hidden: false,
		meta: {
			icon: "edit",
			link: null,
			noCache: false,
			title: "公司抬头",
		},
		name: "Headers",
		path: "headers",
	}, {
		component: "company/contracts/index",
		hidden: false,
		meta: {
			icon: "edit",
			link: null,
			noCache: false,
			title: "公司合同",
		},
		name: "Contracts",
		path: "contracts",
	}, {
		component: "company/contacts/index",
		hidden: false,
		meta: {
			icon: "edit",
			link: null,
			noCache: false,
			title: "公司通讯录",
		},
		name: "Contacts",
		path: "contacts",
	}, {
		component: "company/regions/index",
		hidden: false,
		meta: {
			icon: "edit",
			link: null,
			noCache: false,
			title: "地区列表",
		},
		name: "Regions",
		path: "regions",
	}, {
		component: "company/loading-addresses/index",
		hidden: false,
		meta: {
			icon: "edit",
			link: null,
			noCache: false,
			title: "装柜信息",
		},
		name: "LoadingAddresses",
		path: "loadingAddresses",
	},
	{
		component: "company/send-and-receive/index",
		hidden: false,
		meta: {
			icon: "edit",
			link: null,
			noCache: false,
			title: "收发通信息",
		},
		name: "SendAndReceive",
		path: "SendAndReceive",
	}],
	component: "Layout",
	hidden: false,
	meta: {
		icon: "edit",
		link: null,
		noCache: false,
		title: "公司信息",
	},
	name: "Company",
	path: "/company",
	redirect: "noRedirect",
}, {
	alwaysShow: true,
	children: [{
		component: "business-management/files-management/index",
		hidden: false,
		meta: {
			icon: "edit",
			link: null,
			noCache: false,
			title: "文件管理",
		},
		name: "FilesManagement",
		path: "files-management",
	}],
	component: "Layout",
	hidden: false,
	meta: {
		icon: "edit",
		link: null,
		noCache: false,
		title: "业务管理",
	},
	name: "BusinessManagement",
	path: "/business-management",
	redirect: "noRedirect",
}, {
	alwaysShow: true,
	component: "Layout",
	hidden: false,
	meta: {
		icon: "edit",
		link: null,
		noCache: false,
		title: "财务管理",
	},
	name: "FinanceManagement",
	path: "/finance-management",
	redirect: "noRedirect",
	children: [{
		component: "finance-management/profit-statistics/index",
		hidden: false,
		meta: {
			icon: "edit",
			link: null,
			noCache: false,
			title: "利润统计",
		},
		name: "ProfitStatistics",
		path: "profit-statistics",
	},{
		component: "finance-management/salary-settlement/index",
		hidden: false,
		meta: {
			icon: "edit",
			link: null,
			noCache: false,
			title: "工资结算",
		},
		name: "SalarySettlement",
		path: "salary-settlement",
	}],
},{
	// alwaysShow: true,
	component: "Layout",
	hidden: false,
	meta: {
		icon: "edit",
		link: null,
		noCache: false,
		title: "待办事项",
	},
	name: "TodoList",
	path: "/todo-list",
	redirect: "noRedirect",
	children: [{
		component: "todo-list/index",
		hidden: false,
		meta: {
			icon: "edit",
			link: null,
			noCache: false,
			title: "待办事项",
		},
		name: "todoListIndex",
		path: "todo-list-index",
	}],
  }
];



const usePermissionStore = defineStore("permission", {
	state: () => ({
		routes: [],
		addRoutes: [],
		defaultRoutes: [],
		topbarRouters: [],
		sidebarRouters: [],
	}),
	actions: {
		setRoutes(routes) {
			this.addRoutes = routes;
			this.routes = constantRoutes.concat(routes);
		},
		setDefaultRoutes(routes) {
			this.defaultRoutes = constantRoutes.concat(routes);
		},
		setTopbarRoutes(routes) {
			this.topbarRouters = routes;
		},
		setSidebarRouters(routes) {
			this.sidebarRouters = routes;
		},
		generateRoutes(roles) {
			return new Promise((resolve) => {
				// 向后端请求路由数据
				// getRouters().then(res => {
				//   const sdata = JSON.parse(JSON.stringify(res.data))
				//   const rdata = JSON.parse(JSON.stringify(res.data))
				//   const defaultData = JSON.parse(JSON.stringify(res.data))
				//   const sidebarRoutes = filterAsyncRouter(sdata)
				//   const rewriteRoutes = filterAsyncRouter(rdata, false, true)
				//   const defaultRoutes = filterAsyncRouter(defaultData)
				//   const asyncRoutes = filterDynamicRoutes(dynamicRoutes)
				//   asyncRoutes.forEach(route => { router.addRoute(route) })
				//   this.setRoutes(rewriteRoutes)
				//   this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))
				//   this.setDefaultRoutes(sidebarRoutes)
				//   this.setTopbarRoutes(defaultRoutes)
				//   resolve(rewriteRoutes)
				// })

				// 本地路由数据
				// console.log("本地路由数据");
				let data = routerList;
				const sdata = JSON.parse(JSON.stringify(data));
				const rdata = JSON.parse(JSON.stringify(data));
				const defaultData = JSON.parse(JSON.stringify(data));
				const sidebarRoutes = filterAsyncRouter(sdata);
				const rewriteRoutes = filterAsyncRouter(rdata, false, true);
				const defaultRoutes = filterAsyncRouter(defaultData);
				const asyncRoutes = filterDynamicRoutes(dynamicRoutes);
				asyncRoutes.forEach((route) => {
					router.addRoute(route);
				});
				this.setRoutes(rewriteRoutes);
				this.setSidebarRouters(constantRoutes.concat(sidebarRoutes));
				this.setDefaultRoutes(sidebarRoutes);
				this.setTopbarRoutes(defaultRoutes);
				resolve(rewriteRoutes);
			});
		},
	},
});

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
	return asyncRouterMap.filter((route) => {
		if (type && route.children) {
			route.children = filterChildren(route.children);
		}
		if (route.component) {
			// Layout ParentView 组件特殊处理
			if (route.component === "Layout") {
				route.component = Layout;
			} else if (route.component === "ParentView") {
				route.component = ParentView;
			} else if (route.component === "InnerLink") {
				route.component = InnerLink;
			} else {
				route.component = loadView(route.component);
			}
		}
		if (route.children != null && route.children && route.children.length) {
			route.children = filterAsyncRouter(route.children, route, type);
		} else {
			delete route["children"];
			delete route["redirect"];
		}
		return true;
	});
}

function filterChildren(childrenMap, lastRouter = false) {
	var children = [];
	childrenMap.forEach((el) => {
		el.path = lastRouter ? lastRouter.path + "/" + el.path : el.path;
		if (el.children && el.children.length && el.component === "ParentView") {
			children = children.concat(filterChildren(el.children, el));
		} else {
			children.push(el);
		}
	});
	return children;
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
	const res = [];
	routes.forEach((route) => {
		if (route.permissions) {
			if (auth.hasPermiOr(route.permissions)) {
				res.push(route);
			}
		} else if (route.roles) {
			if (auth.hasRoleOr(route.roles)) {
				res.push(route);
			}
		}
	});
	return res;
}

export const loadView = (view) => {
	let res;
	for (const path in modules) {
		const dir = path.split("views/")[1].split(".vue")[0];
		if (dir === view) {
			res = () => modules[path]();
		}
	}
	return res;
};

export default usePermissionStore;