import { v4 as uuidv4 } from 'uuid';
import foo from 'demo-first/foo';

export default {
  foo,
  bar: {
    id: uuidv4(),
  },
};
