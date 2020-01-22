import { Watcher } from "./watcher";

// See https://github.com/vuejs/vue/blob/be9ac624c81bb698ed75628fe0cbeaba4a2fc991/src/core/observer/dep.js
// for full implementation
export class Dep implements Dep {
  subs = new Set<Watcher>();
  // the current target watcher being evaluated.
  // this is globally unique because there could be only one
  // watcher being evaluated at any time.
  static target: null | Watcher = null;

  addSub(sub) {
    this.subs.add(sub);
  }

  delSub(sub) {
    this.subs.delete(sub);
  }

  depend(): void {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  notify() {
    this.subs.forEach(sub => sub.update());
  }
}

const targetStack = [];

export function pushTarget(_target) {
  if (Dep.target) targetStack.push(Dep.target);
  Dep.target = _target;
}

export function popTarget() {
  Dep.target = targetStack.pop();
}
