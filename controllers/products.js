const Product = require('../models/product');



const getAllProductsStatic = async (req, res) => {

    const products = await Product.find({ price: { $gt: 30 } }).sort('name')
        .select('name price')
    res.status(200).json({ products, countProducts: products.length })
}

const getAllProducts = async (req, res) => {
    ///fields поиск по конкретным значением в search
    const { featured, company, name, sort, fields, numFilters } = req.query;///деструктризация объекта req.query
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

    //
    if (numFilters) {
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eg',
            '<': '$lt',
            '<=': '$lte',
        }
        // выполняется поиск операторов в строке numFilters
        const regEx = /\b(<|>|>=|=|<|<=)\b/g;

        let filters = numFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`);

        const options = ['price', 'rating'];

        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) }
            }
        })
        // console.log(operatorMap);
    }

    // console.log(filters);
    let result = Product.find(queryObject);
    if (sort) { ///если сортировка осуществилась
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('createdAt');
    }
    if (fields) {
        const fieldsList = sort.split(',').join(' ');
        result = result.select(fieldsList);
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);


    const products = await result;
    console.log(req.query); ///Вернет отсюда {{URL}}/products?featured=true  Все продукты с true значением {  featured: 'true' }
    res.status(200).json({ products, countProducts: products.length })
}

module.exports = { getAllProductsStatic, getAllProducts };
