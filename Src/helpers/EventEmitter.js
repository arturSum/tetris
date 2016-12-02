


const EventEmitter = (() => {

    var _eventsMap = new Map(),
        _observersList = new Set(),

        _popElement = (source, key) => {

            var deletedValue = source.get(key);
            source.delete(key);

            return deletedValue
        },
        _noRegisteredEventsError = eventId => {
            console.error(`${eventId} not registered`);
        };


    return{

        subscribe : (eventId, observerObj) => {

            if(_eventsMap.has(eventId)){
                _observersList = _popElement(_eventsMap, eventId);
            }

            _observersList.add(observerObj);
            _eventsMap.set(eventId, _observersList);
        },


        detach : (eventId, observerObj) => {

            if(_eventsMap.has(eventId)){

                _observersList = _popElement(_eventsMap, eventId);
                _observersList.delete(observerObj);
                _eventsMap.set(eventId, _observersList);

                return true;
            }

            _noRegisteredEventsError(eventId);
        },

        notifyObservers : (eventId, additionalParam = []) => {

            if(_eventsMap.has(eventId)){

                for(let singleObserver of _observersList){
                    singleObserver.eventExecute(eventId, additionalParam);
                }

                return true;
            }

            _noRegisteredEventsError(eventId);
        }
    }

})();

export {EventEmitter};