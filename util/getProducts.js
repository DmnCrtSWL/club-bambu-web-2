import ecwid from './ecwid';

const getProductsComplete = async () => {
	const datos = [];
	const productos = await ecwid.getProducts({ enabled: true });
	const productosParte1 = productos.items;
	productos = await ecwid.getProducts({ offset: 100, enabled: true });
	const productosParte2 = productos.items;
	productos = await ecwid.getProducts({ offset: 200, enabled: true });
	const productosParte3 = productos.items;
	let totalProductos = [];
	let auxProductos = [];
	if (productosParte1 && productosParte2 && productosParte3) {
		auxProductos = productosParte1.concat(productosParte2);
		totalProductos = auxProductos.concat(productosParte3);
	}
	datos = totalProductos;
	return datos;
};
export default { getProductsComplete };
