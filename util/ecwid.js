import axios from 'axios';
import qs from 'qs';

const ECWID_TOKEN = 'secret_j4vvdgZCYtQD1dhYB1Jab5cJ7S7YJCVw';
const ECWID_STORE_ID = '16938865';
const URL = `https://app.ecwid.com/api/v3/${ECWID_STORE_ID}/`;

var METHOD = {
	GET: 'get',
	POST: 'post',
	PUT: 'put',
	DELETE: 'delete'
};

var PATH = {
	profile: 'profile',
	products: 'products',
	orders: 'orders',
	customers: 'customers',
	categories: 'categories',
	classes: 'classes',
	storage: 'storage'
};

const exec = async (path, method, data) => {
	let options = {
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Cache-Control': 'no-cache'
		},
		method: method
	};

	switch (method) {
		case METHOD.GET:
		case METHOD.DELETE:
			options.url = buildURL(path);
			if (data) {
				options.url += '&' + qs.stringify(data);
			}
			break;
		case METHOD.PUT:
		case METHOD.POST:
			options.url = buildURL(path);
			if (data) {
				options.data = JSON.stringify(data);
			}
			break;

		default:
			break;
	}

	let result = await axios(options);

	return result.data;
};

const buildURL = (path) => {
	return URL + path + (path.includes('?') ? '&' : '?') + qs.stringify({ token: ECWID_TOKEN });
};

const getClasses = () => {
	return exec(PATH.classes, METHOD.GET);
};

const getStoreProfile = () => {
	return exec(PATH.profile, METHOD.GET);
};

const searchProducts = (options) => {
	return exec(PATH.products, METHOD.GET, options);
};

const getProducts = (options) => {
	return exec(PATH.products, METHOD.GET, options);
};

const getProduct = (productId) => {
	return exec(PATH.products + '/' + productId, METHOD.GET);
};

const addProduct = (product) => {
	return exec(PATH.products, METHOD.POST, product);
};

const deleteProduct = (productId) => {
	return exec(PATH.products + '/' + productId, METHOD.DELETE);
};

const updateProduct = (productId, product) => {
	return exec(PATH.products + '/' + productId, METHOD.PUT, product);
};

const uploadProductImage = (productId, buffer) => {
	return axios.post({
		url: buildURL(PATH.products + '/' + productId + '/image'),
		headers: { 'content-type': 'image/jpeg' },
		data: buffer
	});
};

const uploadProductImageExternal = (productId, externalUrl) => {
	return exec(PATH.products + '/' + productId + '/image?externalUrl=' + encodeURIComponent(externalUrl), METHOD.POST);
};

const deleteProductImage = (productId) => {
	return exec(PATH.products + '/' + productId + '/image', METHOD.DELETE);
};

const uploadGalleryImage = (productId, buffer) => {
	return axios.post({
		url: buildURL(PATH.products + '/' + productId + '/gallery'),
		headers: { 'content-type': 'image/jpeg' },
		data: buffer
	});
};

const uploadGalleryImageExternal = (productId, externalUrl) => {
	return exec(
		PATH.products + '/' + productId + '/gallery?externalUrl=' + encodeURIComponent(externalUrl),
		METHOD.POST
	);
};

const cleanGallery = (productId) => {
	return exec(PATH.products + '/' + productId + '/gallery', METHOD.DELETE);
};

const addOrder = (data) => {
	return exec(PATH.orders, METHOD.POST, data);
};

const searchOrders = (options) => {
	return exec(PATH.orders, METHOD.GET, options);
};

const getOrderDetails = (orderNumber) => {
	return exec(PATH.orders + '/' + orderNumber, METHOD.GET);
};

const updateOrder = (orderNumber, data) => {
	return exec(PATH.orders + '/' + orderNumber, METHOD.PUT, data);
};

const deleteOrder = (orderNumber) => {
	return exec(PATH.orders + '/' + orderNumber, METHOD.DELETE);
};

const getCategories = (options) => {
	return exec(PATH.categories, METHOD.GET, options);
};

const addCategory = (category) => {
	return exec(PATH.categories, METHOD.POST, category);
};

const deleteCategory = (categoryId) => {
	return exec(PATH.categories + '/' + categoryId, METHOD.DELETE);
};

const updateCategory = (categoryId, data) => {
	return exec(PATH.categories + '/' + categoryId, METHOD.PUT, data);
};

const searchCustomers = (options) => {
	return exec(PATH.customers, METHOD.GET, options);
};

const getCustomer = (customerId) => {
	return exec(PATH.customers + '/' + customerId, METHOD.GET);
};

const createCustomer = (data) => {
	return exec(PATH.customers, METHOD.POST, data);
};

const updateCustomer = (customerId, data) => {
	return exec(PATH.customers + '/' + customerId, METHOD.PUT, data);
};

const deleteCustomer = (customerId) => {
	return exec(PATH.customers + '/' + customerId, METHOD.DELETE);
};

const getAllStorage = () => {
	return exec(PATH.storage, METHOD.GET);
};

const getStorage = (key) => {
	return exec(PATH.storage + '/' + key, METHOD.GET);
};

const addStorage = (key, data) => {
	return exec(PATH.storage + '/' + key, METHOD.POST, data);
};

const editStorage = (key, data) => {
	return exec(PATH.storage + '/' + key, METHOD.PUT, data);
};

const deleteStorage = (key) => {
	return exec(PATH.storage + '/' + key, METHOD.DELETE);
};

export default {
	getClasses,
	getStoreProfile,

	searchProducts,
	getProducts,
	getProduct,
	addProduct,
	deleteProduct,
	updateProduct,
	uploadProductImage,
	uploadProductImageExternal,
	deleteProductImage,
	uploadGalleryImage,
	uploadGalleryImageExternal,
	cleanGallery,

	getCategories,
	addCategory,
	deleteCategory,
	updateCategory,

	addOrder,
	searchOrders,
	getOrderDetails,
	updateOrder,
	deleteOrder,

	searchCustomers,
	getCustomer,
	createCustomer,
	updateCustomer,
	deleteCustomer,

	getAllStorage,
	getStorage,
	addStorage,
	editStorage,
	deleteStorage
};
