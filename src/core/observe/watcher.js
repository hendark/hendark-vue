import nextTick from "../util/next-tick";
import Dep from "./dep";

let uid = 0;
export default class Watcher {
  /* 
    dep n...n watch
    一个属性一个dep,一个属性存在多个组件中，对应多个watch
    一个组件一个watch,里面有多个属性，对应多个dep
    */
  constructor(vm, fn, isRenderWatcher) {
    this.id = ++uid;
    this.getter = fn;
    //watcher中收集dep,后续计算属性和一些清理工作需要用到dep
    this.deps = [];
    this.depsId = new Set();
    this.get();
  }

  get() {
    /* 
            1.创建watcher的时候，把watcher赋值给Dep.target上
            2.getter调用vm._render()取值,触发Object.defineProperty的get方法,去收集watcher。
            3.收集完毕删除当前watcher，避免收集到不需要渲染的watcher
        */
    Dep.target = this;
    this.getter();
    Dep.target = null;
  }

  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      // watcher记录dep
      this.deps.push(dep);
      this.depsId.add(id);
      dep.addSub(this); //去dep收集watcher
    }
  }

  update() {
    queueWatcher(this);
  }

  run() {
    this.get();
  }
}
let queue = [];
let has = {};
let pending = false; //防抖，无论执行多少update,只执行一次刷新
function flushSchedulerQueue() {
  let flushQueue = queue.slice();
  queue = [];
  has = {};
  pending = false;
  for (let i = 0, l = flushQueue.length; i < l; i++) {
    flushQueue[i].run();
  }
}

function queueWatcher(watcher) {
  const id = watcher.id;
  if (!has[id]) {
    queue.push(watcher);
    has[id] = true;
    if (!pending) {
      //   setTimeout(flushSchedulerQueue, 0);
      nextTick(flushSchedulerQueue);
      pending = true;
    }
  }
}
