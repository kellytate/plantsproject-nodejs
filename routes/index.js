const express = require('express');
const router = express.Router();
const { pgconn } = require('../db/config');

let text = '';
let values = [];
let commonname;
let scientificname;
let nickname;
let datelastwatered;
let datetowater;
let id;

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


/* Update table */
router.post('/update', function(req,res) {
  nickname = (req.body.nickname).trim();
  commonname = (req.body.commonname).trim();
  scientificname = (req.body.scientificname).trim();
  datelastwatered = (req.body.datelastwatered);
  datetowater = (req.body.datetowater);

  text = "SELECT EXISTS (SELECT FROM plants WHERE nickname = $1::text)"
  values = [nickname.toLowerCase()];
  pgconn.query(text, values, function(err,results) {
    if (err) {
      console.log(err);
      res.render('index', { error: 'Database connection failure! '+err.stack, plants: null, title: 'Plant List' });
    }

    // If nickname does not exist in plants, create new plant.
    else if(results.rows[0].exists == false) {
      task = 'create';
      queryBuilder(req, task);
      // values = [nickname, commonname, scientificname, datelastwatered, datetowater]
      // text = "INSERT INTO plants (nickname, commonname, scientificname, dateLastWatered, dateToWater) VALUES($1, $2, $3, $4, $5)"
    }

    else {
      task = 'update';
      queryBuilder(req, task);

      // values = [commonname, scientificname, datelastwatered, datetowater, nickname]
      // text = "UPDATE plants SET commonname = $1::text, scientificname = $2::text, datelastwatered = $3::date, datetowater = $4::date WHERE nickname = $5::text"
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

router.post('/delete', function(req,res) {    
  id = (req.body.id);
  
  text = 'DELETE FROM plants WHERE id = $1'
  values = [id];

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

router.post('/reset', function(req,res) {
  
  text = 'DELETE FROM plants';

  pgconn.query(text, function(err,results) {
    if (err) {
      console.log(err);
      res.render('index', { error: 'Update failure! '+err.stack, plants: null, title: 'Plant List' });
    }
    else {
      // Reset serial id.
      text = "SELECT setval(pg_get_serial_sequence('plants', 'id'), COALESCE(max(id) + 1, 1), false)FROM plants";
      pgconn.query(text, function(err,results) {
        if (err) {
          console.log(err);
          res.render('index', { error: 'Update failure! '+err.stack, plants: null, title: 'Plant List' });
        }
        // redirect to the index page
        else {
          res.redirect('/');
        }
      });
    }
  });
});




function queryBuilder(req, task) {
  commonname = (req.body.commonname).trim();
  scientificname = (req.body.scientificname).trim();
  nickname = (req.body.nickname).trim();
  datelastwatered = (req.body.datelastwatered);
  datetowater = (req.body.datetowater);
  id = (req.body.id);
  
  const nickname_field = 'nickname';
  const commonname_field = 'commonname';
  const scientificname_field = 'scientificname';
  const datelastwatered_field = 'datelastwatered';
  const datetowater_field = 'datetowater';

  let items = [];
  let fields = [nickname_field, commonname_field, scientificname_field, datelastwatered_field, datetowater_field];
  values = [];
  text = '';

  items.push(nickname, commonname, scientificname, datelastwatered, datetowater);

  // Check for non-empty input. Push items with input to values array.
  for (let i = 0; i < items.length; i++) {
    if (items[i].length > 0 && items[i].length <= 30)
      values.push(items[i]);
  }

  let str = '';
  let str2 = '';

  // Create new plant.
  if(task === 'create') {
    
    // Build string of field names to insert into query
    for(let i = 0; i < items.length; i++) {
      if (values.includes(items[i])) {
        str += fields[i] + ',';
      }
    }
    str = str.slice(0, -1);

    // Build string of placeholders for query.
    for (let i = 0; i < values.length; i++) {
      str2 += '$' + (i + 1) + ',';
    }
    str2 = str2.slice(0, -1);

    // Build text for query
    text = 'INSERT INTO plants (' + str + ') VALUES (' + str2 + ')';
  }
  else if (task === 'update') {

    // Build string of field names to insert into query
    let count = 0;
    for(let i = 1; i < items.length; i++) {
      if (values.includes(items[i])) {
        count += 1;
        str += fields[i] + '= $' + count + ',';
      }
    }
    str = str.slice(0, -1);
    str2 = fields[0] + '= $' + values.length;

    values.push(values[0]);
    values.shift(values[0]);
    text = 'UPDATE plants SET ' + str + ' WHERE ' + str2;
  }

}

module.exports = router;