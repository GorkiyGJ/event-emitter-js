class EventEmitter {

    constructor(){
        this.events = {};

        if (typeof Array.prototype.indexOf === 'function') {
            this.indexOf = function (haystack, needle) {
                return haystack.indexOf(needle);
            };
        } else {
            this.indexOf = function (haystack, needle) {
                var i = 0, length = haystack.length, idx = -1, found = false;

                while (i < length && !found) {
                    if (haystack[i] === needle) {
                        idx = i;
                        found = true;
                    }

                    i++;
                }

                return idx;
            };
        }
    }

    on(event, listener) {
        if (typeof this.events[event] !== 'object') {
            this.events[event] = [];
        }

        this.events[event].push(listener);

        return ()=>{
            this.removeListener(event, listener)
        }
    }

    subscribe(event, listener) {
        return this.on(event, listener)
    }

    removeListener(event, listener) {
        var idx;

        if (typeof this.events[event] === 'object') {
            idx = this.indexOf(this.events[event], listener);

            if (idx > -1) {
                this.events[event].splice(idx, 1);
            }
        }
    }

    emit(event, sync) {
        let emit = ()=>{
            var i, listeners, length, args = [].slice.call(arguments, 1);

            if (typeof this.events[event] === 'object') {
                listeners = this.events[event].slice();
                length = listeners.length;

                for (i = 0; i < length; i++) {
                    listeners[i].apply(this, args);
                }
            }
        }

        if(sync) {
            emit()
        } else {
            Promise.resolve()
                .then(()=>{
                    emit()
                })
        }
    }

    once(event, listener) {
        return this.on(event, function g () {
            this.removeListener(event, g);
            listener.apply(this, arguments);
        });
    }


    dispose(){
        this.events = []
    }
}

export default EventEmitter