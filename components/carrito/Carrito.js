import React from "react";
import Link from "next/link";

function Carrito() {
    return (
       
                    <div style={{
                        position: "fixed", top:"90%", backgroundColor:"#367474", borderRadius:15,right:"5%", width:"20%", height:50,
                        alignItems:"center", display:"flex", justifyContent:"center"
                    }}>
                  <Link href="/shop-cart" style={{
                     position: "fixed", top:"90%", backgroundColor:"#367474", borderRadius:15,right:"5%", width:"20%", height:50,
                     alignItems:"center", display:"flex", justifyContent:"center"
                  }}>
                        <a className="mini-cart-icon">
                        <span className="pro-count blue" style={{color:"white"}}>
                                Mi carrito
                            </span>
                            
                        </a>
                    </Link>
                    </div>
                   
    );
}

export default Carrito;
