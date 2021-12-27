window.cb={events:{}};
function EventTarget() {
    this.handlers = {};
}
EventTarget.prototype = {
    constructor: EventTarget,
    addHandler: function (type, handler) {
        if (typeof this.handlers[type] == 'undefined') {
            this.handlers[type] = [];
        }
        this.handlers[type].push(handler);
    },
    removeHandler: function (type, handler) {
        if (this.handlers[type] instanceof Array) {
            var arr = this.handlers[type];
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i] == handler) {
                    arr.splice(i, 1);
                }
            }
        }
    },
    dispatchEvent: function (event) {
        if (!event.target) {
            event.target = this;
        }
        if (this.handlers[event.type] instanceof Array) {
            var arr = this.handlers[event.type];
            for (var i = 0, len = arr.length; i < len; i++) {
                arr[i](event);
            }
        }
    }
}

function handleEvent() {
    const eventMap = new Map();
    return {
        init: (eventName, callback) => {
            let myEvent = new EventTarget();
            myEvent.addHandler(eventName, function (params) {
                callback(params);
            });
            eventMap.set(eventName, myEvent);
        },
        trigger: (eventName, ...params) => {
            eventMap.has(eventName) && eventMap.get(eventName).dispatchEvent(Object.assign({
                type: eventName
            }, params));
        },
        remove:(eventName)=>{
            eventMap.has(eventName) && eventMap.delete(eventName);
        }
    }
}

cb.events = handleEvent();