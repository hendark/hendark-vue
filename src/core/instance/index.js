import { initMixin } from "./init";
import { initLifeCycle } from "./lifecycle";

function Vue(options) {
  this._init(options);
}

initMixin(Vue);
initLifeCycle(Vue);
export default Vue;

/* 
1. 将数据处理成响应式
2.模板编译：将模板生成ast语法树，ast语法树生成为render函数
3.render函数取值，产生对应的虚拟dom render(){_c('tag',attris,_v())}
4. 虚拟dom转换为真实dom
*/
