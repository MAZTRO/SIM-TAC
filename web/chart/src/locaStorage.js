import { makeApiRequest } from './helpers.js';

export const cacheExist =  async function (reference, path) {
    const cacheList = window.localStorage.getItem(reference);
    if (cacheList) {
        return JSON.parse(cacheList);
    }
    else {
        const data = await makeApiRequest(path);
        window.localStorage.setItem(reference, JSON.stringify(data));
        return data;
    }
}

