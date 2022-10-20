import React, { useEffect, useState } from "react";
import Link from "next/link";
import ecwid from "../../util/ecwid";

function HeaderLifeStyle() {
  const [attributes, setAttributes]= useState([])
  const [loading, setLoading] = useState(true);

  //obteniendo datos por atributo
  const getData = async()=>{
    console.log('Atributos')
    const productos = await ecwid.getClasses();
    const atributos = productos[0].attributes
    console.log(atributos)
    //totalProductos.map((producto)=>{
      //producto.attributes.map((atributo)=>{
        //if(!auxatributos.includes(atributo.name)){
          //auxatributos.push(atributo.name),
          //atributos.push(atributo)
        //}
      //})
    //})
    setAttributes(atributos)
    setLoading(false)
  }
  
    useEffect(() => {
      getData();
    }, []);



  return (
    <>
      <div className="relative flex items-center align-center" >
        <div
          id="sliderLifeStyle"
          className="w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide"
        >

          {attributes.map((l, i) => 
            (
              <>
                { ((l.name != 'UPC') && (l.name != 'Brand') && (l.name != 'Tamaño') && (l.name != 'Contenido Energético (kcal)')) &&
                  <div
                    key={i}
                    className=" w-[auto] inline-block p-2 cursor-pointer hover:scale-105 ease-in-out duration-300 text-center text-align "
                  >
                    <div className="flex-row">
                      <Link
                          href={{
                            pathname: "/lifestyle/[slug]",
                            query: {
                              id: l.id,
                              title: l.name,
                              slug: l.id,
                            },
                        }}
                      >
                        <div className="container " id="item-list">
                          <img src={`/assets/imgs/theme/icons/${l.name}.svg`} width="32px" height="32px" id='item'/>
                          <strong>{l.name}</strong>
                        </div>
                      </Link>
                    </div>
                  </div>
                }
              </>
            )
          )}

          <div
            key='calorias'
            className=" w-[auto] inline-block p-2 cursor-pointer hover:scale-105 ease-in-out duration-300 text-center text-align"
          >
            <div className="flex-row">
                <Link
                  href={{
                    pathname: "/lifestyle/",
                  }}
                >
                  <div className="container " id="item-list">
                    <img src={`/assets/imgs/theme/icons/Calendario.svg`} width="32px" height="32px" id='item'/>
                    <strong>Planner</strong>
                  </div>
                </Link>
              </div>
          </div>
          <div
            key='mobilemenu'
            className=" w-[auto] inline-block p-2 cursor-pointer hover:scale-105 ease-in-out duration-300 text-center text-align"
          >
            <div className="flex-row">
                <Link
                  href={{
                    pathname: "/mobilemenu/",
                  }}
                >
                  <div className="container " id="item-list">
                    <img src={`/assets/imgs/theme/icons/phone.svg`} width="32px" height="32px" id='item'/>
                    <strong>La Carta</strong>
                  </div>
                </Link>
              </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default HeaderLifeStyle;
