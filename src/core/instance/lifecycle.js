import { createElement, createTextVNode } from "../vdom";
function createElm(vnode) {
  let { tag, data, children, text } = vnode;
  if (typeof tag === "string") {
    vnode.el = document.createElement(tag);
    patchProps(vnode.el, data);
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}
function patchProps(el, props) {
  for (const key in props) {
    if (Object.hasOwnProperty.call(props, key)) {
      if (key === "style") {
        for (const styleName in props.style) {
          if (Object.hasOwnProperty.call(props.style, styleName)) {
            el.style[styleName] = props.style[styleName];
          }
        }
      } else {
        el.setAttribute(key, props[key]);
      }
    }
  }
}

function patch(oldVNode, vnode) {
  const isRealElement = oldVNode.nodeType;
  // 首次为真实节点
  if (isRealElement) {
    const elm = oldVNode;

    const parentElm = elm.parentNode;
    const newElm = createElm(vnode);
    parentElm.insertBefore(newElm,elm.nextSibling);
    parentElm.removeChild(elm);
    return newElm;
  }else{
    //TODO  diff 
  }
}
export function initLifeCycle(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    const el = vm.$el;
    
    // 初始化和更新功能
    vm.$el = patch(el, vnode);
    console.log("update", vnode, vm.$el);
  };
  Vue.prototype._render = function () {
    const vm = this;
    return vm.$options.render.call(vm); //this指向Vue,如果不使用call指向Vue.$options
  };
  Vue.prototype._c = function () {
    return createElement(this, ...arguments);
  };
  Vue.prototype._v = function () {
    return createTextVNode(this, ...arguments);
  };
  Vue.prototype._s = function (value) {
    if (typeof value !== "object") return value;
    return JSON.stringify(value);
  };
}

export function mountComponent(vm, el) {
  vm.$el = el;

  // 1.调用render方法产生虚拟节点 虚拟dom
  const vnode = vm._render();

  // 2.虚拟dom转为真实dom
  vm._update(vnode);
  // 3.插入到el元素中
}
