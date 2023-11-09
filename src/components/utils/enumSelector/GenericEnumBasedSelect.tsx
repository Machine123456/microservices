import { FC, useState } from 'react';
import './GenericEnumBasedSelect.css';
import { getEnumKeyFromEnumValue, getEnumKeyValues } from '../../../utils/EnumUtils';

interface GenericEnumBasedSelectProps {
    _enum: object;
    changeHandler: (newOption: string) => void;
    selectedValue: string;
    toValueString: (enumValue:string) => string
}

const GenericEnumBasedSelect: FC<GenericEnumBasedSelectProps> = ({
    _enum,
    changeHandler,
    selectedValue,
    toValueString
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
                    <p> {toValueString(it.value)} </p>
                </div>
            ))}
        </div>;

    return (
        <div className='selector'>
            <div className={'select' + (active ? " active" : "")}
                onClick={() => setActive(prev => !prev)} >
                <p>{toValueString(selectedValue)}</p>
            </div>
            {active && optionElems}
        </div>
    );

};

export default GenericEnumBasedSelect;