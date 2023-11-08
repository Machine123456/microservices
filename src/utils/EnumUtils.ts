
export interface IEnumKeyValue{
    key : string;
    value : string;
}

export function getEnumKeyFromEnumValue(
    _enum: Object,
    enumValue: string
  ): string {
    for (const [key, value] of Object.entries(_enum)) {
      if (enumValue === value) {
        return key;
      }
    }
  
    throw Error(`Unexpected enum value : ${enumValue}`);
  }
  
  export function getEnumValueFromEnumKey(
    _enum: Object,
    enumKey: string
  ): string {
    for (const [key, value] of Object.entries(_enum)) {
      if (enumKey === key) {
        return value;
      }
    }
  
    throw Error(`Unexpected enum key : ${enumKey}`);
  }
  
  export function getEnumKeyValues(_enum: Object): IEnumKeyValue[] {
    const enumKeyValues: IEnumKeyValue[] = [];
  
    for (const [key, value] of Object.entries(_enum)) {
      const item: IEnumKeyValue = { key, value };
      enumKeyValues.push(item);
    }
  
    return enumKeyValues;
  }