import React, { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../components/layout/Layout";

function misPedidos() {
  return (
    <>
      <Layout noBreadcrumb="d-none" headerStyle="header-style-1">
        <section className="product-tabs section-padding position-relative wow fadeIn animated">
          <div className="container">
            <div className="col-lg-12">
              <h2>Mis pedidos</h2>
              <div className="bg-gray-100 h-16 rounded-xl justify-center flex flex-col items-center p-1 mt-10">
                <div>hola</div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
export default misPedidos;
