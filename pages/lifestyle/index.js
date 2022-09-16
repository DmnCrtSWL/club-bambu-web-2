import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import BrandFilter from "../../components/ecommerce/BrandFilter";
import CategoryProduct from "../../components/ecommerce/CategoryProduct";
import Pagination from "../../components/ecommerce/Pagination";
import PriceRangeSlider from "../../components/ecommerce/PriceRangeSlider";
import QuickView from "../../components/ecommerce/QuickView";
import ShowSelect from "../../components/ecommerce/ShowSelect";
import SingleProductPlaneer from "../../components/ecommerce/SingleProductPlaneer";
import SizeFilter from "../../components/ecommerce/SizeFilter";
import SortSelect from "../../components/ecommerce/SortSelect";
import WishlistModal from "../../components/ecommerce/WishlistModal";
import LifeStyleFilter from "../../components/lifestyle/Filter"
import Layout from "../../components/layout/Layout";
import { fetchProduct } from "../../redux/action/product";
import Link from "next/link";
import ecwid from "../../util/ecwid";
import { size } from "lodash";
import getProducts from "../../util/getProducts";
import { toast } from "react-toastify";
//import { Button, Typography } from "@material-ui/core";
import {useTab} from '../../hooks/useTab';
import {usePlaneer} from '../../hooks/usePlaneer';
import { Box, Stepper, Step, StepContent, StepLabel, Button, Paper, Typography, MobileStepper} from '@mui/material/';
import { createTheme } from '@mui/material/styles';


import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import {Person,AccountCircle} from '@mui/icons-material/';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { FormLabel } from "react-bootstrap";
import { FormHelperText, MenuItem, Select } from "@material-ui/core";

