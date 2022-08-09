import React, { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../components/layout/Layout";
import { MdError } from "react-icons/md";
import { size } from "lodash";
import { useRouter } from "next/router";

function misPedidos() {
  const router = useRouter();
  const [historial, sethistorial] = useState([]);

  useEffect(() => {
    const pedidos = JSON.parse(localStorage.getItem("orderId"));
    sethistorial(pedidos);
    console.log(pedidos);
  }, []);

  return (
    <>
      <Layout noBreadcrumb="d-none" headerStyle="header-style-1">
        <section className="product-tabs section-padding position-relative wow fadeIn animated">
          <div className="container">
            <div className="col-lg-12">
              <h2>Mis pedidos</h2>
              {size(historial) > 0 ? (
                <>
                  {historial.map((item, i) => (
                    <div
                      className="bg-gray-100 h-16 rounded-xl flex flex-row items-center p-1 mt-10 justify-between px-5"
                      key={i}
                      onClick={() => {
                        const id = item.orderId;
                        const orderi = id.toString();
                        router.push({
                          pathname: "/pago/infoProductos",
                          query: {
                            orderi,
                          },
                        });
                      }}
                    >
                      <div>Cliente: {item.name}</div>
                      <div>Numero de órden: {item.orderId} </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className=" h-20 rounded-xl justify-center flex flex-col items-center p-1">
                  <MdError size={40} className="mb-5" />
                  <h4 className="text-center text-xs">
                    No has realizado ningún pedido
                  </h4>
                </div>
              )}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
export default misPedidos;
