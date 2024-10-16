import React, { useEffect, useState } from "react";
import Link from "next/link";
import ecwid from "../../util/ecwid";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

function HeaderCategory() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    (async () => {
      const categorias = await ecwid.getCategories({productIds:true, parent: 0});
      setCategorias(categorias.items);
    })();
  }, []);

  const slideLeft = () => {
    var slider = document.getElementById("slider");
    slider.scrollLeft = slider.scrollLeft - 500;
  };

  const slideRight = () => {
    var slider = document.getElementById("slider");
    slider.scrollLeft = slider.scrollLeft + 500;
  };

  return (
    <>
      <div className="relative flex items-center mx-11 mt-10">
        <MdChevronLeft
          size={40}
          onClick={slideLeft}
          className="opacity-50 cursor-pointer hover:opacity-100"
        />
        <div
          id="slider"
          className="w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide "
        >
          {categorias.map((l, i) => (
            <div
              key={i}
              className="w-[220px] inline-block p-2 cursor-pointer hover:scale-105 ease-in-out duration-300 "
            >
              <div className="flex-row">
                <Link
                  href={{
                    pathname: "/categories/[slug]",
                    query: {
                      id: l.parentId,
                      title: l.name,
                      slug: l.id,
                      idProducts: l.productIds ? l.productIds : []
                    },
                  }}
                  // "/categories/[slug]"
                  // as={`/categories/${category.slug}`}
                >
                  <a className="font-bold">{l.name}</a>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <MdChevronRight
          size={40}
          onClick={slideRight}
          className="opacity-50 cursor-pointer hover:opacity-100 "
        />
      </div>
    </>
  );
}
export default HeaderCategory;
