const Temple = require('../models/temple');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');



//index page of temple
module.exports.index = async(req,res) =>{
    const temples = await Temple.find({});
    res.render('temple/index',{temples});
}

//new temple
module.exports.renderNewForm = (req,res)=>{
    res.render('temple/new')
}

module.exports.createTemple = async(req,res,next)=>{      //handling error
    // if(!req.body.campground) throw new ExpressError('Invalid campground',400);
       //flash msg

       const geoData = await geocoder.forwardGeocode({
           query : req.body.temple.location,
           limit : 1
       }).send()
      
      //res.send('ok')
   const temple = new Temple(req.body.temple);
    temple.images = req.files.map(f=>({url: f.path, filename: f.filename }));
    //req.files to access with the help of multer
    //path and filenames are cloudinary storage variable.url and filename are keys for images
    temple.geometry = geoData.body.features[0].geometry;
    temple.author = req.user._id;
    //console.log(req.user._id);
    //if we crerate a new campground that user details were saved as a author
    //which user create that campground he will be in-charge
         await temple.save();
         console.log(temple);
         req.flash('success','Successfully made a new campground') 
         //console.log(campground);
         res.redirect(`/temple/${temple._id}`)  
        
 }

 //show campground
 //16jun handling error added 'next' and CatchAsync 
//populate used to add other schema model values as a object to stored in 'author' and 'reviews'
 module.exports.showTemple = async(req,res,next) =>{
    const temple = await Temple.findById(req.params.id).populate({
        path:'reviews',
        populate : {
            path : 'author'  //reviews author getting used nested populate
        }
    }).populate('author');
    //console.log(campground);
    if(!temple){
        req.flash('error','Cannot find temple')
        return res.redirect('/temple');
    }
     res.render('temple/show',{temple});
    // res.render('campgrounds/show')
     
   /*   catch(err){
         next(new ExpressError('file new not found',402))
     } */
 }

 module.exports.renderEditForm = async(req,res)=>{
    const { id } = req.params;   
    const temple = await Temple.findById(id);
        if(!temple){
            req.flash('error','Cannot find/edit temple')
            return res.redirect('/temple');
        }
 //********************************************** */
    //this code to check un authorized user can't edit through entering edit in url/postman method
    //and also it goes to edit page once update button click it shows error
       //copied ;-) from put.//  const campground= await Campground.findById(id)
       /*  if(!campground.author.equals(req.user._id)){
            req.flash('error','You do not have permission to edit')
            return res.redirect(`/campground/${id}`)
           
        } */
//******************************************* */

    res.render('temple/edit',{temple});
    
}

//updating
module.exports.updateTemple = async(req,res)=>{
    const { id } = req.params;
   // console.log(req.body);
    //********************************************** */
    //this code to check un authorized user can't edit through entering edit in url/postman method
    //and also it goes to edit page once update button click it shows error
  /*   const campground= await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do not have permission to edit')
        return res.redirect(`/campground/${id}`)
        //here we want to return value otherwise its updated 
    } */
    //************************************************** */
    //if we use above code we change the campground name as camp
    //otherwisw its shows error like already had a name of campground
    const temple= await Temple.findByIdAndUpdate(id,{ ...req.body.temple});
    //the below line to add cloudinary using multer
    //we using to store array in variable and spread to store campground.images
    //bcoz array push by object .we want it in same array
    const imgs = req.files.map(f=>({url: f.path, filename: f.filename }));
    temple.images.push(...imgs);
    await temple.save();
    //to delete background of images stored in cloudinary and mongodb
    if(req.body.deleteImages){
        //below code to delete images from cloudinary
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        //below code used to delete images from mongoDB
       await temple.updateOne({$pull: {images:{filename: {$in: req.body.deleteImages}}}})
       console.log(temple)
    }

    req.flash('success','Successfully updated temple') 
    res.redirect(`/temple/${temple._id}`)
}
//deleteing
module.exports.deleteTemple = async(req,res)=> {
    const {id} = req.params; 
    const temple = await Temple.findByIdAndDelete(id);
    req.flash('success','temple deleted') 
    res.redirect('/temple');

}