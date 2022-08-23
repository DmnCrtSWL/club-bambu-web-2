import React from "react";
import ProductsMobileMenu from "./ProductsMobileMenu";

function MobileMenu() {
  return (
    <>
      <div className="tab-content wow fadeIn animated">
        <div className="tab-pane fade show active">
          <div className="product-grid-4 row">
            <ProductsMobileMenu />
          </div>
        </div>
      </div>
    </>
  );
}
export default MobileMenu;
