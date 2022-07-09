var express = require('express');
var router = express.Router();
const { pgconn } = require('../db/config')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;

router.get('/', function(req, res) {
  // we first check if the 'contacts' table exists
  // pgconn.query("SELECT EXISTS (SELECT FROM pg_tables WHERE tablename = 'plants')", function(err,results) {
    pgconn.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE tabl_name = 'plants')", function(err,results) {
    if (err) {
      console.log(err);
      res.render('index', { error: 'Database connection failure! '+err.stack, plants: null, title: 'Plant List' });
    }

    // 'contacts' table does not exist. Show an empty table.
    else if(results.rows[0].exists == false) {
      res.render('index', { error: null, plants: null, title: 'Plant List' });
    }

    // 'contacts' table exists. Show the records.
    else {
      pgconn.query('SELECT * FROM plants', function(err,results) {
        if (err) {
          console.log(err);
          res.render('index', { error: 'Database connection failure! '+err.stack, plants: null, title: 'Plant List' });
        }
        else {
          let plants = results.rows;
          console.log(plants);
          res.render('index', { error: null, plants: plants, title: 'Plant List' });
        }
      })  
    }
  });
});

module.exports = router;