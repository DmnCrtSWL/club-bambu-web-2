import FoodFilter from './FoodFilter';
import DayFilter from './DayFilter';
import CaloriesFilter from './CaloriesFilter';
//import Rating from './Rating';
//import SizeFilter from './SizeFilter';
//import Tags from './Tags';
//import ColorFilter from './ColorFilter';

const LifeStyleFilter = () => {
    return (
        <>
            <div className="shop-product-fillter-header">
                <div className="row">
                    <div className="col-lg-4 col-md-4 mb-lg-0 mb-md-5 mb-sm-5">
                        <h5 className="mb-20">¿Cuantos días quieres que te entreguemos la comida?</h5>
                        <DayFilter/>
                    </div>
                    <div className="col-lg-4 col-md-4 mb-lg-0 mb-md-5 mb-sm-5">
                        <h5 className="mb-20">¿Cuantas comidas al día necesitas hacer?</h5>
                        <FoodFilter/>
                    </div>
                    <div className="col-lg-4 col-md-4 mb-lg-0 mb-md-5 mb-sm-5">
                        <h5 className="mb-20">¿Cuantas Calorías necesitas comer?</h5>
                        <CaloriesFilter />
                    </div>
                    {/*<div className="col-lg-2 col-md-4 mb-lg-0 mb-md-5 mb-sm-5">
                        <h5 className="mb-20">By Tags</h5>
                        <Tags/>
                    </div>
                    <div className="col-lg-2 col-md-4 mb-lg-0 mb-md-5 mb-sm-5">
                        <h5 className="mb-20">By Color</h5>
                        <ColorFilter/>
                        <h5 className="mb-15 mt-20">By Size</h5>
                        <SizeFilter/>
                    </div>
                    <div className="col-lg-2 col-md-4 mb-lg-0 mb-md-5 mb-sm-5">
                        <h5 className="mb-20">By Review</h5>
                        <Rating/>                        
                    </div>*/}
                </div>
            </div>
        </>
    );
};

export default LifeStyleFilter;
