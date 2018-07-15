import { ON_QUERY, ON_RESET } from '../constants/CourseSearchConstants'
import BaseStore from './BaseStore'

const source  = require("../data/courses");
//const source  = require("../data/courseSearchList");

class CourseSearchStore extends BaseStore {

    constructor() {
        super();
        this.subscribe(()=>this._registerToActions.bind(this))
        this._query = null;     // array of course id's
        this._results = null;   // array of course objects
    }

    get results() {
        return this._results;
    }

    get query() {
        return this._query;
    }

    _registerToActions(action) {
        switch(action.actionType) {
            case ON_QUERY:
                console.log(action);
                this._query = action.data.query;
                this._results = action.data.results.map((id) => {return source[id]})
                this.emitChange();
                break;
            case ON_RESET:
                this._user = null;
                this.emitChange();
                break;
            default:
                break;
        }
    }

}

export default new CourseSearchStore();
