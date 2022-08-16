import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateProductFilters } from "../../redux/action/productFiltersAction";

const DayFilter = ({ updateProductFilters }) => {
    const days = [
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
        { value: 5 },
        { value: 6 },
    ];

    const [selectedDays, setDays] = useState([]);
    const [active, setActive] = useState(0);

    useEffect(()=>{
        const filters = {
            days: selectedDays,
        };

        updateProductFilters(filters);
    },[selectedDays])

    const handleClick = (i, target) => {
        setDays(target);
        setActive(active == i ? 0 : i);
    };

    /*const selectDay = (i, day) => {
        // e.preventDefault();
        updateProductFilters(day);
        // router.push('/')
        setActive(active == i ? 0 : i);
    };*/

    
    return (
        <>
            <ul className="categor-list">
                {days.map((item, i) => (
                    <li onClick={() => handleClick(i, item.value)} key={i}>
                        <a
                            className={
                                active == i
                                    ? "cat-item text-brand"
                                    : "cat-item text-muted"
                            }
                        >
                            {`${item.value} Días`}
                        </a>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default connect(null, { updateProductFilters })(DayFilter);
