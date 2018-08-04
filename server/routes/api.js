const express = require('express');
const User = require('mongoose').model('User');

const router = new express.Router();

router.post('/info_update', (req, res) => {
    var query = {"info.email" : req.body.info.email};

    var newDataKeys = Object.keys(req.body.info);
    var newData = newDataKeys.reduce((data, key) => {
        data["info."+key] = req.body.info[key];
        return data;
    }, {});

    User.findOneAndUpdate(query, newData, {upsert:true}, function(err, doc){
        if (err) return res.send(500, { error: err });
        console.log("successfully updated");
        return res.send("successfully saved");
    });
});

router.post('/remarks_update', (req, res) => {

    var query = {"info.email" : req.body.email};
    var newData = {};
    newData["remarks." + req.body.id] = req.body.content;

    User.findOneAndUpdate(query, newData, {upsert:true}, function(err, doc){
        if (err) return res.send(500, { error: err });
        console.log("successfully updated");
        return res.send("successfully saved");
    });
});

router.post('/courses_add', (req, res) => {
    var query = {"info.email" : req.body.email};
    var newData = {};
    newData["courses." + req.body.course.id] = req.body.course;

    console.log("new data", newData);

    User.findOneAndUpdate(query, newData, {upsert:true}, function(err, doc){
        if (err) return res.send(500, { error: err });
        console.log("successfully deleted");
        return res.send("successfully deleted");
    });
});

router.post('/courses_delete', (req, res) => {
    var query = {"info.email" : req.body.email};
    var newData = {};
    newData["courses." + req.body.course.id] = 1;

    console.log("new data", newData);

    User.findOneAndUpdate(query, { $unset : newData }, {upsert:true}, function(err, doc){
        if (err) return res.send(500, { error: err });
        if (!!err) console.log("successfully updated");
        return res.send("successfully saved");
    });
});

router.post('/course_update', (req, res) =>{
    var query = {"info.email": req.body.email};
    try {
        console.log({email: req.body.email, origId: req.body.origId, courseId: req.body.courseId, field: req.body.field, value: req.body.value})

        if (req.body.origId) {

            console.log(req.body.origId, req.body.origId? true:false);

            var removeData = {};
            removeData["courses." + req.body.origId + "." + req.body.field] = null;
            console.log('/course_update: origId', removeData);

            User.updateOne(query, removeData, {upsert:true}, function(err, doc){
                if (err) return res.send(500, { error: err });
                console.log("origId:", req.body.origId);
            });
        }

        if (req.body.courseId) {

            console.log(req.body.courseId, req.body.courseId? true:false);
            var newData = {};
            newData["courses." + req.body.courseId + "." + req.body.field] = req.body.value;
            console.log('/course_update: newData', newData);

            User.updateOne(query, newData, {upsert: true}, function (err, doc) {
                if (err) return res.send(500, {error: err});

                if (!err) console.log("successfully updated");
                else console.error(">>>>>>>>error..", err);

                return res.send("successfully");
            });
        } else {
            res.send("successfully");
        }
    } catch (e) {
        console.log(e);
    }
})


//course_update_detail


router.post('/planner_course_update', (req, res) =>{
    var query = {"info.email": req.body.email};

    try {
        console.log({email: req.body.email, origId: req.body.origId, courseId: req.body.courseId, course: req.body.course})

        if (req.body.origId && (!req.body.courseId || req.body.origId !== req.body.courseId)) {
            console.log(req.body.origId, req.body.courseId, req.body.origId !== req.body.courseId);

            var removeData = {};
            removeData["courses." + req.body.origId + "." + "term"] = null;
            removeData["courses." + req.body.origId + "." + "year"] = null;
            console.log('/course_update: origId', removeData);

            User.updateOne(query, removeData, {upsert:true}, function(err, doc){
                if (err) return res.send(500, { error: err });
                console.log("origId:", req.body.origId);
            }).then(r => {

                if (req.body.courseId) {
                    console.log(req.body.courseId, req.body.courseId ? true : false);


                    var keys = Object.keys(req.body.course);

                    var newData = keys.reduce((obj, fieldName) => {
                        obj["courses." + req.body.courseId + "." + fieldName] = req.body.course[fieldName]
                        return obj;
                    }, {});
                    console.log('/course_update: newData', newData);
                    User.findOneAndUpdate(query, newData, {upsert: true, new: true}, function (err, doc) {
                        if (err) return res.send(500, {error: err});

                        if (!err) console.log("successfully updated new", doc.courses[req.body.courseId], "old", doc.courses[req.body.origId]);
                        else console.error(">>>>>>>>error..", err);

                        return res.send({courses: doc.courses});
                    });
                } else {
                    User.findOne(query,'courses', function(err, doc) {
                        return res.send({courses: doc.courses});
                    })
                }
            });
        } else if (req.body.courseId) {
            console.log(req.body.courseId, req.body.courseId? true:false);
            var keys = Object.keys(req.body.course);

            var newData = keys.reduce((obj, fieldName)=>{
                obj["courses."+req.body.courseId +"." + fieldName] = req.body.course[fieldName]
                return obj;
            }, {});
            console.log('/course_update: newData', newData);
            User.findOneAndUpdate(query, newData, {upsert: true, new:true}, function (err, doc) {
                if (err) return res.send(500, {error: err});

                if (!err) console.log("successfully updated new", doc.courses[req.body.courseId], "old", doc.courses[req.body.origId]);
                else console.error(">>>>>>>>error..", err);

                return res.send({courses: doc.courses});
            });
        }
    } catch (e) {
        console.error(e);
    }
})

router.post('/editaccount', (req, res) => {
    var query = {"info.email" : req.body.emailKey};
    var newData = req.body.data;
    User.findOneAndUpdate(query, { info : newData }, {}, function(err, doc) {
		if (err) return res.send(500, {error: err});
		console.log("successfully updated");
		return res.send("successfully saved");
	});
});

router.post('/editpassword', (req, res) => {
    var query = {"info.email" : req.body.email};
    var newPassword = req.body.newpassword;
    User.findOneAndUpdate(query, {"info.password": newPassword}, {}, function(err, doc) {
		if (err) return res.send(500, {error: err});
		console.log("Password successfully updated");
		return res.send("Password successfully saved");
	});
});

module.exports = router;
