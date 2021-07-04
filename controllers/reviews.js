const Temple = require('../models/temple'); 
const Review = require('../models/review'); 

//creating review
module.exports.createReview = async(req,res)=>{
    const temple = await Temple.findById(req.params.id);
    const review = await Review(req.body.review);
    review.author = req.user._id;
    temple.reviews.push(review);
    await review.save();
    await temple.save();
    req.flash('success','Created new review') 
    res.redirect(`/temple/${temple._id}`);
}

//deleting review 
module.exports.deleteReview = async(req,res)=>{
    const {id,reviewId} = req.params;
    await Temple.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Deleted a review') 
    res.redirect(`/temple/${id}`)
}