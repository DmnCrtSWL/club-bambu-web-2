import React, { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../components/layout/Layout";

function misPedidos() {
  return (
    <>
      <Layout noBreadcrumb="d-none" headerStyle="header-style-1">
        <div>Mis pedidos</div>
      </Layout>
    </>
  );
}
export default misPedidos;
