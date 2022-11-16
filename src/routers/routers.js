import { Router } from "express";
import { LOGIN } from "../controllers/login.controllers.js";
import {CATEGORYGETID , CATEGORIESGET, NEWCATEGORIESPOST , CATEGORIESPUT, CATEGORIESDELETE} from "../controllers/categories.controllers.js"
import { NEWSUBCATEGORY, SUBCATEGORIES , SUBCATEGORIESDELETE, SUBCATEGORIESID, SUBCATEGORIESPUT} from "../controllers/sub.categories.controllers.js";
import { NEWPRODUCT, PRODUCTDELETE, PRODUCTPUT, PRODUCTS, PRODUCTSID } from "../controllers/products.controllers.js";

const router = Router()

router.post('/login', LOGIN)

router.get('/categories' , CATEGORIESGET)
router.get('/categories/:id' , CATEGORYGETID)
router.post('/categories' , NEWCATEGORIESPOST)
router.put('/categories/:id' , CATEGORIESPUT)
router.delete('/categories/:id' , CATEGORIESDELETE)

router.get('/subcategories' ,SUBCATEGORIES )
router.get('/subcategories/:id', SUBCATEGORIESID)
router.post('/subcategories', NEWSUBCATEGORY)
router.put('/subcategories/:id' , SUBCATEGORIESPUT)
router.delete('/subcategories/:id' , SUBCATEGORIESDELETE)

router.get('/products' ,PRODUCTS )
router.get('/products/:id' , PRODUCTSID)
router.post('/products', NEWPRODUCT)
router.put('/products/:id' , PRODUCTPUT)
router.delete('/products/:id' , PRODUCTDELETE)






export default router