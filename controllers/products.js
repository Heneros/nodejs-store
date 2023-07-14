const Product = require('../models/product');



const getAllProductsStatic = async (req, res) => {
    ///.sort('-name price')
    const products = await Product.find({}).select('name price')
    res.status(200).json({ products, countProducts: products.length })
}

const getAllProducts = async (req, res) => {
    const { featured, company, name, sort } = req.query;///деструктризация объекта req.query
    const queryObject = {}; ///Создает фильтр для  фильтраци запроса к базе данных.
    if (featured) {
        queryObject.featured = featured === 'true' ? true : false; ///преобразованиt строки 'true' в соответствующее булевое значение, чтобы оно соответствовало требуемому формату для фильтрации запроса.
    }
    if (company) {
        queryObject.company = company;
    }
    if (name) {
        queryObject.name = { $regex: name, $options: '1' };
    }

    console.log(queryObject);
    let result = Product.find(queryObject);
    if (sort) { ///если сортировка осуществилась
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('createdAt');
    }
    const products = await result;
    console.log(req.query); ///Вернет отсюда {{URL}}/products?featured=true  Все продукты с true значением {  featured: 'true' }
    res.status(200).json({ products, countProducts: products.length })
}

module.exports = { getAllProductsStatic, getAllProducts };
