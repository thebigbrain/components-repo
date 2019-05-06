export default class EventEmitter {
  bus = {};

  emit(eventName, payload) {
    let callbackList = this.bus[eventName];
    callbackList.forEach(cb => cb(payload));
  }

  addListener(eventName, listener) {
    let callbackList = this.bus[eventName];
    if (callbackList == null) {
      callbackList = new Set();
      this.bus[eventName] = callbackList;
    }

    callbackList.add(listener);
  }
}
