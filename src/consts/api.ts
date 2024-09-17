export const baseUrl = process.env.REACT_APP_API_ORIGIN

export const endPoint = {
    // USER
    SIGNIN: `${baseUrl}/google/signin`,
    REGISTER: `${baseUrl}/google/register`,
    // TUNE CARD
    TUNE_CARD: `${baseUrl}/tuneCards`,
    // SEED
    SEED: `${baseUrl}/seeds`,

    UPLOAD_IMAGE: `${baseUrl}/generateS3PreSignedUrl`,
    ADD_CUSTOM_URL: `${baseUrl}/customUrl/add`,
    FETCH_CUSTOM_URL: `${baseUrl}/customUrl/fetch`,
}