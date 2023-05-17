import configs from '../../tsconfig.json'

export const PRODUCTS_ENDPOINT =  `${configs.compilerOptions.baseUrl}/api/v1/products/`
export const TEXT_COMPLETION_ENDPOINT =  `http://localhost:5000/api/v1/assistant/?dish=`