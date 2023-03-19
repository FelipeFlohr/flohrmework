/**
 * Error thrown when no method was found in the place
 * where an endpoint decorator has been annotated.
 * 
 * @since 19/03/2023
 * @author Felipe Matheus Flohr
 */
export default class NoMethodFoundError extends Error {
    public constructor(key: string) {
        super(`No method found in key ${key}.`);
    }
}