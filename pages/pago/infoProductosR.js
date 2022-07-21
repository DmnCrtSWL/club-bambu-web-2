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

//Cambiar Cart por titulo infoProductos
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
  const [order,setOrder] = useState();

  console.log("*******");
  console.log(date);
  console.log("*******");

  console.log(hour);
  console.log("*******");

  console.log(orderId);
  console.log("*******");

  const horaOrden = new Date(hour);
  const hora = horaOrden.getHours();
  const minutos = horaOrden.getMinutes();

  const fechaOrden = new Date(date);
  const dia = fechaOrden.getDate();
  const mes = fechaOrden.getMonth() + 1;
  const año = fechaOrden.getFullYear();
  const cartItems = 0;

  /*const price = () => {
    let price = 0;
    cartItems.forEach((item) => (price += item.price * item.quantity));
    return price;
  };*/

  useEffect(() => {
    getData()
  }, [orderId]);
  
  const getData= async()=>{
    const resp = await ecwid.getOrderDetails(orderId)
    setOrder(resp)
    console.log(resp)
  }
  
  return (
    <>
      <Layout parent="Inicio" sub="Mis pedidos" subChild="Detalles">
        <section className="mt-50 mb-50">
          <div className="container">
            <div>
              <h1>Resumen de tu Pedido</h1>
            </div>
            <div className="border p-3 rounded mt-5">
              <div className="text-lg font-semibold">Información personal</div>
              <div>
                <div>Nombre: {name}</div>
                <div>Correo electrónico: {email}</div>
                <div>Numero de celular: {phone}</div>
              </div>
            </div>
            <div className="border p-3 rounded mt-10">
              <div className="text-lg font-semibold">Información de pago</div>
              {methodPayCash === "true" ? (
                <div>Método de pago: Efectivo</div>
              ) : (
                <div>Método de pago: Tarjeta</div>
              )}
              <div>Monto total: ${total.toFixed(2)}</div>
              {methodPayCard === "true" && (
                <div>Tarjeta: xxxx xxxx xxxx xxxx</div>
              )}
            </div>
            <div className="border p-3 rounded mt-10">
              <div className="text-lg font-semibold">
                Información de entrega
              </div>
              <div>
                <div>Dirección: {adress}</div>
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
                <div>{comments ? comments : "Sin comentarios"}</div>
              </div>
            </div>

            <div className="text-lg font-semibold mt-7 mb-5">Mis productos</div>
            <div className="row">
              <div className="col-12">
                <div className="table-responsive">
                  {/*cartItems.length <= 0 && "No Products"*/}
                  <table
                    className={
                      cartItems.length > 0
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
                      {/*cartItems.map((item, i) => (
                        <tr key={i}>
                          <td className="image product-thumbnail">
                            <img src={item.imageUrl} />
                          </td>

                          <td className="product-des product-name">
                            <h5 className="product-name">
                              <Link href="/products">
                                <a>{item.name}</a>
                              </Link>
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
                            <div className="text-center">
                              <span className="qty-val text-center">
                                {item.quantity}
                              </span>
                            </div>
                          </td>
                          <td className="text-center" data-title="Cart">
                            <span>${item.quantity * item.price}</span>
                          </td>
                        </tr>
                      ))*/}
                      {/* <tr>
                        <td colSpan="6" className="text-end">
                          <a onClick={clearCart} className="text-muted">
                            <h3>Total: ${total}</h3>
                          </a>
                        </td>
                      </tr> */}
                    </tbody>
                  </table>
                </div>
                {/* <div className="cart-action text-end">
                  <Link
                    href={{
                      pathname: "/pago/infoComensal",
                    }}
                  >
                    <a className="btn ">
                      <i className="fi-rs-shopping-bag mr-10"></i>
                      Finalizar compra
                    </a>
                  </Link>
                </div> */}
              </div>
            </div>
          </div>
        </section>
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
