export const baseUrl = process.env.REACT_APP_API_ORIGIN

export const endPoint = {
    SIGNIN: `${baseUrl}/google/signin`,
    REGISTER: `${baseUrl}/google/register`,
    CARD_SERIAL_TO_UID: `${baseUrl}/tune-card/serial-to-uid`,
    CARD_TUNE_REGISTER: `${baseUrl}/tune-card/register-serial-and-uid`,
    UPLOAD_IMAGE: `${baseUrl}/generateS3PreSignedUrl`,
    ADD_SEED: `${baseUrl}/seed/add`,
    FETCH_SEED: `${baseUrl}/seed/fetch`,
    ADD_CUSTOM_URL: `${baseUrl}/customUrl/add`,
    FETCH_CUSTOM_URL: `${baseUrl}/customUrl/fetch`,
}