const Product = require('../models/product');



const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({
        page: '2'
    })
    res.status(200).json({ products, countProducts: products.length })
}

const getAllProducts = async (req, res) => {
    const { featured, company } = req.query;///деструктризация объекта req.query
    const queryObject = {}; ///Создает фильтр для  фильтраци запроса к базе данных.
    if (featured) {
        queryObject.featured = featured === 'true' ? true : false; ///преобразованиt строки 'true' в соответствующее булевое значение, чтобы оно соответствовало требуемому формату для фильтрации запроса.
    }
    if (company) {
        queryObject.company = company;
    }
    console.log(queryObject);
    const products = await Product.find(queryObject);
    console.log(req.query); ///Вернет отсюда {{URL}}/products?featured=true  Все продукты с true значением {  featured: 'true' }
    res.status(200).json({ products, countProducts: products.length })
}

module.exports = { getAllProductsStatic, getAllProducts };
