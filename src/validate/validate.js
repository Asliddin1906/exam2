import Joi from "joi";

export const  admin = Joi.object().keys({
  username : Joi.string().required(),
  password : Joi.string().required().max(8)
})

export const categoriesGet =  Joi.object().keys({
  id: Joi.number().required()
})

export const categoryPost = Joi.object().keys({
  category_name : Joi.string().required().max(10)
})

export const subCategoryPost = Joi.object().keys({
  category_id: Joi.number().required().max(10),
  sub_category_name : Joi.string().required().max(10)
})

export const productPost = Joi.object().keys({
  sub_category_id :Joi.number().required().max(10),
    product_name :Joi.string().required(),
    model :Joi.string().required(),
    color :Joi.string().required(),
    price :Joi.string().required(),
})
export const productPut = Joi.object().keys({
  sub_category_id: Joi.number().required().max(10),
  product_name : Joi.string().required()
})

