const getAllProductsStatic = async (req, res) => {
    // throw new Error('testing error');
    res.status(200).json({ msg: 'products testing route static' })
}

const getAllProducts = async (req, res) => {
    res.status(200).json({ msg: 'products route' })
}

module.exports = { getAllProductsStatic, getAllProducts };