import Product from '../models/Product'
import {PRODUCTS_ENDPOINT} from '../endpoints'
import axios from 'axios';

export const getProducts = async () => {
    let products = await axios.get(PRODUCTS_ENDPOINT)
    return products?.data?.map((item) => new Product(item.name, item.price, item.description))
}