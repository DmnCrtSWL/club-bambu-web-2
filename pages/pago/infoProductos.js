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

const Cart = ({
  cartItems,
  clearCart,
}) => {
  const [total, setTotal] = useState(0);
  const price = () => {
    let price = 0;
    cartItems.forEach((item) => (price += item.price * item.quantity));
    return price;
  };

  useEffect(() => {
    setTotal(0);
    cartItems.map((item, i) => setTotal(total + item.price * item.quantity));
    console.log("ok");
  }, [cartItems]);

  const SetPedido=()=>{

  }
  
  return (
    <>
      <Layout parent="Home" sub="Shop" subChild="Cart">
        <section className="mt-50 mb-50">
          <div className="container">
            <div>
              <h1>Resumen de tu Pedido</h1>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="table-responsive">
                  {cartItems.length <= 0 && "No Products"}
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
                      {cartItems.map((item, i) => (
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
                      ))}
                      <tr>
                        <td colSpan="6" className="text-end">
                          <a onClick={clearCart} className="text-muted">
                            <h3>Total: ${total}</h3>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="cart-action text-end">
                  <Link
                    href={{
                      pathname: "/pago/infoComensal",
                    }}
                  >
                    <a className="btn ">
                      {/* <i className="fi-rs-shopping-bag mr-10"></i> */}
                      Finalizar compra
                    </a>
                  </Link>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
