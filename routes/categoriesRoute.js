const express = require('express');
const Category = require('../models/category');
const router = express.Router();
const passport = require('passport');

router.use(('/', passport.authenticate('jwt', { session: false, failWithError: true })));
//get list of categories
router.get('/', (req, res, next) => {
  return Category.find()
    .then(result => {
      console.log(result);
      if(result){
        res.json(result);
      }else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});
//get one category
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  return Category.findById(id)
    .then(result => {
      console.log(result);
      if(result){
        res.json(result);
      }else{
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});
module.exports = router;