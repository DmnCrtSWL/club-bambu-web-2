import React, { useEffect, useState } from "react";
import { server } from "../../config/index";
import FeaturedTab from "../elements/FeaturedTab";
import NewArrivalTab from "../elements/NewArrivalTab";
import TrendingTab from "../elements/TrendingTab";
import Link from "next/link";
import ProductsCategory from "./ProductsCategory";

function Products() {
  return (
    <>
      <div className="tab-content wow fadeIn animated">
        <div className="tab-pane fade show active">
          <div className="product-grid-4 row">
            <ProductsCategory />
          </div>
        </div>
      </div>
    </>
  );
}
export default Products;
