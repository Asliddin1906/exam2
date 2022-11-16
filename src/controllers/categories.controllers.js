import { errorHandling } from "../errorHandler/error.handling.js"
import { read, write } from "../utils/FS.js"
import { categoriesGet, categoryPost } from "../validate/validate.js"


const CATEGORYGETID = async (req,res,next) => {
  const { error , value } = categoriesGet.validate(req.params)

  const {id} =value
  if (error) {
    return next(new errorHandling(error.message, 400));
  }

  const allCategories = await read('categories').catch(
    error => next(new errorHandling(error , 400))
  )
  
  const allSubCate = await read('sub.categories').catch(
    error => next(new errorHandling(error , 400))
    )
  
    const categories = allCategories.find(e=> e.category_id == id)
  
  if(!categories) {
    return next(new errorHandling("category not found"))
  }

  const item = [categories].map(e => {
    e.categoryId = e.category_id
    e.categoryName = e.category_name
    e.sub_categories = e.sub_categories
    e.sub_categories = []
    delete e.category_id;
    delete e.category_name;
    allSubCate.filter(evt => {
      evt.subCategoryId = evt.sub_category_id;
      evt.subCateName = evt.sub_category_name;
      delete evt.sub_category_id;
      delete evt.sub_category_name;
      if (evt.category_id == e.categoryId && delete evt.category_id) {
        e.sub_categories.push(evt);
      }
    });
    return e

  })

  res.send(item)
  }



  const CATEGORIESGET = async (req,res,next) => {
    const allCategories = await read('categories').catch(err => next(new errorHandling(err,400)))
    const allSubCategory = await read('sub.categories').catch(err => next(new errorHandling(err,400)))

    const item = allCategories.map(e =>{
      e.categoryId = e.category_id
      e.categoryName = e.category_name
      e.allSubCategory = e.allSubCategory 
      e.allSubCategory = []
      delete e.category_id;
    delete e.category_name;

    allSubCategory.map(evt => {
      if(evt.category_id == e.categoryId && delete evt.category_id){
        evt.subCategoryId = evt.sub_category_id;
        evt.subCategoryName = evt.sub_category_name;
        delete evt.sub_category_id;
        delete evt.sub_category_name;
        e.allSubCategory.push(evt);
      }
    })
    return e;

    })

    const { categoryId, categoryName } = req.query;
  
    const itemFilter = item.filter((e) => {
      const categoryid = categoryId ? e.categoryId == categoryId : true;
      const categoryname = categoryName
      ? e.categoryName.toLowerCase().includes(categoryName.toLowerCase())
      : true;
      
      return categoryid && categoryname;
    });
  
    res.send(itemFilter);
  }



const NEWCATEGORIESPOST = async (req,res,next) =>  {
  const {error ,value  } = categoryPost.validate(req.body)

  if(error) {
    return next(new errorHandling(error , 400))
  }

  const {category_name} = value

  const allCategories = await read('categories').catch(
    err => next(new errorHandling(error , 400))
  )


  allCategories.push({
    category_id: allCategories.at(-1)?.category_id +1 || 1  ,
    category_name
  })

  const newCategory = await write('categories', allCategories).catch(err => next(new errorHandling(err , 400)))

  if (newCategory) {
    return res.status(200).json({
      message: "category created"
    });
  }
}


const CATEGORIESPUT =async (req,res,next) => {
  const {value , error } = categoriesGet.validate(req.params)
  const {value : values} = categoryPost.validate(req.body)
  if(error) {
    return next(new errorHandling(error, 401))
  }

  const {id } = value
  const {category_name} = values

  const allCategories = await read("categories").catch(error =>
    next(new errorHandling(error, 400))
  );

  const foundCategory = allCategories.find(e => e.category_id == id);
  if (!foundCategory) {
    return next(new errorHandling("category not found", 400));
  }
  foundCategory.category_name = category_name || foundCategory.category_name;
  const newCategory = await write("categories", allCategories).catch(
    (error) => next(new errorHandling(error, 400))
  );

  if (newCategory) {
    return res.status(200).json({
      message: 'edited',
    });
  }
}


const CATEGORIESDELETE = async(req,res,next) => {
const {value , error} = categoriesGet.validate(req.params)
if(error) {
  return next(new errorHandling(error , 400))
}
const {id} = value

const allCategories = await read("categories").catch(error =>
  next(new errorHandling(error, 400))
);

const foundCategory = allCategories.findIndex(e => e.category_id == id);

if (!foundCategory) {
  return next(new errorHandling("category not found", 400));
}

allCategories.splice(foundCategory , 1)
const newCategory = await write("categories", allCategories).catch(
  (error) => next(new errorHandling(error, 400))
);

if (newCategory) {
  return res.status(200).json({
    message: 'deleted'
  });
}
}




  export {
    CATEGORIESGET,
    CATEGORYGETID,
    NEWCATEGORIESPOST,
    CATEGORIESPUT,
    CATEGORIESDELETE
  }