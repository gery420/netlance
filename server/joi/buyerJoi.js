const joi = require('joi');

joi.objectId = require('joi-objectid')(joi);

const {ClientError} = require('./../utils/Errors');

exports.RegisterBuyerJoi = async (body)=>{
    const schema = joi.object({
        username: joi.string().min(6).max(25).required(),
        password : joi.string().min(8).max(15).regex(/^[a-zA-Z]+[a-zA-Z\d]*[@$#]+[a-zA-Z@$#\d]*\d+$/).required(),
        email : joi.string().required(),
        phoneNumber: joi.string().length(10).pattern(/^[0-9]+$/).required(),
        country: joi.string().required(),
        
   });
   try{
     return await schema.validateAsync(body);
   }catch(err){
    console.log("register buyer joi : ",err);
    if(err.details[0].message.includes('email')){
      throw new ClientError("Invalid Email ID");
    }else if(err.details[0].message.includes('password')){
      throw new ClientError("Please enter the password as mentioned");
    } else if (err.details[0].message.includes('username' && 'fails')) {
      throw new ClientError("No special characters or only digits allowed");
    }
    else {
      throw new ClientError(err.details[0].message.replace(/"/g,""));
    }
   }
}
