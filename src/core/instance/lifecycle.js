export function initLifeCycle(Vue) {
  Vue.prototype._update = function () {};
  Vue.prototype._render = function () {
    const vm = this;
    vm.$options.render.call(vm);//this指向Vue,如果不使用call指向Vue.$options
  };
  Vue.prototype._c = function () {
    // console.log('_c');
  };
  Vue.prototype._v = function () {
    // console.log('_v');
  };
  Vue.prototype._s = function () {
    // console.log('_s');
  };
}

export function mpuntComponent(vm, el) {
  // 1.调用render方法产生虚拟节点 虚拟dom
  vm._render();

  // 2.虚拟dom转为真实dom

  // 3.插入到el元素中
}
