export interface Product {
    plant_ID: number;
    plant_name: string;
    plant_description: string;
    plant_price: number;
    plant_rating: number;
    plant_image: string;
}

export interface User {
    user_ID: number;
    user_name: string;
    user_email: string;
    user_password: string;
    user_role: string;
}

export interface Cart {
    cart_ID: number;
    user_ID: number;
    plant_ID: number;
    quantity: number;
}

export interface Variation {
    variation_ID: number;
    plant_ID: number;
    variation_name: string;
    variation_price: number;
    variation_stock: number;
}