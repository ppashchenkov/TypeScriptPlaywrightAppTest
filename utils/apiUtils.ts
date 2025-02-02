import {request} from "@playwright/test";
import * as TEST_DATA from "../testData/testData";
import {users} from "../testData/usersTestData";
import {BASE_URL, USERS_END_POINT} from "../testData/testData";

export async function createNewContext() {
    return await request.newContext()
}

export async function createUser(request: { post: (arg0: string, arg1: { data: any; }) => any; }, user: any) {
    const created = await request.post(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT,{
        data: user
    })
    return await getUserId(created, 'id')
    // return await created.json().then((entries) => entries[0].id)
}

export async function deleteUser(request: { delete: (arg0: string) => any; }, userId: string) {
    await request.delete(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT + userId)
}

export async function deleteAllUsers(request: { delete: (arg0: string) => any; }) {
    await request.delete(TEST_DATA.BASE_URL + TEST_DATA.USERS_END_POINT)
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

export async function createUsers(request: { post: (arg0: string, arg1: { data: { firstName: string; lastName: string; age: string; } | { firstName: string; lastName: string; age: string; } | { firstName: string; lastName: string; age: string; } | { firstName: string; lastName: string; age: string; } | { firstName: string; lastName: string; age: string; }; }) => any; }) {
    for (const [key, value] of Object.entries(users)) {
        await request.post(
            `${BASE_URL}${USERS_END_POINT}`,
            {data: value}
        )
    }
}
