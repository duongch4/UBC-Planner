import BaseStore from './BaseStore'
import { STUDENT_INIT_COURSE, STUDENT_UPDATE_COURSE, STUDENT_ADD_COURSE, STUDENT_REMOVE_COURSE } from '../constants/WorksheetConstants';
import { LOG_IN } from '../constants/LoginConstants'

class StudentCourseStore extends BaseStore {
    constructor() {
        super();
        this.subscribe(()=> this._registerToActions.bind(this));
        this._courses = null;
    }

    _courses = {};
    _approvedCourses = {};
    _completedCourses = {};
    _todoCourses = {};

    get progress() {
        return this._progress;
    }

    get courses() {
        return this._courses;
    }

    get approvedCourses() {
        return this._approvedCourses
    }

    get todoCourses() {
        return this._todoCourses
    }

    setFields = () => {
        Object.keys(this._courses).forEach(function(id){
            let course = this._courses[id];
            if (course && course.grade) {
                if (course.isGradApproved ) this._approvedCourses[id] = course;
                else this._completedCourses[id] = course;
            } else {
                this._todoCourses[id] = course;
            }
        }.bind(this));
    }

    _registerToActions = (action) => {
        console.log("before switch", action);
        switch(action.actionType) {
            case LOG_IN:
                this._courses = action.user.courses;
                this.setFields();
                this.emitChange();
                break;

            case STUDENT_UPDATE_COURSE:
                let updatedCourse = action.course;
                let thisCourse = this.courses[updatedCourse.id];
                let attributes = Object.keys(updatedCourse);

                attributes.forEach(function (attrName) {
                    thisCourse[attrName] = updatedCourse[attrName];
                });
                this.setFields();
                this.emitChange();
                break;

            case STUDENT_ADD_COURSE:
                this._courses[action.course.id] = action.course;
                this.setFields();
                this.emitChange();
                break;

            case STUDENT_REMOVE_COURSE:
                delete this._courses[action.courseId];
                this.setFields();
                this.emitChange();
                break;

            default:
                break;
        }
    }
}

export default new StudentCourseStore();