var express = require('express');
var router = express.Router();
const { pgconn } = require('../db/config')


router.get('/', function(req, res) {
  // Check if 'plants' table exists
    
    pgconn.query("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'plants')", function(err,results) {
    if (err) {
      console.log(err);
      res.render('index', { error: 'Database connection failure! '+err.stack, plants: null, title: 'Plant List' });
    }

    // If 'plants' table does not exist, display empty table.
    else if(results.rows[0].exists == false) {
      res.render('index', { error: null, plants: null, title: 'Plant List' });
    }

    // If 'plants' table exists, display plant records.
    else {
      pgconn.query("SELECT * , to_char(datelastwatered, 'MM-DD-YYYY') as datelastwatered, to_char(datetowater, 'MM-DD-YYYY') as datetowater FROM plants", function(err,results) {
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


    /* Update table */
router.post('/update', function(req,res) {
  var newName = 'monstera';
  var id = '2';
  pgconn.query("UPDATE plants SET scientificname= $1::text WHERE id = $2::integer", [newName, id], function(err,results) {
    if (err) {
      console.log(err);
      res.render('index', { error: 'Update failure! '+err.stack, plants: null, title: 'Plant List' });
    }

    // redirect to the index page
    else {
      res.redirect('/');
    }
  });
});


router.post('/update', function(req, res) {
  const text = 'UPDATE users SET scientificname = '
})





module.exports = router;