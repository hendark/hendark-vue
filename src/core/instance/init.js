import { compileToFunction } from "../../compiler";
import { initState } from "./state";
import { mountComponent } from "./lifecycle";
import nextTick from "../util/next-tick";

export function initMixin(Vue) {
  Vue.prototype.$nextTick = nextTick;
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;

    //初始化状态，创建属性的get set
    initState(vm);

    if (options.el) {
      vm.$mount(options.el);
    }
  };
  Vue.prototype.$mount = function (el) {
    const vm = this;
    el = document.querySelector(el);
    let ops = vm.$options;
    if (!ops.render) {
      let template;
      if (!ops.template && el) {
        //使用el挂载的
        template = el.outerHTML;
      } else {
        if (el) {
          //使用template
          template = ops.template;
        }
      }
      if (template) {
        const render = compileToFunction(template);
        ops.render = render; //jsx编译成h()
      }
    }
    //runtime没有模板编译,不能使用template，编译过程是通过loader来转移vue文件。
    mountComponent(vm, el);
  };
}
