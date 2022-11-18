import { read } from "../utils/FS.js"
import { errorHandling } from "../errorHandler/error.handling.js"
import sha256 from "sha256"
import jwt from "../utils/jwt.js"
import { admin } from "../validate/validate.js"

const LOGIN = async (req, res,next) =>{
  const { error , value } = admin.validate(req.body)
  const {username , password } = value
  
  if (error) {
    return next(new errorHandling(error.message, 400));
  }

  const admins = await read('admins').catch(error =>
  next(new errorHandling(error, 401))
);

// const admins = read('admins')


  const foundAdmin = admins.find(e => e.username == username && e.password == password)

  if(!foundAdmin){
    return next(new errorHandling('username already exist' , 402))
  }

  if(foundAdmin)(
    res.status(200).json({
      message:'Succes',
      access_token: jwt.sign({user_id:foundAdmin?.user_id})
    })
    )
}

export {
  LOGIN
}