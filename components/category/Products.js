import React from "react";
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
