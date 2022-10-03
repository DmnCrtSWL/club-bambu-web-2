import { useState } from "react";
import { toast } from "react-toastify";
import ecwid from "../util/ecwid";
import {addDays ,DateFnsUtils, getDay} from "date-fns";

const useComida = (initialValue) => {
  const [products,setProducts] = useState([]);
  const [numComidas, setNumComidas] = useState(initialValue);
  const horariosComidas = {
    0: '13:30:00 +0000', //8:30 Ok
    1: '16:30:00 +0000', //11:30 OK
    2: '19:30:00 +0000', //14:30 OK
    3: '22:30:00 +0000', // 17:30 OK
    4: '00:30:00 +0000' //19:30 OK
    //00 = 7pm
    //01 = 8pm
    //02 = 9pm
    //03 = 10pm
    //04 = 11pm
    //05 = 12am
    //06 = 1am
    //07 = 2am
    //08 = 3am
    //09 = 4am
    //10 = 5am
    //11 = 6am
    //12 = 7am
    //13 = 8am
    //14 = 9am
    //15 = 10am
    //16 = 11am
    //17 = 12pm
    //18 = 1pm
    //19 = 2pm
    //20 = 3pm
    //21 = 4pm
    //22 = 5pm
    //23 = 6pm
  }
  const data = {
    refundedAmount: 0,
    subtotal: 0,
    subtotalWithoutTax: 0,
    total: 0,
    totalWithoutTax: 0,
    giftCardRedemption: 0,
    totalBeforeGiftCardRedemption: 0,
    giftCardDoubleSpending: false,
    paymentMethod:"Cash",
    tax: 0,
    couponDiscount: 0,
    paymentStatus: "PAID",
    isTypeForm:true,
    fulfillmentStatus: "AWAITING_PROCESSING",
    shippingPerson: {
      name: "",
      city: "",
      countryCode: "MX",
      street: "",
      phone: "",
    },
    billingPerson: {
      name: "",
      city: "",
      countryCode: "MX",
      street: "",
      phone: "",
    },
    isTypeForm: true,
    items: [],
    email: "",
    pickupTime: "dateFormat",
    orderComments: "",
  };


  const AddProduct= (producto)=>{
    let bandera= 0;
    if((products?.length || 0)> 0) {
      products.map((product) =>{
        if(product.name === producto.name ){
          bandera = 1;
        }
      })
      if(bandera === 0){
        if((products?.length || 0) < numComidas){
          setProducts([...products,producto])
        }else{
          toast.error(`No puedes agregar mas productos numero de comidas: ${numComidas} 
            numero de productos ${products?.length || 0}`)
        }
      }else{
        let newArray = products.filter(product => product.name !== producto.name)
        setProducts(newArray)
      }
    }else{
      setProducts([...products, producto])
    }
  }

  const setFoodNumbers=(foodNumbers)=>{
    setNumComidas(foodNumbers)
  }

  const formatDate=(fecha, hora)=>{
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const year = fecha.getFullYear();
    if (mes <10){
     const fechaFormateada = year + "-0" + mes + "-" + dia + " " + hora;
     return fechaFormateada;
    }else{
     const fechaFormateada = year + "-" + mes + "-" + dia + " " + hora;
     return fechaFormateada;
    }
  }

  const ImprimirCheckout=(datos)=>{
    if(products.length > 0){
      const fechaInicial = new Date(datos.fecha);
      const dia = fechaInicial.getDate();
      const mes = fechaInicial.getMonth();
      const año = fechaInicial.getFullYear();
      const auxDiasAgenda = 30
      const auxFecha = fechaInicial
      const diaSemana= datos.numeroDia
      //console.log(diaSemana)
      products.map(async(producto, index)=>{
        for(let aumentoDia = 1; aumentoDia <= auxDiasAgenda; aumentoDia++){
          if(getDay(auxFecha) === diaSemana)
          {
            const diaAgendado = formatDate(auxFecha, horariosComidas[index])
            data.subtotal= 0 //producto.price
            data.total= 0   //producto.price 
            data.paymentMethod= datos.paymentMethod
            data.shippingPerson.name= datos.name
            data.shippingPerson.city = datos.adress
            data.shippingPerson.street = datos.adress
            data.shippingPerson.phone= datos.phone
            data.billingPerson.name = datos.name
            data.billingPerson.city = datos.adress
            data.billingPerson.street= datos.adress
            data.billingPerson.phone= datos.phone
            data.items=[producto] 
            data.items[0].tax=0
            data.items[0].shipping=0
            data.email= datos.email
            data.pickupTime= diaAgendado
            data.orderComments= datos.comments
            data.tax=0
            //console.log('Dato a enviar a ECWID')
            //console.log(data)
            //registrar Orden en Ewcid
            const resp = await ecwid.addOrder(data);
          }
          auxFecha=addDays(new Date(auxFecha.getFullYear(),auxFecha.getMonth(), auxFecha.getDate()),1)
        }
      })
    }

  }

  return [products, AddProduct, setFoodNumbers,ImprimirCheckout];
}

export default useComida