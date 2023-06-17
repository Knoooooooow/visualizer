export let APP_SETTINGS = {
    mode: 'side',
    hasBackdrop: false,
    opened: true
}
export function SET_APP_SETTINGS(value: typeof APP_SETTINGS) {
    APP_SETTINGS = value
}