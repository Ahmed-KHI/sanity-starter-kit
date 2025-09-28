import { type SchemaTypeDefinition } from 'sanity';
import { category } from './category';
import { product } from './product';
import { user } from './user';
import { order } from './order';
import { wishlist } from './wishlist';
import { discount } from './discount';

export const schemaTypes: SchemaTypeDefinition[] = [
    category,
    product,
    user,
    order,
    wishlist,
    discount
];
