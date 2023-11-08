import { FC, useState } from 'react';
import './GenericEnumBasedSelect.css';
import { getEnumKeyFromEnumValue, getEnumKeyValues, getEnumValueFromEnumKey } from '../../../utils/EnumUtils';

interface GenericEnumBasedSelectProps {
    _enum: object;
    changeHandler: (newOption: string) => void;
    selectedValue: string;
}

const GenericEnumBasedSelect: FC<GenericEnumBasedSelectProps> = ({
    _enum,
    changeHandler,
    selectedValue,
}) => {

    const [active, setActive] = useState(false);
    const array = getEnumKeyValues(_enum);
    const selectedKey = getEnumKeyFromEnumValue(_enum, selectedValue);

    const optionElems =
        <div className="options">
            {array.map((it, i) => (
                <div className={"option" + (selectedKey === it.key ? " selected" : "")} 
                    onClick={() => {
                        changeHandler(it.value);
                        setActive(prev => !prev);
                    }} key={i}>
                    <p> {it.value} </p>
                </div>
            ))}
        </div>;

    return (
        <div className='selector'>
            <div className={'select' + (active ? " active" : "")}
                onClick={() => setActive(prev => !prev)} >
                <p>{selectedValue}</p>
            </div>
            {active && optionElems}
        </div>
    );

};

export default GenericEnumBasedSelect;