export default class NoMethodFoundError extends Error {
    public constructor(key: string) {
        super(`No method found in key ${key}.`)
    }
}