import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import Layout from "../../components/layout/Layout";
import { fetchProduct } from "../../redux/action/product";
import Link from "next/link";
import ecwid from "../../util/ecwid";
import { size } from "lodash";
import getProducts from "../../util/getProducts";
import { toast } from "react-toastify";
import {useModal} from '../../hooks/useModal';
import Modal from '../../components/layout/Modal';
import useComida from '../../hooks/useComida';
import { 
  Box, 
  Button,  
  MobileStepper,
  InputAdornment,
  FormControl,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material/';
import {Person, SportsRugbySharp} from '@mui/icons-material/';
import { MenuItem, Select} from "@material-ui/core";
import { MdError } from "react-icons/md";
import BeatLoader from "react-spinners/BeatLoader";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { UseLocalStorage } from "../../components/pago/UseLocalStorage";
import DateFnsUtils from "@date-io/date-fns";
import esLocale from "date-fns/locale/es";
import moment from "moment";
import { addDays } from "date-fns";
import { isEmpty } from "lodash";
import { validateEmail } from "../../util/validations";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
} from "@stripe/react-stripe-js";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette:{
    primary:{
      main:'#2d5253'
    },
    secondary:{
      main:'#edf6f6'
    },
  },
  components: {
    MuiMobileStepper:{
      styleOverrides:{
      }
    },
    MuiLinearProgress:{
      styleOverrides:{
        root:{
          backgroundColor:'#edf6f6',
          borderRadius:"5px",
        },
        bar:{
          backgroundColor:'#2d5253',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#2d5253',
        },
      },
    },
  },
})


