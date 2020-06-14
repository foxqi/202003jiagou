export default class Moudle{
    constructor(rootModule){
        this._rawModule=rootModule;
        this._children={};
        this.state=rootModule.state;
    }
    getChild(key){
        return this._children[key]
    }
    addChild(key,module){
        this._children[key]=module
    }
}