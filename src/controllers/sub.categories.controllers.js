import { errorHandling } from "../errorHandler/error.handling.js"
import { read, write } from "../utils/FS.js"
import { categoriesGet, categoryPost, subCategoryPost } from "../validate/validate.js"

const SUBCATEGORIES = async(req,res,next) => {
  const allSubCategories = await read('sub.categories'). catch(err => next(new errorHandling(err,400)))

  const allProducts = await read('products').catch(err => next(new errorHandling(err,400)))

  const item = allSubCategories.filter(e=> {
    e.subCategoryId = e.sub_category_id
    e.subCategoryName = e.sub_category_name
    e.products= e.products
    e.products = []
    delete e.category_id
    delete e.sub_category_id;
    delete e.sub_category_name;
    
    allProducts.filter(evt => {
      if(evt.sub_category_id ==e.subCategoryId  && delete evt.product_id ){
        evt.productId = evt.product_id
        evt.productName = evt.product_name
        delete evt.product_name
        delete evt.product_id
        delete evt.sub_category_id
        
        e.products.push(evt)
      }
    })
    return e
  })
  const { subCategoryId, subCategoryName } = req.query;
  const itemFilter = item.filter((e) => {
    const categoryid = subCategoryId ? e.subCategoryId == subCategoryId : true;
    const categoryname = subCategoryName
      ? e.subCategoryName.toLowerCase().includes(subCategoryName.toLowerCase())
      : true;

    return categoryid && categoryname;
  });

  res.send(itemFilter);
}


const SUBCATEGORIESID =async (req,res,next) => {
  const { error , value } = categoriesGet.validate(req.params)

  const {id} =value
  if (error) {
    return next(new errorHandling(error.message, 400));
  }

  const allSubCategories = await read('sub.categories').catch(
    error => next(new errorHandling(error , 400))
  )
  
  const allProducts = await read('products').catch(
    error => next(new errorHandling(error , 400))
    )
  
    const subcategories = allSubCategories.find(e=> e.sub_category_id == id)
  
  if(!subcategories) {
    return next(new errorHandling("category not found"))
  }

  const item = [subcategories].filter(e => {
    e.subCategoryId = e.sub_category_id
    e.subCategoryName = e.sub_category_name
    e.products = e.products
    e.products = []
    delete e.sub_category_id;
    delete e.sub_category_name;
    allProducts.filter(evt => {
      evt.productsId = evt.product_id;
      evt.productsName = evt.product_name;
      delete evt.products_id;
      delete evt.product_id;
      if (evt.products_id == e.productsId ) {
        e.products.push(evt);
      }
    });
    return e

  })

  res.send(item)
}


const NEWSUBCATEGORY = async (req,res,next) =>  {
  const {error ,value  } = subCategoryPost.validate(req.body)

  if(error) {
    return next(new errorHandling(error , 400))
  }

  const {sub_category_name, category_id} = value

  const allSubCategories = await read('sub.categories').catch(
    err => next(new errorHandling(error , 400))
  )


  allSubCategories.push({
    sub_category_id: allSubCategories.at(-1)?.sub_category_id +1 || 1  ,
    category_id,
    sub_category_name
  })

  const newSubCategory = await write('sub.categories', allSubCategories).catch(err => next(new errorHandling(err , 400)))

  if (newSubCategory) {
    return res.status(200).json({
      message: "sub-category created"
    });
  }
}


const SUBCATEGORIESPUT =async (req,res,next) => {
  const {value , error } = categoriesGet.validate(req.params)
  const {value : values} = subCategoryPost.validate(req.body)
  if(error) {
    return next(new errorHandling(error, 401))
  }

  const {id } = value
  const {sub_category_name} = values

  const allSubCategories = await read("sub.categories").catch(error =>
    next(new errorHandling(error, 400))
  );

  const foundSubCategory = allSubCategories.find(e => e.sub_category_id == id);
  if (!foundSubCategory) {
    return next(new errorHandling("subCategory not found", 400));
  }
  foundSubCategory.sub_category_name = sub_category_name || foundSubCategory.sub_category_name;
  const newCategory = await write("sub.categories", allSubCategories).catch(
    (error) => next(new errorHandling(error, 400))
  );

  if (newCategory) {
    return res.status(200).json({
      message: 'edited',
    });
  }
}


const SUBCATEGORIESDELETE = async(req,res,next) => {
  const {value , error} = categoriesGet.validate(req.params)
  if(error) {
    return next(new errorHandling(error , 400))
  }
  const {id} = value
  
  const allSubCategories = await read("sub.categories").catch(error =>
    next(new errorHandling(error, 400))
  );
  
  const foundSubCategory = allSubCategories.findIndex(e => e.sub_category_id == id);
  
  if (!foundSubCategory) {
    return next(new errorHandling("subCategory not found", 400));
  }
  
  allSubCategories.splice(foundSubCategory , 1)
  const newCategory = await write("sub.categories", allSubCategories).catch(
    (error) => next(new errorHandling(error, 400))
  );
  
  if (newCategory) {
    return res.status(200).json({
      message: 'deleted'
    });
  }
  }



export {
  SUBCATEGORIES,
  SUBCATEGORIESID,
  NEWSUBCATEGORY,
  SUBCATEGORIESPUT,
  SUBCATEGORIESDELETE
}