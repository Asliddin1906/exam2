import { errorHandling } from "../errorHandler/error.handling.js"
import { read, write } from "../utils/FS.js"
import { categoriesGet, categoryPost, productPost, productPut, subCategoryPost } from "../validate/validate.js"

const PRODUCTS = async(req,res,next) => {
const allCategories = await read('categories').catch(err => next(new errorHandling(err,400)))
const allSubCategories = await read('sub.categories').catch(err => next(new errorHandling(err,400)))
const allProducts = await read('products').catch(err => next(new errorHandling(err,400)))



  const item = allProducts.filter(e=> {
    e.productId = e.product_id
    e.subCategoryId = e.sub_category_id
    e.productName = e.product_name

    delete e.product_id
    delete e.sub_category_id;
    delete e.product_name;
    return e
  })

  res.send(item)

}


const PRODUCTSID =async (req,res,next) => {
  const { error , value } = categoriesGet.validate(req.params)

  const {id} =value
  if (error) {
    return next(new errorHandling(error.message, 400));
  }


  
  const allProducts = await read('products').catch(
    error => next(new errorHandling(error , 400))
    )
  
    const products = allProducts.find(e=> e.product_id == id)
  
  if(!products) {
    return next(new errorHandling("product not found"))
  }

  const item = [products].filter(e => {
    e.productId = e.product_id
    e.subCategoryId = e.sub_category_id
    e.productName = e.product_name

    delete e.product_id
    delete e.sub_category_id;
    delete e.product_name;
    return e

  })

  res.send(item)
}


const NEWPRODUCT = async (req,res,next) =>  {
  const {error ,value  } = productPost.validate(req.body)

  if(error) {
    return next(new errorHandling(error , 400))
  }

  const {product_name, sub_category_id, model, color,price} = value

  const allProducts = await read('products').catch(
    err => next(new errorHandling(error , 400))
  )


  allProducts.push({
    product_id: allProducts.at(-1)?.product_id +1 || 1  ,
    sub_category_id,
    product_name,
    model,
    color,
    price
    
  })

  const newProduct = await write('products', allProducts).catch(err => next(new errorHandling(err , 400)))

  if (newProduct) {
    return res.status(200).json({
      message: "product created"
    });
  }
}


const PRODUCTPUT =async (req,res,next) => {
  const {value , error } = categoriesGet.validate(req.params)
  const {value : values} = productPut.validate(req.body)
  if(error) {
    return next(new errorHandling(error, 401))
  }

  const {id } = value
  const {product_name} = values

  const allProducts = await read("products").catch(error =>
    next(new errorHandling(error, 400))
  );

  const foundProduct = allProducts.find(e => e.product_id == id);
  if (!foundProduct) {
    return next(new errorHandling("product not found", 400));
  }
  foundProduct.product_name = product_name || foundProduct.product_name;
  const newProduct = await write("products", allProducts).catch(
    (error) => next(new errorHandling(error, 400))
  );

  if (newProduct) {
    return res.status(200).json({
      message: 'edited',
    });
  }
}


const PRODUCTDELETE = async(req,res,next) => {
  const {value , error} = categoriesGet.validate(req.params)
  if(error) {
    return next(new errorHandling(error , 400))
  }
  const {id} = value
  
  const allProducts = await read("products").catch(error =>
    next(new errorHandling(error, 400))
  );
  
  const foundProduct = allProducts.findIndex(e => e.product_id == id);
  
  if (!foundProduct) {
    return next(new errorHandling("subCategory not found", 400));
  }
  
  allProducts.splice(foundProduct , 1)
  const newCategory = await write("products", allProducts).catch(
    (error) => next(new errorHandling(error, 400))
  );
  
  if (newCategory) {
    return res.status(200).json({
      message: 'deleted'
    });
  }
  }



export {
  PRODUCTS,
  PRODUCTSID,
  NEWPRODUCT,
  PRODUCTPUT,
  PRODUCTDELETE
}