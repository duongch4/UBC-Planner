
#PLEASE READ!!!!!

For this assignment, much work was done creating a Mongoose schema that fit the draft JSON we had designed. This included nesting schemas, single nested subodcuments, etc. We also tried to find ways to load default values (a bit tricker with nested schemas and subdocuments) so that the LocalPassportStrategy would be minimized. We still need to test if this works for courses and coop which are arrays of other objects.

We also starte drafting some the Mongoose actions:

 // Forgot password
  return User.findOne({ email: userData.email }, (err, user) => {
    if (err) { return done(err); }
	
    if (!user) {
      const error = new Error('No such user account exists');
      error.name = 'InexistentUseError';

      return done(error);
    }
    req.user = user; // Set flag to reset password TODO
    console.log("Check your email for a link to reset your password")
    return done(null, user);
    });


//User updates bridging module from dashboard
User.findOne({ email: searchEmail}, function(err, user) {
	if (err) {return done(err);}
	user.set({bm: 'new bridgingModule'});
	user.save(function (err, user);
	res.send(user);
})

//Return an array of courses taken by student w/ <Searchterm> Bridging Module (query, projection)

var searchTerm //get from user input
var findBMCourses = Users.find({'bm' : 'searchTerm'}, 'bm1 bm2 bm3 bm4').lean(), exec(function(err, data){
	if (err) console.log("Error")
	return data //.lean() formats it as an array
});





Note that the requirement that email be unique is temporarily removed from the schema as it started causing weird bugs this evening (may have to do with URI string).


# UBC-Planner
UBC course recommendation, planner, graduation check

## Project Proposal

### Target Users
BCS students

### Goals
Based on bridging modules & courses students have taken so far, recommend future courses and add course reviews.

### Type of data stored
1. Student Information
    * Previous degree
    * Bridging module
    * Courses taken so far
    * Graduation checklist (student specific)
    * Planned course schedule
2. Course Information
    * All courses and their information offered by UBC
      * Course code and name
      * Prerequisites
      * Course descriptions
      * Course credits
      * Course restrictions
    * Course schedule for current and next semester
    * BCS graduation checklist (for all students)
### Activities
  1. Store user information (Sign up)
  2. Recommend courses
  3. Planner for the entire program (Graduation checklist)
  4. Web crawl UBC Timetable
  5. Notify if courses are offered as planned
  6. Add course reviews and recommend for bridging modules
  
  ### Ways to expand project
  1. Link to RateMyProf
  2. Expand beyond BCS students
  3. Program advisor/director (i.e. administrator) login
