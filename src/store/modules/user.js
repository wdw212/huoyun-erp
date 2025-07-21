import {
	login,
	logout,
	getInfo
} from "@/api/login";
import {
	getToken,
	setToken,
	removeToken
} from "@/utils/auth";
import {
	isHttp,
	isEmpty
} from "@/utils/validate";
import defAva from "@/assets/images/profile.jpg";

const useUserStore = defineStore("user", {
	state: () => ({
		token: getToken(),
		id: "",
		name: "",
		avatar: "",
		userRole: null, //当前登录人的角色
		roles: [],
		permissions: [],
		userRouteList: [],
		userRoleCode: null //当前登录人的角色code
	}),
	actions: {
		// 登录
		login(userInfo) {
			const username = userInfo.username.trim();
			const password = userInfo.password;
			const code = userInfo.code;
			const uuid = userInfo.uuid;
			return new Promise((resolve, reject) => {
				login(username, password, code, uuid).then(res => {
					// console.log(res, "token");
					setToken(res.token)
					this.token = res.token
					resolve()
				}).catch(error => {
					reject(error)
				})

				// // 测试用
				// let token =
				//   "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImxvZ2luX3VzZXJfa2V5IjoiOTM5NzI0ZDAtZDczMS00MTY4LWJlZGMtNWIzZWQ5NTJlNDZjIn0.rCPVxzOZWVi23GTqIwjDhVUTqJif5f2sSQtzbsK61Uv4CbVPeeTz7alFJJfOuxzVT_PC1e2GqxkvgnTd8Z1PVQ";
				// setToken(token);
				// this.token = token;
				// resolve();
			});
		},
		// 获取用户信息
		getInfo() {
			// var roleInfo = getRole
			return new Promise((resolve, reject) => {
				getInfo()
					.then((res) => {
						console.log(res, "获取用户信息");
						this.id = res.id;
						this.name = res.name;
						this.avatar = "";
						this.userRole = res.role;
						this.userRoleCode = res.role.code;
						this.userRouteList = res.permissions||[];
						if(res.role&&res.role.code=='SUPER_ADMIN'){
							this.roles = [res.role.code];
							this.permissions = ["*:*:*"];
							resolve(res);
						}else if (res.roles) {
							// 验证返回的roles是否是一个非空数组
							this.roles = [res.role.code];
							resolve(res);
						} else {
							this.roles = ["viewer"];
							this.permissions = [];
							resolve(res);
						}
					})
					.catch((error) => {
						reject(error);
					});
			});
		},
		setPermissions(permissions){
			this.permissions = permissions;
		},
		// 退出系统
		logOut() {
			return new Promise((resolve, reject) => {
				// logout(this.token)
				//   .then(() => {
				//     this.token = "";
				//     this.roles = [];
				//     this.permissions = [];
				//     removeToken();
				//     resolve();
				//   })
				//   .catch((error) => {
				//     reject(error);
				//   });

				// 测试用
				this.token = "";
				this.roles = [];
				this.permissions = [];
				removeToken();
				resolve();
			});
		},
	},
});

export default useUserStore;