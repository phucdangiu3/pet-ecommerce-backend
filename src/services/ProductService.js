const Product = require("../models/ProductModel");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const {
      name,
      image,
      hoverImage,
      images,
      type,
      manufacturer,
      color,
      tag,
      countInStock,
      price,
      rating,
      description,
      discount,
      selled,
    } = newProduct;
    try {
      const createdProduct = await Product.create({
        name,
        image,
        hoverImage,
        images,
        type,
        manufacturer,
        color,
        tag,
        countInStock,
        price,
        rating,
        description,
        discount,
        selled,
      });

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: createdProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({ _id: id });

      if (checkProduct === null) {
        resolve({
          status: "OK",
          message: "The product is not defined",
        });
        return;
      }
      if (data.images && Array.isArray(data.images)) {
        data.images = data.images; // Cập nhật danh sách ảnh
      }

      const updateProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updateProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({ _id: id });

      if (product === null) {
        resolve({
          status: "OK",
          message: "The product is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "Success",
        data: product,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({ _id: id });

      if (checkProduct === null) {
        resolve({
          status: "OK",
          message: "The product is not defined",
        });
      }
      await Product.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "Delete product success",
      });
    } catch (e) {
      reject(e);
    }
  });
};
const deleteManyProduct = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Product.deleteMany({ _id: ids });

      resolve({
        status: "OK",
        message: "Delete product success",
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getAllProduct = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments();

      // Parse filter nếu là string JSON
      let filterParsed = null;
      if (filter) {
        try {
          filterParsed =
            typeof filter === "string" ? JSON.parse(filter) : filter;
        } catch {
          filterParsed = null;
        }
      }

      // Nếu có filter hợp lệ (mảng 2 phần tử: [field, value])
      if (
        filterParsed &&
        Array.isArray(filterParsed) &&
        filterParsed.length === 2
      ) {
        const [field, value] = filterParsed;
        let condition = {};

        // Với các trường dạng string, dùng $regex để tìm gần đúng (không phân biệt hoa thường)
        // Với 2 trường color, tag là chuỗi đơn => tìm bằng giá trị chính xác
        if (field === "color" || field === "tag") {
          condition[field] = value;
        } else {
          condition[field] = { $regex: value, $options: "i" };
        }

        const filteredProducts = await Product.find(condition)
          .limit(limit)
          .skip(page * limit);

        return resolve({
          status: "OK",
          message: "Success",
          data: filteredProducts,
          total: filteredProducts.length,
          pageCurrent: Number(page) + 1,
          totalPage: Math.ceil(filteredProducts.length / limit),
        });
      }

      // Xử lý sort nếu có
      if (sort) {
        // sort là mảng [1|-1, field] hoặc string
        let objectSort = {};
        if (Array.isArray(sort) && sort.length === 2) {
          objectSort[sort[1]] = Number(sort[0]);
        } else if (typeof sort === "string") {
          // Ví dụ sort = "price:1" hoặc "rating:-1"
          const [field, direction] = sort.split(":");
          objectSort[field] = Number(direction);
        }

        const sortedProducts = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort);

        return resolve({
          status: "OK",
          message: "Success",
          data: sortedProducts,
          total: totalProduct,
          pageCurrent: Number(page) + 1,
          totalPage: Math.ceil(totalProduct / limit),
        });
      }

      // Trả về tất cả sản phẩm nếu không filter hoặc sort
      let products = [];
      if (!limit) {
        products = await Product.find();
      } else {
        products = await Product.find()
          .limit(limit)
          .skip(page * limit);
      }

      resolve({
        status: "OK",
        message: "Success",
        data: products,
        total: totalProduct,
        pageCurrent: Number(page) + 1,
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allType = await Product.distinct("type");

      resolve({
        status: "OK",
        message: "Success",
        data: allType,
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  deleteManyProduct,
  getAllType,
};
