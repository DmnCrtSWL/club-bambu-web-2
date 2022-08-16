import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateProductFilters } from "../../redux/action/productFiltersAction";

const CaloriesFilter = ({ updateProductFilters }) => {
    const calories = [
        {value: 1000 },
        {value: 2000 },
        {value: 3000 },
        {value: 4000 },
        {value: 5000 },
        {value: 6000 },
    ];


    const [selectedCalories, setCalories] = useState([]);
    const [active, setActive] = useState(0);

    useEffect(() => {
        const filters = {
            calories: selectedCalories,
        };

        updateProductFilters(filters);
    }, [selectedCalories]);

    const handleClick = (i, target) => {
        setCalories(target);
        setActive(active == i ? 0 : i);
    };

    return (
        <>
        <ul className="categor-list">
        {calories.map((tag, i) => (
                    <li onClick={() => handleClick(i, tag.value)} key={i}>
                        <a
                            className={
                                active == i
                                    ? "cat-item text-brand"
                                    : "cat-item text-muted"
                            }
                        >
                            {`${tag.value} kcal`}
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

export default connect(mapStateToProps, mapDidpatchToProps)(CaloriesFilter);
