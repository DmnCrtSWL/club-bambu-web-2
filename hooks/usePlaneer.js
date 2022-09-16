import { useState } from "react";

export const usePlaneer = ({initialValue, productFilters}) =>{
  const [data, setData] = useState(initialValue);

  function handleClick(producto){
    let auxBandera = 0;
    if(size(data) > 0){
      data.map(pedido=>{
        if(pedido.name === producto.name){
          auxBandera = 1;
        }
      })
      if(auxBandera === 0 && (productFilters.foods > size(data))){
        setPedidoDiario([...pedidoDiario, producto])
        toast.success(`Agregado ${producto.name} en tu pedido del día!`);
      }else if(auxBandera !== 0){
        let newArray = pedidoDiario.filter(pedido => pedido.name !== producto.name)
        toast.success(`Eliminando ${producto.name} de tu pedido Diario!`)
        setPedidoDiario(newArray)
      }
    }else{
      setPedidoDiario([...pedidoDiario, producto])
      toast.success(`Agregado ${producto.name} en tu pedido del día!`);
    }
  }

  const updateData=()=>{

  };

  const deleteData=()=>{

  };
  
  return[data, handleClick];
}