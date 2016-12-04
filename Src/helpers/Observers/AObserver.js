
var AObserver = ()=>{

    throw 'Can not create object of Observer abstract class';
};

AObserver.prototype = {

    eventExecute(...args){
        throw 'eventExecute abstract method must be implement';
    }

};

export default AObserver;