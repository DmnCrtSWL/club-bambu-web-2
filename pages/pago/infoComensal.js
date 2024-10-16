import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/layout/Layout";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import esLocale from "date-fns/locale/es";
import { createTheme } from "@material-ui/core";
//import { ThemeProvider } from "@material-ui/styles";
import { UseLocalStorage } from "../../components/pago/UseLocalStorage";
import { isEmpty, size } from "lodash";
import { toast } from "react-toastify";
import { validateEmail } from "../../util/validations";
import Autocomplete from "react-google-autocomplete";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  ElementsConsumer,
  CardElement,
} from "@stripe/react-stripe-js";
import ecwid from "../../util/ecwid";
import {
  clearCart,
  closeCart,
  increaseQuantity,
  openCart,
} from "../../redux/action/cart";
import { connect } from "react-redux";
import moment from "moment";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TextField } from "@mui/material";
import BeatLoader from "react-spinners/BeatLoader";


const infoComensal = ({ cartItems, clearCart }) => {
  const router = useRouter();
  const [name, setName] = UseLocalStorage("text", "");
  const [email, setEmail] = UseLocalStorage("email", "");
  const [phone, setPhone] = UseLocalStorage("phone", "");
  const [methodPayCash, setMethodPayCash] = useState(true);
  const [methodPayCard, setMethodPayCard] = useState(false);
  const [coupon, setCoupon] = UseLocalStorage("coupon", "");
  const [date, setDate] = UseLocalStorage(
    "date",
    round(moment(), moment.duration(30, "minutes"), "ceil")
  );
  const [hour, setHour] = UseLocalStorage("hour", "");
  const [adress, setAdress] = UseLocalStorage("adress", "Prueba");
  //const [comments, setComments] = UseLocalStorage("comments", "");
  const [comments, setComments] = useState("");
  const stripePromise = loadStripe("<pulishable_api_key>");
  const [total, setTotal] = useState(0);
  const [orderId, setOrderId] = UseLocalStorage("orderId", "");
  var vector = {};
  const [loading, setLoading]=useState(true)

  useEffect(() => {
    cartItems.map((item) => setTotal((total += item.price * item.quantity)));
    setLoading(false);
  }, [cartItems]);

  const sendForm = async () => {
    if (isEmpty(name)) {
      toast.error("Ingresa tu nombre");
    } else if (isEmpty(email)) {
      toast.error("Ingresa tu correo electrónico");
    } else if (isEmpty(phone)) {
      toast.error("Ingresa tu celular");
    } else if (isEmpty(adress)) {
      toast.error("Ingresa tu dirección");
    } else if (!validateEmail(email.replace(/ /g, ""))) {
      toast.error("Ingresa un correo electrónico válido");
    } else if (size(phone) != 10) {
      toast.error("Ingresa un celular valido");
    } else if (!/^\d+/.test(phone)) {
      toast.error("Ingresa un celular valido");
    } else if (!/^[0-9]+$/.test(phone)) {
      toast.error("Ingresa un celular valido");
    } else if (Date.parse(new Date(date)) < Date.parse(new Date())) {
      toast.error("Ingresa una fecha mayor");
    } else {
      if (methodPayCard === true) {
        handleSubmit();
      } else {
        //const paymentMethod = methodPayCard ? "Card" : "Cash"
        var productos = [];
        var datoProducto = {};
        var opcionesSeleccionadas=[];
        var datoOpciones={};

        cartItems.map(
          (item) => (
            /*(item.selectedOptions.map(opcion =>(
              datoOpciones={
                name: opcion.name,
                selections: [
                  {
                    selectionTitle: opcion.selections[0].selectionTitle, 
                    selectionModifier: opcion.selections[0].priceModifier, 
                    selectionModifierType: opcion.selections[0].selectionModifierType
                  } 
                ],
                type: opcion.type,
                value: opcion.value,
                valueTranslated: {es_419: opcion.value},
                valuesArray: opcion.valuesArray,
              },
              opcionesSeleccionadas.push(datoOpciones)
              )
            )),*/
            (datoProducto = {
              productId: item.id,
              category: item.defaultCategoryId,
              sku: item.sku,
              quantity: item.quantity,
              name: item.name,
              price: item.price,
              selectedOptions:  item.selectedOptions,
            }),
            productos.push(datoProducto)
          )
        );
        //_____________________________Formateando fecha
        const fecha = new Date(date);
        const dia = fecha.getDate();
        const mes = fecha.getMonth() + 1;
        const año = fecha.getFullYear();
        // const horario = new Date(hour);
        const hora = fecha.getHours();
        const minuto = fecha.getMinutes();
        const dateFormat =
          año + "-" + mes + "-" + dia + " " + hora + ":" + minuto + ":00 +0000";
        //_______________________________
        const data = {
          refundedAmount: 0,
          subtotal: total,
          subtotalWithoutTax: 0,
          total: total,
          totalWithoutTax: 0,
          giftCardRedemption: 0,
          totalBeforeGiftCardRedemption: 0,
          giftCardDoubleSpending: false,
          paymentMethod: methodPayCash ? "Cash" : "Card",
          tax: 0,
          couponDiscount: parseInt(coupon),
          paymentStatus: "PAID",
          fulfillmentStatus: "AWAITING_PROCESSING",
          shippingPerson: {
            name: name,
            city: adress.formatted_address,
            countryCode: "MX",
            street: adress.formatted_address,
            phone: phone,
          },
          billingPerson: {
            name: name,
            city: adress.formatted_address,
            countryCode: "MX",
            street: adress.formatted_address,
            phone: phone,
          },
          isTypeForm: true,
          items: productos,
          email: email,
          pickupTime: dateFormat,
          orderComments: comments,
        };
        //registrar Orden en Ewcid
        const resp = await ecwid.addOrder(data);
        vector = [
          ...orderId,
          { orderId: resp.id, name: name, phone: phone, email: email },
        ];
        setOrderId(vector);
        if (orderId) {
          clearCart();
        }
        const id = resp.id;
        const iorder = id.toString();
        //3. Mandamos a la pagina detalle de pedido
        router.push({
          pathname: "/pago/infoProductos",
          query: {
            methodPayCash,
            methodPayCard,
            name,
            email,
            phone,
            coupon,
            date,
            hour,
            adress,
            comments,
            iorder,
          },
        });
      }
    }
  };

  function roundMinutes(date) {
    date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
    date.setMinutes(0);

    return date;
  }

  const handleSubmit = (stripe, elements) => async () => {
    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });
    if (error) {
      toast.error("Error en la compra");
      console.log("[error]", error);
    } else {
      //const paymentMethod = methodPayCard ? "Card" : "Cash"
      var productos = [];
      var datoProducto = {};
      cartItems.map(
        (item) => (
          (datoProducto = {
            productId: item.id,
            sku: item.sku,
            quantity: item.quantity,
            name: item.name,
            price: item.price,
            selectedOptions: [],
          }),
          productos.push(datoProducto)
        )
      );
      //_____________________________Formateando fecha
      const fecha = new Date(date);
      const dia = fecha.getDate();
      const mes = fecha.getMonth() + 1;
      const año = fecha.getFullYear();
      // const horario = new Date(hour);
      const hora = fecha.getHours();
      const minuto = fecha.getMinutes();
      const dateFormat =
        año + "-" + mes + "-" + dia + " " + hora + ":" + minuto + ":00 +0000";
      //_______________________________
      const data = {
        refundedAmount: 0,
        subtotal: total,
        subtotalWithoutTax: 0,
        total: total,
        totalWithoutTax: 0,
        giftCardRedemption: 0,
        totalBeforeGiftCardRedemption: 0,
        giftCardDoubleSpending: false,
        paymentMethod: methodPayCash ? "Cash" : "Card",
        tax: 0,
        couponDiscount: parseInt(coupon),
        paymentStatus: "PAID",
        fulfillmentStatus: "AWAITING_PROCESSING",
        shippingPerson: {
          name: name,
          city: adress.formatted_address,
          countryCode: "MX",
          street: adress.formatted_address,
          phone: phone,
        },
        billingPerson: {
          name: name,
          city: adress.formatted_address,
          countryCode: "MX",
          street: adress.formatted_address,
          phone: phone,
        },
        isTypeForm: true,
        items: productos,
        email: email,
        pickupTime: dateFormat,
        orderComments: comments,
      };
      //registrar Orden en Ewcid
      const resp = await ecwid.addOrder(data);
      vector = [
        ...orderId,
        { orderId: resp.id, name: name, phone: phone, email: email },
      ];
      setOrderId(vector);
      if (orderId) {
        clearCart();
      }

      const id = resp.id;
      const iorder = id.toString();
      //3. Mandamos a la pagina detalle de pedido
      router.push({
        pathname: "/pago/infoProductos",
        query: {
          methodPayCash,
          methodPayCard,
          name,
          email,
          phone,
          coupon,
          date,
          hour,
          adress,
          comments,
          iorder,
        },
      });
      // ... SEND to your API server to process payment intent
    }
  };

  function round(date, duration, method) {
    return moment(Math[method](+date / +duration) * +duration);
  }

  return (
    <>
      {loading === true ? (
      <div className="col-12">
      <div className=" h-20 rounded-xl justify-center flex flex-col items-center p-1">
        <BeatLoader color={"#325454"} size={10} className="mb-10" />
        <h4 className="text-center text-xs">Cargando Información</h4>
      </div>
    </div>
      ):(
      <>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCSfb3q43wvrhTk9tbipj9KkrcVcjxW3ro&libraries=places"></script>
          <Layout noBreadcrumb="d-none" headerStyle="header-style-1">
        <section className="product-tabs section-padding position-relative wow fadeIn animated">
          <div className="container">
            <div className="col-lg-12">
              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                <h2 className="ml-10">Información comensal</h2>
                <form className="m-10">
                  <h4 className="font-normal mb-2">Nombre completo*</h4>
                  <input
                    className="w-full"
                    onChange={(e) => setName(e.target.value)}
                    name="name"
                    type="text"
                    value={name}
                  ></input>
                  <h4 className="font-normal mb-5 my-4">Correo electrónico*</h4>
                  <input
                    className="w-full"
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    type="text"
                    value={email}
                  ></input>
                  <h4 className="font-normal mb-5 my-4">Numero de celular*</h4>
                  <input
                    className="w-full"
                    onChange={(e) => setPhone(e.target.value)}
                    name="phone"
                    type="text"
                    value={phone}
                  ></input>
                  <h4 className="font-normal mb-5 my-4">Método de pago*</h4>
                  <label className="mx-4 mt-2">
                    Efectivo
                    <input
                      type="checkbox"
                      name="methodPayCash"
                      onChange={(e) => {
                        if (methodPayCash) {
                          setMethodPayCash(false);
                          setMethodPayCard(true);
                        } else {
                          setMethodPayCash(true);
                          setMethodPayCard(false);
                        }
                      }}
                      checked={methodPayCash}
                      className="h-5"
                    ></input>
                  </label>
                  <label>
                    Tarjeta de debito o credito
                    <input
                      type="checkbox"
                      name="methodPayCard"
                      onChange={(e) => {
                        if (methodPayCard) {
                          setMethodPayCash(true);
                          setMethodPayCard(false);
                        } else {
                          setMethodPayCash(false);
                          setMethodPayCard(true);
                        }
                      }}
                      className="h-5"
                      checked={methodPayCard}
                    ></input>
                  </label>
                  {methodPayCard && (
                    <>
                      <h4 className="font-normal mb-5 my-4">
                        Informacion de pago
                      </h4>
                      <Elements stripe={stripePromise}>
                        <CardElement />
                      </Elements>
                    </>
                  )}
                  <h4 className="font-normal mb-5 my-4">Cupón de descuento</h4>
                  <input
                    className="w-full"
                    onChange={(e) => setCoupon(e.target.value)}
                    name="coupon"
                    type="text"
                    value={coupon}
                  ></input>
                  <h4 className="font-normal mb-6 my-4">Fecha de entrega*</h4>
                  {/* <ThemeProvider theme={materialTheme}>
                    <DatePicker
                      value={date ? date : new Date()}
                      onChange={(e) => setDate(e.toString())}
                      name="date"
                      inputVariant="outlined"
                      minDate={new Date()}
                    />
                  </ThemeProvider>
                  <h4 className="font-normal mb-6 my-4">Hora de entrega</h4> */}
                  {/* <ThemeProvider theme={materialTheme}>
                    <TimePicker
                      value={hour ? hour : roundMinutes(new Date())}
                      onChange={(e) => setHour(e.toString())}
                      name="date"
                      inputVariant="outlined"
                      minutesStep={30}
                    />
                  </ThemeProvider> */}
                  {/* <ThemeProvider theme={materialTheme}> */}
                  {/* <DateTimePicker
                    value={date}
                    onChange={(e) => setDate(e.toString())}
                    name="date"
                    inputVariant="outlined"
                    minDate={new Date()}
                    minutesStep={30}
                  /> */}
                  {/* </ThemeProvider> */}
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      value={date}
                      onChange={(newValue) => {
                        setDate(newValue.toString());
                      }}
                      label="Intervalos de 30 minutos"
                      minutesStep={30}
                      minDate={new Date()}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          disabled
                          onKeyDown={(event) => event.preventDefault()}
                        />
                      )}
                    />
                  </LocalizationProvider>
                  <h4 className="font-normal mb-5 my-4">
                    Dirección de entrega*
                  </h4>
                  <Autocomplete
                    apiKey={"AIzaSyCSfb3q43wvrhTk9tbipj9KkrcVcjxW3ro"}
                    onPlaceSelected={(place) => {
                      setAdress(place);
                    }}
                    defaultValue={adress.formatted_address}
                    language="es"
                    placeholder="Buscar ubicación"
                    options={{
                      types: "address",
                      componentRestrictions: { country: "mx" },
                    }}
                  />
                  <h4 className="font-normal mb-5 my-4">Comentarios extras:</h4>
                  <textarea
                    className="w-full"
                    onChange={(e) => setComments(e.target.value)}
                    name="comments"
                    value={comments}
                  ></textarea>
                </form>
                <div className="cart-action text-end">
                  <a className="btn " onClick={() => sendForm()}>
                    Realizar compra
                  </a>
                </div>
              </MuiPickersUtilsProvider>
            </div>
          </div>
        </section>
      </Layout>
    </>
  )};
  </>
  )
};

const materialTheme = createTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: "#325454",
      },
    },
  },
  MuiPickersDay: {
    day: {
      color: "#325454",
    },
    daySelected: {
      backgroundColor: "#325454",
    },
    current: {
      color: "#325454",
    },
  },
});

// const materialTheme = createTheme({
//   overrides: {
//     MuiPickersCalendarHeader: {
//       switchHeader: {
//         color: "#6A148E",
//         textTransform: "uppercase",
//       },
//       dayLabel: {
//         textTransform: "uppercase",
//       },
//     },
//     MuiPickersDay: {
//       day: {
//         color: "#325454",
//       },
//       daySelected: {
//         backgroundColor: "#325454",
//         "&:hover": {
//           backgroundColor: "#325454",
//         },
//       },
//       current: {
//         color: "##325454",
//       },
//     },
//     MuiSvgIcon: {
//       root: {
//         fill: "white",
//       },
//     },
//   },
// });

const mapStateToProps = (state) => ({
  cartItems: state.cart,
  activeCart: state.counter,
  totalCartItems: state.cart.length,
});

const mapDispatchToProps = {
  closeCart,
  increaseQuantity,
  openCart,
  clearCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(infoComensal);

//export default infoComensal;
