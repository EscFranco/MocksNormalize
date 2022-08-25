import { faker } from '@faker-js/faker';
faker.locale = 'es'

const newProducto = () => {
    return {
        producto: faker.commerce.product(),
        precio: faker.commerce.price(),
        imagen: faker.image.image()
    }
}

export default newProducto