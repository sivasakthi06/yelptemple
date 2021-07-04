const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Temple = require('../models/temple'); 
const temples = require('../controllers/temples');
//multer multipart/farm-data moongoose middleware to access bulk data
const multer = require('multer');
const { storage } = require('../cloudinary');
//to access cloudinary file storage and we not worry to represent the index.js file
//node is automatically get index files
const upload = multer({ storage });
//const upload = multer({ dest : 'uploads/'}) //its used to store the file in given location

const { isLoggedIn,isAuthor,validateTemple } = require('../middleware');// middleware



router.route('/')
    .get(catchAsync(temples.index))
    .post(isLoggedIn,upload.array('image'),validateTemple, catchAsync(temples.createTemple))
  //here upload multer middlewarre run 1st bcoz adding data to req.body,validatecampground were depends on req.body
  
    /*  .post(upload.array('image'), (req,res)=>{
       //single to array =>multiple files upload
       //if we use multiple files to add we use plural form to mention "file" to "files"
    console.log(req.body,req.files);
    res.send('its worked')
   }) */

//add a new item (post method form)
router.get('/new',isLoggedIn,temples.renderNewForm);
    

router.route('/:id')
//each shows seperately
.get(catchAsync(temples.showTemple))
//edit put
.put(isLoggedIn,isAuthor,upload.array('image'),validateTemple, catchAsync(temples.updateTemple))
//delete
.delete(isLoggedIn,isAuthor,catchAsync(temples.deleteTemple))

//edit
router.get('/:id/edit', isLoggedIn,isAuthor,catchAsync(temples.renderEditForm))



module.exports = router;

