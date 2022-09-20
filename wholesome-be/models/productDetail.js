const pool = require("../utils/database");

// 商品細節頁- 商品資訊
async function getSingleProduct(productId) {
  let [data] = await pool.execute(
    "SELECT * FROM products JOIN products_category on products.category_id = products_category.category_id WHERE id = ?",
    [productId]
  );
  // console.log("single product data", data);
  // console.log("data.main_category", data[0].main_category);
  if (data.length > 0) {
    return data;
  } else {
    console.log("no data");
    return null;
  }
}
//評論資訊
async function getProductComment(productId, perPage, offset) {
  let [data] = await pool.execute(
    "SELECT products_comment.id, products_comment.product_id, products_comment.comment, products_comment.grade, products_comment.user_id, products_comment.time , users.name FROM products_comment INNER JOIN users ON products_comment.user_id = users.id WHERE product_id = ? ORDER BY grade DESC LIMIT ? OFFSET ? ",[productId, perPage, offset]
  );
  return data;
}

async function getCommentCount(product_id) {
  let [total] = await pool.execute("SELECT COUNT(*) AS total FROM products_comment WHERE product_id = ? ",[product_id])
  return total[0].total
}

async function getRelatedGoods(categoryId, product_id) {
  let [goods] = await pool.execute('SELECT * FROM products WHERE category_id = ? AND id != ?',[categoryId, product_id])
  return goods; 
}

async function getLikeLIst(userId, productId){
  let [data] = await pool.execute('SELECT valid AS valid FROM user_like_product WHERE  user_id = ? AND  product_id = ?',[userId, productId])
  return data;
}

async function newLIke(userId, productId){
  let result = await pool.execute('INSERT INTO user_like_product (user_id, product_id, valid) VALUES( ?, ?, ? )',[userId, productId, 0])
}

async function updateLike(isLike, userId, productId){
  let result = await pool.execute('UPDATE `user_like_product` SET  valid = ?  WHERE user_id = ? AND product_id= ?',[isLike, userId, productId])
  return result
}

module.exports = { getSingleProduct, getProductComment, getCommentCount, getRelatedGoods, getLikeLIst, newLIke, updateLike };