const Planeer = ({ products, productFilters, fetchProduct }) => {
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [comida, setComida] = useState([]);
  const [activeStep, setActiveStep]= useState(0); //Stepper
  const [name,setName] = useState('Hugo Test desde Planeer'); //Cambiar a null
  const [foodsNumbers, setFoodsNumbers]=useState(3); //Cambiar a 1
  const [calories, setCalories]=useState(3000); //Cambiar a null
  const [loading, setLoading] = useState(true);
  const [ productsLunes, AddProductLunes, setFoodNumbersLunes, imprimirCheckoutLunes]= useComida(0);
  const [ productsMartes, AddProductMartes, setFoodNumbersMartes,imprimirCheckoutMartes]= useComida(0);
  const [ productsMiercoles, AddProductMiercoles, setFoodNumbersMiercoles, imprimirCheckoutMiercoles]= useComida(0);
  const [ productsJueves, AddProductJueves, setFoodNumbersJueves, imprimirCheckoutJueves]= useComida(0);
  const [ productsViernes, AddProductViernes, setFoodNumbersViernes, imprimirCheckoutViernes]= useComida(0);
  const [ productsSabado, AddProductSabado, setFoodNumbersSabado, imprimirCheckoutSabado]= useComida(0);
  const [selectedDay, setSelectedDay] = useState('')
  const [email, setEmail] = UseLocalStorage("email", "");
  const [phone, setPhone] = UseLocalStorage("phone", "");
  const [methodPayCash, setMethodPayCash] = useState(true);
  const [methodPayCard, setMethodPayCard] = useState(false);
  const [date, setDate] = UseLocalStorage("date",moment(), moment.duration(30, "minutes"), "ceil");
  const [adress, setAdress] = useState("");
  const [comments, setComments] = useState("");
  const stripePromise = loadStripe("<pulishable_api_key>");

  const [days, setDays]=useState({
    lunes: true,
    martes: true,
    miercoles: true,
    jueves: true,
    viernes: true,
    sabado: true,
  }); //cambiar a false
  const {lunes, martes, miercoles, jueves, viernes, sabado} = days;
  const error = [lunes, martes, miercoles, jueves, viernes, sabado].filter((v)=>v).length !== 2;

  const handleFoodsPlus = () => {
    setFoodsNumbers((prevFoodsNumbers) => prevFoodsNumbers + 1);
  }

  const handleFoodsMenus = () => {
    if(foodsNumbers>1){
      setFoodsNumbers((prevFoodsNumbers) => prevFoodsNumbers - 1);
    }
  }

  const handleNext = ()=>{
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }

  const handleChangeCalories=(event)=>{
    setCalories(event.target.value);
  }

  const handleChangeAdress=(event)=>{
    setAdress(event.target.value);
  }

  const handleChangeCheckBox = (event) =>{
    setDays({
      ...days,
      [event.target.name]: event.target.checked,
    });
  }

  const isEmptyBasket=(dia)=>{
    let imagen='assets/imgs/theme/icons/check_plus.svg';
    switch(dia){
      case'lunes':
        if(productsLunes.length == foodsNumbers){
          imagen = 'assets/imgs/theme/icons/BambuBasket.png'
        }
      return(imagen)
      case'martes':
        if(productsMartes.length == foodsNumbers){
          imagen = 'assets/imgs/theme/icons/BambuBasket.png'
        }
      return(imagen)
      case'miercoles':
        if(productsMiercoles.length == foodsNumbers){
          imagen = 'assets/imgs/theme/icons/BambuBasket.png'
        }
      return(imagen)
      case'jueves':
        if(productsJueves.length == foodsNumbers){
          imagen = 'assets/imgs/theme/icons/BambuBasket.png'
        }
      return(imagen)
      case'viernes':
        if(productsViernes.length == foodsNumbers){
          imagen = 'assets/imgs/theme/icons/BambuBasket.png'
        }
      return(imagen)
      case'sabado':
        if(productsSabado.length == foodsNumbers){
          imagen = 'assets/imgs/theme/icons/BambuBasket.png'
        }
      return(imagen)
    }
  }

  const sendForm = () => {
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
        if(days.lunes){
          imprimirCheckoutLunes({
            paymentMethod: methodPayCash ? "Cash" : "Card",
              name: name,
              adress: adress,
              phone: phone,
              email: email,
              fecha: date,
              comments: '',
              numeroDia:1
          })
        }
        if(days.martes){
          imprimirCheckoutMartes({
            paymentMethod: methodPayCash ? "Cash" : "Card",
              name: name,
              adress: adress,
              phone: phone,
              email: email,
              fecha: date,
              comments: '',
              numeroDia:2
          })

        }
        if(days.miercoles){
          imprimirCheckoutMiercoles({
            paymentMethod: methodPayCash ? "Cash" : "Card",
              name: name,
              adress: adress,
              phone: phone,
              email: email,
              fecha: date,
              comments: '',
              numeroDia:3
          })

        }
        if(days.jueves){
          imprimirCheckoutJueves({
            paymentMethod: methodPayCash ? "Cash" : "Card",
              name: name,
              adress: adress,
              phone: phone,
              email: email,
              fecha: date,
              comments: '',
              numeroDia:4
          })
        }
        if(days.viernes){
          imprimirCheckoutViernes({
            paymentMethod: methodPayCash ? "Cash" : "Card",
              name: name,
              adress: adress,
              phone: phone,
              email: email,
              fecha: date,
              comments: '',
              numeroDia:5
          })
        }
        if(days.sabado){
          imprimirCheckoutSabado({
            paymentMethod: methodPayCash ? "Cash" : "Card",
              name: name,
              adress: adress,
              phone: phone,
              email: email,
              fecha: date,
              comments: '',
              numeroDia:6
          })
        }
      }
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const busqueda = await getProducts.getProductsComplete();
      //const categoria = await ecwid.getCategories({parent:0, productIds : true});
      setProductos(busqueda);
      const filtro = [];
      const filtroCalorias = [];
      if(calories != 0 && foodsNumbers != 0){
        const calculo = calories / foodsNumbers
        busqueda.map((producto)=>{
          if(producto.attributes.length > 0){
            producto.attributes.map((atributo) =>{
              if(atributo.name === 'Contenido Energético (kcal)')
              {
                if(atributo.value <= calculo + 20)
                {
                  filtroCalorias.push(producto)
                }
              }
            })
          }
        })
        setComida(filtroCalorias)
      }
      setLoading(false);
    })();
  }, [calories,foodsNumbers]);

  //__________________________________________________________________________Modal para Planner Diario
  const [isOpenModalPlanner, openModalPlanner, closeModalPlanner] = useModal(false);
  const setModalPlanner=(dia)=>{
    setSelectedDay(dia);
    setFoodNumbersLunes(foodsNumbers);
    setFoodNumbersMartes(foodsNumbers);
    setFoodNumbersMiercoles(foodsNumbers);
    setFoodNumbersJueves(foodsNumbers);
    setFoodNumbersViernes(foodsNumbers);
    setFoodNumbersSabado(foodsNumbers);
    openModalPlanner();
  }

  const ModalPlanner =({isOpenModalPlanner, closeModalPlanner, openModalPlanner, products,selectedDay}) => {
    const AddProducts=(product)=>{
      switch (selectedDay){
        case 'lunes':
          return ( AddProductLunes(product) )
        case 'martes':
          return( AddProductMartes(product) )
        case 'miercoles':
          return( AddProductMiercoles(product) )
        case 'jueves':
          return( AddProductJueves(product) )
        case 'viernes':
          return( AddProductViernes(product) )
        case 'sabado':
          return( AddProductSabado(product) )
      }
    }

    const checkStatusProducts=(producto)=>{
      let estado = false
      switch (selectedDay){
        case 'lunes':
          if(productsLunes.length > 0){
            productsLunes.map((product)=>{
              if(product.id === producto.id){
                estado = true
              }
            })
          }
        return (estado);
        case 'martes':
          if(productsMartes.length > 0){
            productsMartes.map((product)=>{
              if(product.id === producto.id){
                estado = true
              }
            })
          }
        return (estado);
        case 'miercoles':
          if(productsMiercoles.length > 0){
            productsMiercoles.map((product)=>{
              if(product.id === producto.id){
                estado = true
              }
            })
          }
        return (estado);
        case 'jueves':
          if(productsJueves.length > 0){
            productsJueves.map((product)=>{
              if(product.id === producto.id){
                estado = true
              }
            })
          }
        return (estado);
        case 'viernes':
          if(productsViernes.length > 0){
            productsViernes.map((product)=>{
              if(product.id === producto.id){
                estado = true
              }
            })
          }
        return (estado);
        case 'sabado':
          if(productsSabado.length > 0){
            productsSabado.map((product)=>{
              if(product.id === producto.id){
                estado = true
              }
            })
          }
        return (estado);
      }
    }
    
    return(
      <Modal isOpen={isOpenModalPlanner} closeModal={closeModalPlanner} openModal={openModalPlanner} >
        <>
          {loading ? 
          (
            <div className="col-12">
              <div className=" h-20 rounded-xl justify-center flex flex-col items-center p-1">
                <BeatLoader color={"#325454"} size={10} className="mb-10" />
                <h4 className="text-center text-xs">
                  Cargando productos de Bambú
                </h4>
              </div>
            </div>
          ):(
            <div>
              <h3>Selecciona {foodsNumbers} comidas para tu pedido diario.</h3>
            <div className="py-3">
              {products.length > 0 ? (
                <div className="row">
                  {products.map((l, i) => (
                    <div key={i} className="col-lg-6 col-md-6 col-6 col-sm-6">
                      {checkStatusProducts(l) &&
                        <img src={`/assets/imgs/theme/icons/check.svg`} width="32px" height="32px" id='item-check' />
                      }
                      <div className="product-cart-wrap mb-30">
                        <div className="product-img-action-wrap">
                          <div className="product-img product-img-zoom">  
                            <a onClick={()=>{AddProducts(l)}}>
                              <img
                                className="default-img"
                                src={l.imageUrl}
                                alt=""
                              />
                            </a>
                          </div>
                        </div>
                        <div className="product-content-wrap">
                          <div className="product-category">
                              <a>{l.googleItemCondition}</a>
                          </div>
                          <h2>
                              <a>{l.name}</a>
                          </h2>
                          <div className="product-price">
                            <span>${l.price} </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="col-12">
                  <div className=" h-20 rounded-xl justify-center flex flex-col items-center p-1">
                    <MdError size={40} className="mb-5" />
                    <h4 className="text-center text-xs">
                      No hay productos de Bambú
                    </h4>
                  </div>
                </div>
              )}
            </div>
            </div>
          )
          }
        </>
      </Modal>
    )
  }
  //____________________________________________________________________________________________________

  return (
    <>
      <Layout parent="Inicio" sub="Planner Semanal" >
        <div className="container">
          <ThemeProvider theme={theme}>
            <Box sx={{ flexGrow: 1}}>
              <MobileStepper
                variant="progress"
                steps={8}
                position="static"
                activeStep={activeStep}
                sx={{ 
                  flexGrow: 1,
                }}
                nextButton={
                  <Button onClick={handleNext} disabled={activeStep === 7}>
                    Siguiente
                  </Button>
                }
                backButton={
                  <Button onClick={handleBack} disabled={activeStep === 0}>
                    Atrás
                  </Button>
                }
              />  
              {activeStep === 0 &&
                  <Box sx={{ py: 5}}>
                    <div className="container">
                      <div className="row align-items-center text-center">
                        <div className="row align-items-center text-center">
                          <h2 className="fw-900">Bienvenido al</h2>
                        </div>
                        <div className="row align-items-center text-center">
                          <h1 className="text-brand">Planeador Semanal</h1>
                        </div>
                        <div className="row align-items-center text-center">   
                          <h1 className="text-brand">de <strong className="fw-900 text-brand">Club Bambu </strong></h1>
                        </div>
                        <div className="row pt-10 text-center align-items-center">
                          <div className="col-lg-4 col-md-4 col-12 col-sm-12 pt-2"><h3 className="text-brand"><a>¿Qué es?</a></h3></div>
                          <div className="col-lg-4 col-md-4 col-12 col-sm-12 pt-2"><h3 className="text-brand"><a>¿Cómo funciona?</a></h3></div>
                          <div className="col-lg-4 col-md-4 col-12 col-sm-12 pt-2"><h3 className="text-brand"><a>Ayuda</a></h3></div>
                          <div className="cart-action text-center py-8">
                            <a className="btn " onClick={handleNext}>¡Comenzar Ahora!</a>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </Box>
                }

                {activeStep ===1 &&
                  <Box sx={{ py: 5}}>
                    <div className="container">
                      <div className="row align-items-center text-center">
                        <div className="">
                          <h2 className="">El primer paso...</h2>
                        </div>
                        <div className="pt-10">
                          <h1 className="text-brand fw-900">¿Cuál es tu nombre completo?</h1>
                        </div>
                        <div className="row py-10 text-center">
                          <TextField
                            id="standard-size-normal"
                            label=""
                            value={name}
                            onChange={(e)=>{setName(e.target.value)}}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Person />
                                </InputAdornment>
                              ),
                            }}
                            variant="standard"
                            color="success"
                            focused
                          />
                        </div>
                      </div>
                    </div>
                  </Box>
                }

                {activeStep ===2 &&
                 <Box sx={{py: 5}}>
                 <div className="container">
                   <div className="row align-items-center text-center">
                     <div className="">
                       <h2 className="">Gracias {name}</h2>
                     </div>
                     <div className="pt-10">
                       <h1 className="text-brand fw-900">Selecciona los días de la semana en los que te quieres nutrir</h1>
                     </div>
                     <div className="row py-10 text-center">
                      <FormControl
                        required
                        error={error}
                        component="fieldset"
                        sx={{ m:3}}
                        variant="standard"
                      >
                        <FormGroup>
                          <FormControlLabel
                            control={ <Checkbox sx={{color: '#2d5253', '&.Mui-checked':{color: '#2d5253'} }} checked={lunes} onChange={handleChangeCheckBox} name="lunes" />}
                            label="Lunes"
                          />
                          <FormControlLabel 
                            control={<Checkbox sx={{color: '#2d5253', '&.Mui-checked':{color: '#2d5253'} }} checked={martes} onChange={handleChangeCheckBox} name ="martes" />}
                            label="Martes"/>
                          <FormControlLabel 
                            control={<Checkbox sx={{color: '#2d5253', '&.Mui-checked':{color: '#2d5253'} }} checked={miercoles} onChange={handleChangeCheckBox} name ="miercoles" />}
                            label="Miercoles"/>
                          <FormControlLabel 
                            control={<Checkbox sx={{color: '#2d5253', '&.Mui-checked':{color: '#2d5253'} }} checked={jueves} onChange={handleChangeCheckBox} name ="jueves" />}
                            label="Jueves"/>
                          <FormControlLabel 
                            control={<Checkbox sx={{color: '#2d5253', '&.Mui-checked':{color: '#2d5253'} }} checked={viernes} onChange={handleChangeCheckBox} name ="viernes" />}
                            label="Viernes"/>
                          <FormControlLabel 
                            control={<Checkbox sx={{color: '#2d5253', '&.Mui-checked':{color: '#2d5253'} }} checked={sabado} onChange={handleChangeCheckBox} name ="sabado" />}
                            label="Sabado"/>
                          </FormGroup>
                      </FormControl>
                    </div>
                   </div>
                 </div>
               </Box>
                }

                {activeStep === 3 &&
                  <Box sx={{ py: 5}}>
                    <div className="container">
                    <div className="row align-items-center text-center">
                      <div className="">   
                        <h1 className="text-brand"><strong className="fw-900">¿Cuantas comidas quieres hacer por día? </strong></h1>
                      </div>
                      <div className="p-5">   
                        <h1 className="text-brand">
                          <strong className="fw-900" style={{"fontSize": "100px"}}>
                            <a className="p-3" onClick={handleFoodsMenus}> - </a>{foodsNumbers}<a className="p-3" onClick={handleFoodsPlus}> + </a>
                          </strong>
                        </h1>
                      </div>
                    </div>
                  </div>
                  </Box>
                }

                {activeStep === 4 &&
                  <Box sx={{py: 5}}>
                    <div className="container">
                      <div className="row align-items-center text-center">
                        <div className="">
                          <h2 className="">Ahora...</h2>
                        </div>
                        <div className="">   
                          <h1 className="text-brand"><strong className="fw-900">Selecciona el rango de calorías indicado para ti </strong></h1>
                        </div>
                        <div className="p-5">
                          <FormControl sx={{ m:1, minWidth: 300 }}>
                            <Select
                              value={calories}
                              onChange={handleChangeCalories}
                              defaultValue={1000}
                              inputProps={{'aria-label': 'Without label' }}
                              color="success"
                            >
                              <MenuItem value={1000}>1000 Kcal</MenuItem>
                              <MenuItem value={2000}>2000 Kcal</MenuItem>
                              <MenuItem value={3000}>3000 Kcal</MenuItem>
                              <MenuItem value={4000}>4000 Kcal</MenuItem>
                              <MenuItem value={5000}>5000 Kcal</MenuItem>
                              <MenuItem value={6000}>6000 Kcal</MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                      </div>
                    </div>
                  </Box>
                }

                {activeStep === 5 &&
                  <Box sx={{ py: 5}}>
                    <div className="container">
                      <div className="row align-items-center text-center">
                        <div className="">
                          <h2 className="">
                            Gracias {name}, nos encargaremos de tu nutrición los días 
                            {Object.entries(days).map((dia)=>(
                              <>
                                {(dia[1] == true) && 
                                  <strong className="text-brand">
                                    {` ${dia[0]},`}
                                  </strong>
                                }
                              </>
                            ))}
                            Seleccionaste <strong className="text-brand">{calories} Kcal</strong> diarías repartidas en 
                            <strong className="text-brand"> {foodsNumbers} comidas al día.</strong> 
                          </h2>
                          <br/>
                        </div>

                        <div className="tab-content wow fadeIn animated">
                          <div className="tab-pane fade show active">
                            <div className="product-grid-4 row">
                              {Object.entries(days).map((dia,key)=>(
                                <>
                                  {(dia[1] == true) && 
                                    <div key={key} className="col-lg-4 col-md-3 col-6 col-sm-6">
                                      <div className="product-cart-wrap mb-30">
                                        <div className="product-content-wrap">
                                          <div className="product-category">
                                          </div>
                                          <h2>
                                            <a>{dia[0]}</a>
                                          </h2>
                                        </div>
                                        <div className="product-img-action-wrap">
                                          <div className="product-img product-img-zoom">
                                            <a onClick={(e) => {setModalPlanner(dia[0]);}} >
                                              <img
                                                className="default-img"
                                                src={isEmptyBasket(dia[0])}
                                                alt=""
                                              />
                                            </a>
                                          </div>
                                        </div>
                                        <div className="product-content-wrap">
                                          <div className="product-category">
                                            <a> Añade hasta {foodsNumbers} comidas </a>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  }
                                </>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </Box>
                }

                {activeStep === 6 &&
                  <Box sx={{ py: 5}}>    
                    {loading === true ? (
                      <div className="col-12">
                        <div className=" h-20 rounded-xl justify-center flex flex-col items-center p-1">
                          <BeatLoader color={"#325454"} size={10} className="mb-10" />
                          <h4 className="text-center text-xs">Cargando Información</h4>
                        </div>
                      </div>
                    ):(
                      <>
                        <section className="product-tabs section-padding position-relative wow fadeIn animated">
                          <div className="container">
                            <div className="col-12">
                              <MuiPickersUtilsProvider utils={DateFnsUtils} locale={esLocale}>
                                <h2 className="ml-10">Completa tus datos</h2>
                                <form className="m-0">
                                  <h4 className="font-normal mb-2">Nombre completo*</h4>
                                  <input
                                    className="w-full"
                                    onChange={(e) => setName(e.target.value)}
                                    name="name"
                                    type="text"
                                    value={name}
                                  />
                                  <h4 className="font-normal mb-5 my-4">Correo electrónico*</h4>
                                  <input
                                    className="w-full"
                                    onChange={(e) => setEmail(e.target.value)}
                                    name="email"
                                    type="text"
                                    value={email}
                                  />
                                  <h4 className="font-normal mb-5 my-4">Numero de celular*</h4>
                                  <input
                                    className="w-full"
                                    onChange={(e) => setPhone(e.target.value)}
                                    name="phone"
                                    type="text"
                                    value={phone}
                                  />
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
                                    />
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
                                      />
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
                                    <h4 className="font-normal mb-6 my-4">Fecha de Inicio del plan Bambú (1 mes)*</h4>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                      <MobileDatePicker 
                                        label="Comenzar a partir del día"
                                        minDate={addDays(new Date(),1)}
                                        value={date}
                                        onChange={(newValue) => {
                                          setDate(newValue.toString());
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                      />
                                    </LocalizationProvider>
                                    <h4 className="font-normal mb-5 my-4">
                                      Dirección de entrega*
                                    </h4>
                                    <FormControl sx={{ m:1, minWidth: 300}}>
                                      <Select
                                        native
                                        value={adress}
                                        onChange={handleChangeAdress}
                                        label="Elige un punto de entrega"
                                        inputProps={{'aria-label': 'Without label'}}
                                        
                                      >
                                        <optgroup label='Lomas Studio'>
                                          <option value='Administración, Lomas Estudio '>Administración</option>
                                          <option value='Ballet, Lomas Estudio '>Ballet</option>
                                          <option value='Carrito Bambú, Lomas Estudio '>Carrito Bambú</option>
                                          <option value='Comedor, Lomas Estudio '>Comedor</option>
                                          <option value='Estacionamiento, Lomas Estudio '>Estacionamiento</option>
                                          <option value='Gradas de gimnasia, Lomas Estudio'>Gradas de gimnasia</option>
                                          <option value='Kinder, Lomas Estudio'>Kinder</option>
                                          <option value='Recepción, Lomas Estudio'>Recepción</option>
                                          <option value='Tae Kwon Do, Lomas Estudio'>Tae Know Do</option>
                                          <option value='Vigilancia, Lomas Estudio'>Vigilancia</option>
                                        </optgroup>
                                        <optgroup label='Torre Falcón'>
                                          <option 
                                            value='Piso 12 (Uno TV), Presa Falcón 150, Col. Irrigación, Miguel Hidalgo, 11500 Ciudad de México, CDMX'
                                          >
                                            Piso 15 (Uno TV)
                                          </option>
                                        </optgroup>
                                        <optgroup label='Torre Telcel'>
                                          <option value={'Piso 13, Torre Telcel'}>Piso 13</option>
                                        </optgroup>
                                        <optgroup label='Torre Zurich'>
                                          <option 
                                            value='ZTE, Torre Frisco, C. Lago Zurich 245, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX'
                                          >
                                            ZTE
                                          </option>
                                          <option 
                                            value='Carso, Torre Frisco, C. Lago Zurich 245, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX'
                                          >
                                            Carso
                                          </option>
                                          <option 
                                            value='Ctin, Torre Frisco, C. Lago Zurich 245, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX'
                                          >
                                            Ctin
                                          </option>
                                          <option 
                                            value='Chemours, Torre Frisco, C. Lago Zurich 245, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX'
                                          >
                                            Chemours
                                          </option>
                                          <option 
                                            value='Ocupado, Torre Frisco, C. Lago Zurich 245, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX'
                                          >
                                            Ocupado
                                          </option>
                                          <option 
                                            value='Weatherford, Torre Frisco, C. Lago Zurich 245, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX'
                                          >
                                            Weatherford
                                          </option>
                                          <option 
                                            value='Grupak (Piso 7), Torre Frisco, C. Lago Zurich 245, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX'
                                          >
                                            Grupak (Piso 7)
                                          </option>
                                          <option 
                                            value='Los Mexgas, Torre Frisco, C. Lago Zurich 245, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX'
                                          >
                                            Los Mexgas
                                          </option>
                                          <option 
                                            value='La Costeña, Torre Frisco, C. Lago Zurich 245, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX'
                                          >
                                            La Costeña
                                          </option>
                                          <option 
                                            value='Intercam, Torre Frisco, C. Lago Zurich 245, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX'
                                          >
                                            Intercam
                                          </option>
                                          <option 
                                            value='Grupo Piagui, Torre Frisco, C. Lago Zurich 245, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX'
                                          >
                                            Grupo Piagui
                                          </option>
                                          <option 
                                            value='X-Elio, Torre Frisco, C. Lago Zurich 245, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX'
                                          >
                                            X-Elio
                                          </option>
                                          <option 
                                            value='Grupak (Piso 11), Torre Frisco, C. Lago Zurich 245, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX'
                                          >
                                            Grupak (Piso 11)
                                          </option>
                                          <option 
                                            value='Telling Device, Torre Frisco, C. Lago Zurich 245, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX'
                                          >
                                            Telling Device
                                          </option>
                                          <option 
                                            value='Royal Canin, Torre Frisco, C. Lago Zurich 245, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX'
                                          >
                                            Royal Canin
                                          </option>
                                          <option 
                                            value='Flores Lozano, Torre Frisco, C. Lago Zurich 245, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX'
                                          >
                                            Flores Lozano
                                          </option>
                                          <option 
                                            value='Inpros, Torre Frisco, C. Lago Zurich 245, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX'
                                          >
                                            Inpros
                                          </option>
                                          <option 
                                            value='Peñaranda, Torre Frisco, C. Lago Zurich 245, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX'
                                          >
                                            Peñaranda
                                          </option>
                                          <option 
                                            value='Inverse, Torre Frisco, C. Lago Zurich 245, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX'
                                          >
                                            Inverse
                                          </option>
                                          <option 
                                            value='Commscope, Torre Frisco, C. Lago Zurich 245, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX'
                                          >
                                            Commscope
                                          </option>
                                          <option 
                                            value='Principal México, Torre Frisco, C. Lago Zurich 245, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX'
                                          >
                                            Principal México
                                          </option>
                                          <option 
                                            value='EGT México, Torre Frisco, C. Lago Zurich 245, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX'
                                          >
                                            EGT México
                                          </option>
                                          <option 
                                            value='Ordás Howden, Torre Frisco, C. Lago Zurich 245, Amp Granada, Miguel Hidalgo, 11529 Ciudad de México, CDMX'
                                          >
                                            Ordás Howden
                                          </option>

                                        </optgroup>
                                        <optgroup label='Otras'>
                                          <option value={'Esto es una opcion indiviual5'}>Opcion 1</option>
                                        </optgroup>
                                      </Select>
                                    </FormControl>
                                    {/*<input
                                      className="w-full"
                                      onChange={(e) => setAdress(e.target.value)}
                                      name="addres"
                                      type="text"
                                      value={adress}
                                      />*/}
                                </form>
                                <div className="cart-action text-center">
                                  <a className="btn " onClick={() => sendForm()}>
                                    Realizar compra
                                  </a>
                                </div>
                              </MuiPickersUtilsProvider>
                            </div>
                          </div>
                        </section>
                      </>
                    )};
                  </Box>
                }

                {activeStep ===7 &&
                  <Box sx={{ height: 255, width: '100%', p: 10}}>
                    <div className="container">
                      <div className="row align-items-center text-center">
                        <div className="">
                          <h2 className="fw-900">Paso:{activeStep}</h2>
                          Gracias por tu compra te llegara un ticket y los datos de tus pedidos por correo electronico
                        </div>
                      </div>
                    </div>
                  </Box>
                }

              </Box>
              </ThemeProvider>
          </div>
      </Layout>

      <ModalPlanner
        isOpenModalPlanner={isOpenModalPlanner}
        closeModalPlanner={closeModalPlanner}
        openModalPlanner={openModalPlanner}
        products={comida}
        selectedDay={selectedDay}
      />
    </>
  );
};








const mapStateToProps = (state) => ({
  products: state.products,
  productFilters: state.productFilters,
});

const mapDidpatchToProps = {
  // openCart,
  fetchProduct,
  // fetchMoreProduct,
};

export default connect(mapStateToProps, mapDidpatchToProps)(Planeer);
