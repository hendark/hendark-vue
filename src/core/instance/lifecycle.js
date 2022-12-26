import Watcher from "../observe/watcher";
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
    parentElm.insertBefore(newElm, elm.nextSibling);
    parentElm.removeChild(elm);
    return newElm;
  } else {
    //TODO  diff
  }
}
export function initLifeCycle(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    const el = vm.$el;

    // 初始化和更新功能
    vm.$el = patch(el, vnode);
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

  // 1.vm._render ast语法树生成虚拟dom
  // 2.vm._update 虚拟dom转为真实dom
  const updateComponent = () => {
    vm._update(vm._render());
  };
  const watcher = new Watcher(vm, updateComponent, true);
  // 3.插入到el元素中
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook];
  if (handlers) {
    handlers.forEach((handler) => handler.call(vm));
  }
}
