import { APIRequestContext } from "@playwright/test";
import { API_USERS_ENDPOINT } from "@data/api_endpoints_data";


// export async function createNewContext() {
//     return await request.newContext()
// }

// export async function createUser(request: APIRequestContext, data: any) {
//     await request.post(
//         API_USERS_ENDPOINT,
//         {data: user}
//     )
//
//     return await getUserId(created, 'id')
//     // return await created.json().then((entries) => entries[0].id)
// }

export async function deleteUsers(request: APIRequestContext) {
    await request.delete(API_USERS_ENDPOINT);
}


// export async function deleteUser(request: APIRequestContext) {
//     await request.delete(API_USERS_ENDPOINT);
// }

export async function deleteAllUsers(request: APIRequestContext) {
    await request.delete(API_USERS_ENDPOINT)
}

export function getResponseStatus(response: { status: () => any; }) {
    return response.status()
}

const headersArray = (response: { headersArray: () => any; }) => {
    return response
        .headersArray();
}

export function getContentTypeHeaderValue(response: { headersArray: () => any; }) {
    return headersArray(response)
        .find((header: { name: string; }) => header.name === 'Content-Type')
        .value;
}

export async function getResponseBodyText(response: { text: () => any; }) {
    return await response.text();
}

export async function getResponseBodyJson(response: { json: () => any; }) {
    return await response.json();
}

export function isResponseIsArray(response: { json: () => any; }) {
    return Array.isArray(getResponseBodyJson(response))
}

export function getLengthUserId(userId: string | any[]) {
    return userId.length
}

export async function getUserId(response: { json: () => Promise<any>; }, k: string) {
    return await response.json().then((entries) => entries[0][k])
}

export async function getJsonValueByKey(response: { json: () => Promise<any>; }, k: string | number) {
    return await response.json().then((entries) => entries[k])
}

// export async function createUsers(request: APIRequestContext) }) {
//     for (const [key, value] of Object.entries(users)) {
//         await request.post(
//             `${BASE_URL}${USERS_END_POINT}`,
//             {data: value}
//         )
//     }
// }

export async function createUsers(request: APIRequestContext, data: any) {
    for (const [key, value] of Object.entries(data)) {
        await request.post(
            `${API_USERS_ENDPOINT}`,
            {data: value}
        )
    }
}
