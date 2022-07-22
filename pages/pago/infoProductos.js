import { connect } from "react-redux";
import Layout from "../../components/layout/Layout";
import Link from "next/link";
import {
  clearCart,
  closeCart,
  decreaseQuantity,
  deleteFromCart,
  increaseQuantity,
  openCart,
} from "../../redux/action/cart";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ecwid from "../../util/ecwid";
import BeatLoader from "react-spinners/BeatLoader";

const infoProductos = () => {
  const router = useRouter();
  const {
    methodPayCash,
    methodPayCard,
    name,
    email,
    phone,
    coupon,
    date,
    hour,
    adress,
    comments,
    orderId,
  } = router.query;
  const [total, setTotal] = useState(0);
  const [order, setOrder] = useState({});
  const [productos, setproductos] = useState([]);

  const horaOrden = new Date(order.pickupTime);
  const hora = horaOrden.getUTCHours();
  const minutos = horaOrden.getMinutes();

  const fechaOrden = new Date(order.pickupTime);
  const dia = fechaOrden.getUTCDate();
  const mes = fechaOrden.getMonth() + 1;
  const año = fechaOrden.getFullYear();
  const cartItems = 0;

  /*const price = () => {
    let price = 0;
    cartItems.forEach((item) => (price += item.price * item.quantity));
    return price;
  };*/

  useEffect(() => {
    (async () => {
      const resp = await ecwid.getOrderDetails(orderId);
      setOrder(resp);
      setproductos(resp.items);
    })();
  }, [orderId]);

  return (
    <>
      <Layout parent="Inicio" sub="Mis pedidos" subChild="Detalles">
        {order ? (
          <section className="mt-50 mb-50">
            <div className="container">
              <div>
                <h1>Resumen de tu Pedido</h1>
              </div>
              <div className="border p-3 rounded mt-5">
                <div className="text-lg font-semibold">
                  Información personal
                </div>
                {order.billingPerson && (
                  <div>
                    <div>Nombre: {order.billingPerson.name}</div>
                    <div>Correo electrónico: {order.email}</div>
                    <div>Numero de celular: {order.billingPerson.phone}</div>
                  </div>
                )}
              </div>
              <div className="border p-3 rounded mt-10">
                <div className="text-lg font-semibold">Información de pago</div>
                {methodPayCash === "true" ? (
                  <div>Método de pago: Efectivo</div>
                ) : (
                  <div>Método de pago: Tarjeta</div>
                )}
                <div>Monto total: ${order.total}</div>
                {methodPayCard === "true" && (
                  <div>Tarjeta: xxxx xxxx xxxx xxxx</div>
                )}
              </div>
              <div className="border p-3 rounded mt-10">
                <div className="text-lg font-semibold">
                  Información de entrega
                </div>
                <div>
                  {order.billingPerson && (
                    <div>Dirección: {order.billingPerson.street}</div>
                  )}
                  <div>
                    Día: {dia} / {mes} / {año}
                  </div>
                  <div>
                    Hora: {hora}:{minutos}
                  </div>
                </div>
              </div>
              <div className="border p-3 rounded mt-10">
                <div className="text-lg font-semibold">
                  Comentarios de mi pedido
                </div>
                <div>
                  <div>
                    {order.orderComments
                      ? order.orderComments
                      : "Sin comentarios"}
                  </div>
                </div>
              </div>

              <div className="text-lg font-semibold mt-7 mb-5">
                Mis productos
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="table-responsive">
                    <table
                      className={
                        productos.length > 0
                          ? "table shopping-summery text-center clean"
                          : "d-none"
                      }
                    >
                      <thead>
                        <tr className="main-heading">
                          <th scope="col">Imagen</th>
                          <th scope="col">Producto</th>
                          <th scope="col">Precio</th>
                          <th scope="col">Cantidad</th>
                          <th scope="col">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productos.map((item, i) => (
                          <tr key={i}>
                            <td className="image product-thumbnail">
                              <img src={item.imageUrl} />
                            </td>

                            <td className="product-des product-name">
                              <h5 className="product-name">
                                {/* <Link href="/products">
                                <a>{item.name}</a>
                              </Link> */}
                                {item.name}
                              </h5>
                              {item.description && (
                                <p className="font-xs">
                                  {item.description.slice(3, -4)}
                                </p>
                              )}
                            </td>
                            <td className="price" data-title="Price">
                              <span>${item.price}</span>
                            </td>
                            <td className="text-center" data-title="Stock">
                              <div className="detail-qty   m-auto">
                                <span className="qty-val">{item.quantity}</span>
                              </div>
                            </td>
                            <td className="text-center" data-title="Cart">
                              <span>${item.quantity * item.price}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="col-12 ">
            <div className=" h-20 rounded-xl justify-center flex flex-col items-center p-1">
              <BeatLoader color={"#325454"} size={10} className="mb-10" />
              <h4 className="text-center text-xs">Cargando información</h4>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

const mapStateToProps = (state) => ({
  cartItems: state.cart,
  activeCart: state.counter,
});

const mapDispatchToProps = {
  closeCart,
  increaseQuantity,
  decreaseQuantity,
  deleteFromCart,
  openCart,
  clearCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(infoProductos);
