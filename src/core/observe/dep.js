let uid = 0;
export default class Dep {
  constructor() {
    this.id = ++uid;
    this.subs = [];
  }
  depend() {
    //防止收集重复的watcher，同时实现dep与watcher双向关联
    if (Dep.target) {
      Dep.target.addDep(this); //watcher记住当前dep
    }
  }

  addSub(watcher) {
    this.subs.push(watcher);
  }

  notify() {
    const subs = this.subs.slice();
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }
}
Dep.target = null;
