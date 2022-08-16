import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateProductFilters } from "../../redux/action/productFiltersAction";

const FoodFilter = ({ updateProductFilters }) => {
    const foods = [
        {value: 1},
        {value: 2},
        {value: 3},
        {value: 4},
        {value: 5},
        {value: 6},
    ];


    const [selectedFoods, setFoods] = useState([]);
    const [active, setActive] = useState(0);

    useEffect(() => {
        const filters = {
            foods: selectedFoods,
        };

        updateProductFilters(filters);
    }, [selectedFoods]);

    const handleClick = (i, target) => {
        setFoods(target);
        setActive(active == i ? 0 : i);
    };

    return (
        <>
        <ul className="categor-list">
        {foods.map((tag, i) => (
                    <li onClick={() => handleClick(i, tag.value)} key={i}>
                        <a
                            className={
                                active == i
                                    ? "cat-item text-brand"
                                    : "cat-item text-muted"
                            }
                        >
                            {`${tag.value} Comidas`}
                        </a>
                    </li>
                ))}
        </ul>
          
        </>
    );
};

const mapStateToProps = (state) => ({
    products: state.products.items,
});

const mapDidpatchToProps = {
    updateProductFilters,
};

export default connect(mapStateToProps, mapDidpatchToProps)(FoodFilter);
