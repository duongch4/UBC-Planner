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
        print(e);
    }




})

module.exports = router;
