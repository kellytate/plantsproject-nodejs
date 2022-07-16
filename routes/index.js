const express = require('express');
const router = express.Router();
const { pgconn } = require('../db/config');


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
      pgconn.query("SELECT * , to_char(datelastwatered, 'MM-DD-YYYY') as datelastwatered, to_char(datetowater, 'MM-DD-YYYY') as datetowater FROM plants ORDER BY id", function(err,results) {
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


/* Update table WORKS!!! */
router.post('/update', function(req,res) {
  // let exists = false;
  const commonname = (req.body.commonname).trim();
  const scientificname = (req.body.scientificname).trim();
  const nickname = (req.body.nickname).trim();
  const datelastwatered = (req.body.datelastwatered);
  const datetowater = (req.body.datetowater);

  let text = "SELECT EXISTS (SELECT FROM plants WHERE nickname = $1::text)"
  let values = [nickname]
  pgconn.query(text, values, function(err,results) {
    if (err) {
      console.log(err);
      res.render('index', { error: 'Database connection failure! '+err.stack, plants: null, title: 'Plant List' });
    }

    // If nickname does not exist in plants, create new plant.
    else if(results.rows[0].exists == false) {
      text = "INSERT INTO plants (nickname, commonname, scientificname, dateLastWatered, dateToWater) VALUES($1::text, $2::text, $3::text, $4::date, $5::date)"
      values = [nickname, commonname, scientificname, datelastwatered, datetowater]
    }

    else {
      text = "UPDATE plants SET commonname = $1::text, scientificname = $2::text, datelastwatered = $3::date, datetowater = $4::date WHERE nickname = $5::text"
      values = [commonname, scientificname, datelastwatered, datetowater, nickname]
    }

      pgconn.query(text, values, function(err,results) {
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
  });
  
module.exports = router;