import { KeyValue } from '../models/types';

const mapToKeyValue = (obj: Object) =>
  Object.entries(obj).map(
    o => ({ key: o[0], value: o[1] } as KeyValue),
  );

export default mapToKeyValue;
