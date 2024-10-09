export const baseUrl = process.env.REACT_APP_API_ORIGIN

export const endPoint = {
    // AUTH
    SIGNIN: `${baseUrl}/google/signin`,
    REGISTER: `${baseUrl}/google/register`,
    // TUNE CARD
    TUNE_CARD: `${baseUrl}/tuneCards`,
    // PROFILE
    PROFILE: `${baseUrl}/profiles`,
    UPLOAD_PROFILE_IMAGE: `${baseUrl}/upload/profiles`,
    // SEED
    SEED: `${baseUrl}/seeds`,
    SAVE_SEED_AS_DRAFT: `${baseUrl}/save-as-draft`,
    UPLOAD_SEED_IMAGE: `${baseUrl}/upload/seeds`,
    // THINK
    THINK_TIMELINE: `${baseUrl}/thinks-timeline`,
    THINK: `${baseUrl}/thinks`,
    UPLOAD_THINK_IMAGE: `${baseUrl}/upload/think`,

    // UPLOAD
    UPLOAD_IMAGE: `${baseUrl}/upload`,
    DELETE_IMAGE: `${baseUrl}/delete`,

    ADD_CUSTOM_URL: `${baseUrl}/customUrl/add`,
    FETCH_CUSTOM_URL: `${baseUrl}/customUrl/fetch`,
}