const Planeer = ({ products, productFilters, fetchProduct }) => {
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [active, changeTab] = useTab('1');
  const [activeDay, changeTabDay] = useTab('1');
  const [desayuno, setDesayuno] = useState([]);
  const [comida, setComida] = useState([]);
  const [cena, setCena] = useState([]);
  const [market, setMarket] = useState([]);
  const [pedidoDiario, handleClick] = usePlaneer({initialValue:[] ,productFilters: productFilters});
  const [activeStep, setActiveStep]= useState(0); //Stepper
  const [name,setName] = useState('');
  const [foodsNumbers, setFoodsNumbers]=useState(1);
  const [calories, setCalories]=useState(0)
  const [days, setDays]=useState({
    lunes: true,
    martes: false,
    miercoles:false,
    jueves: false,
    viernes: false,
    sabado: false,
  });

  const {lunes, martes, miercoles, jueves, viernes, sabado} = days;
  const error = [lunes, martes, miercoles, jueves, viernes, sabado].filter((v)=>v).length !== 2;
  const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },});

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

  const handleReset=()=>{
    setActiveStep(0);
  }

  const handleChangeCalories=(event)=>{
    setCalories(event.target.value);
  }

  const handleChangeCheckBox = (event) =>{
    setDays({
      ...days,
      [event.target.name]: event.target.checked,
    });
    console.log(days)
  }

  useEffect(() => {
    (async () => {
      const busqueda = await getProducts.getProductsComplete();
      const categoria = await ecwid.getCategories({parent:0, productIds : true});
      const comida ={}
      const desayuno ={}
      const cena = {}
      const market = {}
      setProductos(busqueda)
      categoria.items.map((categoria) => {
        if (categoria.name === 'Comidas')
          comida = categoria
        else if (categoria.name === 'Desayunos')
          desayuno = categoria
        else if (categoria.name === 'Market')
          market = categoria
      });
      cena = comida //
      const filtro = [];
      //const filtro = busqueda
      busqueda.map((producto)=>{
        if(comida.productIds.includes(producto.id))
        filtro.push(producto)
      })
      console.log('Productos')
      const filtroCalorias = [];
      if(productFilters.calories != 0 && productFilters.foods != 0){
        const calculo = productFilters.calories / productFilters.foods
        console.log(`Calculo por comida: ${calculo} kcal`)
         filtro.map((producto)=>{
          if(producto.attributes.length > 0){
            producto.attributes.map((atributo) =>{
              if(atributo.name === 'Contenido Energético (kcal)')
              {
                if(atributo.value <= calculo + 20){
                  filtroCalorias.push(producto)
                }
              }
            })}
          })
        setComida(filtroCalorias)
        setCena(filtroCalorias)
      }else {
        setComida(filtro)
        setCena(filtro)
      }

      filtro = [];
      //const filtro = busqueda
      busqueda.map((producto)=>{
        if(desayuno.productIds.includes(producto.id))
        filtro.push(producto)
      })
      filtroCalorias = [];
      if(productFilters.calories != 0 && productFilters.foods != 0){
        const calculo = productFilters.calories / productFilters.foods
        console.log(`Calculo por comida: ${calculo} kcal`)
         filtro.map((producto)=>{
          if(producto.attributes.length > 0){
            producto.attributes.map((atributo) =>{
              if(atributo.name === 'Contenido Energético (kcal)')
              {
                if(atributo.value <= calculo + 20){
                  filtroCalorias.push(producto)
                }
              }
            })}
          })
        setDesayuno(filtroCalorias)
      }else{
        setDesayuno(filtro);
      }

      filtro = [];
      //const filtro = busqueda
      busqueda.map((producto)=>{
        if(market.productIds.includes(producto.id))
        filtro.push(producto)
      })
      filtroCalorias = [];
      if(productFilters.calories != 0 && productFilters.foods != 0){
        const calculo = productFilters.calories / productFilters.foods
        console.log(`Calculo por comida: ${calculo} kcal`)
         filtro.map((producto)=>{
          if(producto.attributes.length > 0){
            producto.attributes.map((atributo) =>{
              if(atributo.name === 'Contenido Energético (kcal)')
              {
                if(atributo.value <= calculo + 20){
                  filtroCalorias.push(producto)
                }
              }
            })}
          })
        setMarket(filtroCalorias)
      }else{
        setMarket(filtro);
      }

    })();
  }, [productFilters]);

  return (
    <>
      <Layout parent="Inicio" sub="Productos" >
        <section className="mt-50 mb-50">
          <div className="container">
            <div className="row">
              <Box sx={{ flexGrow: 1 }}>
                <MobileStepper
                  variant="progress"
                  steps={9}
                  position="static"
                  activeStep={activeStep}
                  sx={{ flexGrow: 1 }}
                  nextButton={
                    <Button size="small" onClick={handleNext} disabled={activeStep === 8}>
                      Siguiente
                    </Button>
                  }
                  backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                      Atrás
                    </Button>
                  }
                />  
                
                {activeStep === 0 &&
                  <Box sx={{ height: 255, width: '100%', p: 10}}>
                    <div className="container">
                      <div className="row align-items-center text-center">
                        <div className="">
                          <h2 className="fw-900">Bienvenido al</h2>
                        </div>
                        <div className="">
                          <h1 className="text-brand">Planeador Semanal</h1>
                        </div>
                        <div className="">   
                          <h1 className="text-brand">de <strong className="fw-900 text-brand">Club Bambu </strong></h1>
                        </div>

                        <div className="row pt-10 text-center">
                          <div className="col-4"><h3 className="text-brand"><a>¿Qué es?</a></h3></div>
                          <div className="col-4"><h3 className="text-brand"><a>¿Cómo funciona?</a></h3></div>
                          <div className="col-4"><h3 className="text-brand"><a>Ayuda</a></h3></div>
                          <div className="cart-action text-center p-8">
                            <a className="btn " onClick={handleNext}>¡Comenzar Ahora!</a>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </Box>
                }

                {activeStep ===1 &&
                  <Box sx={{ height: 255, width: '100%', p: 10}}>
                    <div className="container">
                      <div className="row align-items-center text-center">
                        <div className="">
                          <h2 className="">el primer paso...</h2>
                        </div>
                        <div className="pt-10">
                          <h1 className="text-brand fw-900">¿Cuál es tu nombre completo?</h1>
                        </div>

                        <div className="row pt-10 text-center">
                          <TextField
                            id="standard-size-normal"
                            label=""
                            value={name}
                            onChange={(e)=>{setName(e.target.value),console.log(name)}}
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
                          <div className="cart-action text-center p-8">
                            <a className="btn " onClick={handleNext}>¡Comenzar Ahora!</a>
                          </div>
                        </div>

                      </div>
                    </div>
                  </Box>
                }

                {activeStep ===2 &&
                 <Box sx={{ height: 255, width: '100%', p: 10}}>
                 <div className="container">
                   <div className="row align-items-center text-center">
                     <div className="">
                       <h2 className="">Gracias {name}</h2>
                     </div>
                     <div className="pt-10">
                       <h1 className="text-brand fw-900">Selecciona los días de la semana en los que te quieres nutrir</h1>
                     </div>

                     <div className="row pt-10 text-center">
                      <FormControl
                        required
                        error={error}
                        component="fieldset"
                        sx={{ m:3 }}
                        variant="standard"
                      >
                        <FormLabel component="legend">Pick two</FormLabel>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox checked={lunes} onChange={handleChangeCheckBox} name="lunes" />
                            }
                            label="Lunes"
                          />
                          <FormControlLabel 
                            control={<Checkbox checked={martes} onChange={handleChangeCheckBox} name ="martes" />}
                            label="Martes"/>
                          <FormControlLabel 
                            control={<Checkbox checked={miercoles} onChange={handleChangeCheckBox} name ="miercoles" />}
                            label="Miercoles"/>
                          <FormControlLabel 
                            control={<Checkbox checked={jueves} onChange={handleChangeCheckBox} name ="jueves" />}
                            label="Jueves"/>
                          <FormControlLabel 
                            control={<Checkbox checked={viernes} onChange={handleChangeCheckBox} name ="viernes" />}
                            label="Viernes"/>
                          <FormControlLabel 
                            control={<Checkbox checked={sabado} onChange={handleChangeCheckBox} name ="sabado" />}
                            label="Sabado"/>
                          </FormGroup>
                          <FormHelperText>You can display an error</FormHelperText>
                      </FormControl>
                      <div className="cart-action text-center p-8">
                        <a className="btn " onClick={handleNext}>Continuar</a>
                      </div>
                     </div>

                   </div>
                 </div>
               </Box>
                }

                {activeStep ===3 &&
                  <Box sx={{ height: 255, width: '100%', p: 10}}>
                    <div className="container">
                    <div className="row align-items-center text-center">
                      <div className="">   
                        <h1 className="text-brand"><strong className="fw-900">¿Cuantas comidas quieres hacer por día? </strong></h1>
                      </div>
                      <div className="p-5">   
                        <h1 className="text-brand">
                          <strong className="fw-900" style={{"font-size": "100px"}}>
                            <a className="p-3" onClick={handleFoodsMenus}> - </a>{foodsNumbers}<a className="p-3" onClick={handleFoodsPlus}> + </a>
                          </strong>
                        </h1>
                      </div>
                    </div>
                  </div>
                  </Box>
                }

                {activeStep ===4 &&
                  <Box sx={{ height: 300, width: '100%', p: 10}}>
                    <div className="container">
                      <div className="row align-items-center text-center">
                        <div className="">
                          <h2 className="">Ahora...</h2>
                        </div>
                        
                        <div className="">   
                          <h1 className="text-brand"><strong className="fw-900">Selecciona el rango de calorías indicado para ti </strong></h1>
                        </div>
                        <div className="p-5">
                          <FormControl sx={{ m:1, minWidth: 220}}>
                            <Select
                              value={calories}
                              onChange={handleChangeCalories}
                              
                              inputProps={{'aria-label': 'Without label'}}
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

                {activeStep ===5 &&
                  
                  <Box sx={{ height: 255, width: '100%', p: 10}}>
                    {activeStep}
                  <div className="container">
                    <div className="row align-items-center text-center">
                      <div className="">
                        <h2 className="">Gracias {name}, nos encargaremos de tu nutrición los días
                         { days.lunes && <strong className="text-brand"> Lunes, </strong>}
                          { days.martes && <strong className="text-brand">Martes, </strong>}
                          { days.miercoles && <strong className="text-brand">Miercoles, </strong>}
                          { days.jueves && <strong className="text-brand">Jueves, </strong>}
                          { days.viernes && <strong className="text-brand">Viernes, </strong>}
                          { days.sabado && <strong className="text-brand">Sabado </strong>}
                          . Seleccionaste <strong className="text-brand">{calories} Kcal</strong> diarías repartidas en 
                          <strong className="text-brand"> {foodsNumbers} comidas al día.</strong>
                          
                        </h2>
                      </div>
                      <div className="row pt-10 text-center">
                        <div className="cart-action text-center p-8">
                          <a className="btn " onClick={handleNext}>¡Comenzar Ahora!</a>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </Box>
                }

                {activeStep ===6 &&
                  <Box sx={{ height: 255, width: '100%', p: 10}}>
                    <div className="container">
                      <div className="row align-items-center text-center">
                        <div className="">
                        <h2 className="">Gracias {name}, nos encargaremos de tu nutrición los días
                         { days.lunes && <strong className="text-brand"> Lunes, </strong>}
                          { days.martes && <strong className="text-brand">Martes, </strong>}
                          { days.miercoles && <strong className="text-brand">Miercoles, </strong>}
                          { days.jueves && <strong className="text-brand">Jueves, </strong>}
                          { days.viernes && <strong className="text-brand">Viernes, </strong>}
                          { days.sabado && <strong className="text-brand">Sabado </strong>}
                          . Seleccionaste <strong className="text-brand">{calories} Kcal</strong> diarías repartidas en 
                          <strong className="text-brand"> {foodsNumbers} comidas al día.</strong>
                          
                        </h2>
                        </div>

                        <div className="row pt-10 text-center">
                          <div className="cart-action text-center p-8">
                            <a className="btn " onClick={handleNext}>¡Comenzar Ahora!</a>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </Box>
                }

                {activeStep ===7 &&
                  <Box sx={{ height: 255, width: '100%', p: 10}}>
                    <div className="container">
                      <div className="row align-items-center text-center">
                        <div className="">
                          <h2 className="fw-900">Paso:{activeStep}</h2>
                        </div>
                      </div>
                    </div>
                  </Box>
                }

                {activeStep ===8 &&
                  <Box sx={{ height: 255, width: '100%', p: 10}}>
                    <div className="container">
                      <div className="row align-items-center text-center">
                        <div className="">
                          <h2 className="fw-900">Paso:{activeStep}</h2>
                        </div>
                      </div>
                    </div>
                  </Box>
                }

              </Box>
            </div>
          </div>
        </section>
      </Layout>
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
