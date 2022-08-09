import React from "react";
import ProductsLifeStyle from "./ProductsLifeStyle";

function Products() {
  return (
    <>
      <div className="tab-content wow fadeIn animated">
        <div className="tab-pane fade show active">
          <div className="product-grid-4 row">
            <ProductsLifeStyle />
          </div>
        </div>
      </div>
    </>
  );
}
export default Products;
