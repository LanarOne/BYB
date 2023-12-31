import { ProductDAO } from "../daos/productDao.js";
import Product from "../models/Product.js";

const createProduct = async (req, res) => {
  try {
    const name = req.body.name;
    const type = req.body.type;
    const assistance = req.body.assistance;
    const price = req.body.price;
    const alt = req.body.alt;
    const description = req.body.description;
    const flying = req.body.flying;
    const cockpit = req.body.cockpit;
    const weapons = req.body.weapons;
    const ammo = req.body.ammo;
    const magazine = req.body.magazine;
    const range = req.body.range;
    const typeId = req.body.typeId;
    const image = req.file;
    const existingProduct = await Product.findOne({ where: { name } });
    if (existingProduct) {
      return res
        .status(409)
        .json({ message: `an item with the name ${name} already exists` });
    }
    if (!name || !type || !price || !alt || !description) {
      return res.status(400).json({
        message: `the fields name, type, assistance, price and img are mandatory`,
      });
    }
    const product = await ProductDAO.Create(
      name,
      type,
      assistance,
      price,
      image.path,
      alt,
      description,
      flying,
      cockpit,
      weapons,
      ammo,
      magazine,
      range,
      typeId
    );
    return res.status(201).json({
      message: `new product ${product.name} successfully created`,
      data: product,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: `internal error`, data: err });
  }
};
const readAll = async (req, res) => {
  const products = await ProductDAO.ReadAllProducts();
  if (!products) {
    return res.status(404).json({ message: `could not find product list` });
  }
  return res
    .status(200)
    .json({ message: `products list successfully retrieved`, data: products });
};

const readOneById = async (req, res) => {
  const productId = req.params.id;
  const product = await ProductDAO.ReadOneById(productId);
  if (!product) {
    return res.status(404).json({ message: `could not find product` });
  }
  return res.status(200).json({
    message: `product ${product.name} retrived successfully`,
    data: product,
  });
};

const updateOne = async (req, res) => {
  const productId = req.params.id;
  const {
    name,
    type,
    assistance,
    price,
    img,
    alt,
    description,
    flying,
    cockpit,
    weapons,
    ammo,
    magazine,
    range,
    typeId,
  } = req.body;
  if (!name || !type || !price || !img || !alt || !description) {
    return res
      .status(400)
      .json({ message: `all fields are mandatory to update product` });
  }
  const data = {
    name,
    type,
    assistance,
    price,
    img,
    alt,
    description,
    flying,
    cockpit,
    weapons,
    ammo,
    magazine,
    range,
    typeId,
  };
  const product = await ProductDAO.UpdateOne(productId, data);
  if (!product) {
    return res.status(404).json({ message: `could not find product` });
  }
  return res.status(200).json({
    message: `product ${product.name} successfully updated`,
    data: product,
  });
};

const deleteOne = async (req, res) => {
  const productId = req.params.id;
  const product = await ProductDAO.DeleteOne(productId);
  if (!product) {
    return res.status(404).json({ message: `could not find product` });
  }
  return res.status(200).json({ message: `product successfully deleted` });
};

export const ProductController = {
  createProduct,
  readAll,
  readOneById,
  updateOne,
  deleteOne,
};
