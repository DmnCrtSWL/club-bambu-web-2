import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateProductFilters } from "../../redux/action/productFiltersAction";

const CaloriesRange = ({ updateProductFilters }) => {

    const Router = useRouter();
    const searchTerm = Router.query.search;

    const [price, setPrice] = useState({ value: { min: 0, max: 500 } });
    const [active, setActive] = useState(0);

    useEffect(() => {
        const filters = {
            price: price.value,
        };

        updateProductFilters(filters);
    }, [price, searchTerm]);

    const data = [
        {
            min: 1000,
            max: 1200,
        },
        {
            min: 1200,
            max: 1500,
        },
        {
            min: 1500,
            max: 1700,
        },
        {
            min: 1700,
            max: 2000,
        },
        {
            min: 2000,
            max: 2500,
        },
        {
            min: 2500,
            max: 3000,
        },
        {
            min: 3000,
            max: 3500,
        },
        {
            min: 3500,
            max: 4000,
        },
    ];

    const handleClick = (i, min, max) => {
        setActive(active == i ? 0 : i);
        setPrice({ value: { min, max } });
    };

    return (
        <>
            <ul className="categor-list">
                {data.map((item, i) => (
                    <>
                        <li onClick={() => handleClick(i, item.min, item.max)} key={i}>
                            <a
                                className={
                                    active == i
                                        ? "cat-item text-brand"
                                        : "cat-item text-muted"
                                }
                            >
                                {`${item.min} kcal - ${item.max} kcal`}
                            </a>
                        </li>
                    </>
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

export default connect(mapStateToProps, mapDidpatchToProps)(CaloriesRange);
