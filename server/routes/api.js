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

router.post('/courses', (req, res) => {

    var query = {"info.email" : req.body.email};
    var newData = {};
    newData["courses." + req.body.id] = {
            "id": req.body.id,
            "isGradApproved": 0,
            "creditFor": "",
            "section": "",
            "credit": null,
            "grade": null,
            "year": "",
            "term": null,
            "remarks": ""
    };

    console.log("new data", newData);

    User.findOneAndUpdate(query, newData, {upsert:true}, function(err, doc){
        if (err) return res.send(500, { error: err });
        console.log("successfully updated");
        return res.send("successfully saved");
    });
});

router.post('/editaccount', (req, res) => {
	//console.log("Request");
	//console.log(req.body);
	//console.log(req.body.info);
    var query = {"info.email" : req.body.info.email};   
    var newData = {};
    //console.log("New Data");
   // console.log(req.body.info);
    newData = req.body.info; 
    //console.log("Query");
    //subDoc.set (req.body.info);
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
