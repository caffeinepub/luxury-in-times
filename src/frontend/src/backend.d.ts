import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Watch {
    id: bigint;
    name: string;
    description: string;
    company: string;
    isFeatured: boolean;
    modelNumber: string;
    gender: string;
    price: bigint;
    images: Array<Uint8Array>;
}
export interface CartItem {
    watchId: bigint;
    quantity: bigint;
}
export interface backendInterface {
    addToCart(userId: string, watchId: bigint, quantity: bigint): Promise<void>;
    addWatch(name: string, company: string, modelNumber: string, price: bigint, gender: string, description: string, images: Array<Uint8Array>, isFeatured: boolean): Promise<bigint>;
    clearCart(userId: string): Promise<void>;
    deleteWatch(id: bigint): Promise<void>;
    getAllWatches(): Promise<Array<Watch>>;
    getCart(userId: string): Promise<Array<CartItem>>;
    getCartTotal(userId: string): Promise<bigint>;
    getFeaturedWatches(): Promise<Array<Watch>>;
    getWatch(id: bigint): Promise<Watch | null>;
    removeFromCart(userId: string, watchId: bigint): Promise<void>;
    searchWatches(searchTerm: string): Promise<Array<Watch>>;
    updateCartItemQuantity(userId: string, watchId: bigint, quantity: bigint): Promise<void>;
    updateWatch(id: bigint, name: string, company: string, modelNumber: string, price: bigint, gender: string, description: string, images: Array<Uint8Array>, isFeatured: boolean): Promise<void>;
}
