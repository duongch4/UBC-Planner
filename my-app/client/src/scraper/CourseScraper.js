var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var Promise = require('promise');

app.get('/scrape', function(req, res){

  // scrape UBC courses
  url = 'https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=0';

  // scrape subject names
  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html);
      var jsonArray = [];
      $("#mainTable tbody tr").each(function(){
        var subjectUrl, subject, description, credits, prereqs, term;
        subjectUrl = "https://courses.students.ubc.ca" + $(this).find("td a").attr("href");
        subject = $(this).find(":nth-child(2)").text().trim();

        // scrape course codes and titles
        request(subjectUrl, function(error, response, html){
          if(!error){
            var $ = cheerio.load(html);
            $("#mainTable tbody tr").each(function(){
              code = $(this).find("td a").text();
              title = $(this).find(":nth-child(2)").text();
              courseUrl = "https://courses.students.ubc.ca" + $(this).find("td a").attr("href");

              var json = { subject: "", code: "", title: "", url: ""};

          /*    request(courseUrl, function(error, response, html){
                if(!error){
                  var $ = cheerio.load(html);
                  var json = { subject: "", code: "", title: "", description : "", term : "", credits : "", prereqs: ""};
                  $(".content.expand").filter(function(){
                    var data = $(this);
                    description = data.find(":nth-child(4)").text().trim();
                    credits = data.find("p:nth-of-type(2)").text().trim();
                    prereqs = data.find("p:nth-of-type(3)").text();

                    json.credits = credits;
                    json.prereqs = prereqs;
                    json.description = description;*/
                    json.subject = subject;
                    json.code = code;
                    json.title = title;
                    json.url = courseUrl;
        /*          })
                    term = $("tbody tr").find("td:nth-child(4)").text();
                    json.term = term;
                    console.log(JSON.stringify(json)); */
                    jsonArray.push(json);
        //        }
        //      })
            })
          }
          fs.writeFile('output.json', JSON.stringify(jsonArray, null, 4), function(err){
          })
        })
      })
      res.send('Check your console!')
    }
  })
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
