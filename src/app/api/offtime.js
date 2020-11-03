import axios from '../axios';

// Offtime
export async function searchOfftimeApi(data) {
    try {
        return await axios.post('offtime/search', data);
    }
    catch (e) {
        return null;
    }
}

// Flextime
export async function saveFlextimeApi(data) {
    try {
        return await axios.post('flextime/save', data);
    }
    catch (e) {
        return null;
    }
}
export async function deleteFlextimeApi(data) {
    try {
        return await axios.post('flextime/delete', data);
    }
    catch (e) {
        return null;
    }
}
export async function getFlextimeApi(data) {
    try {
        return await axios.post('flextime/get', data);
    }
    catch (e) {
        return null;
    }
}

// Dayoff
export async function getHoursApi(data) {
    try {
        return await axios.post('hours/get', data);
    }
    catch (e) {
        return null;
    }
}
export async function getDayOffApi(data) {
    try {
        return await axios.post('dayoff/get', data);
    }
    catch (e) {
        return null;
    }
}
export async function saveDayOffApi(data) {
    try {
        return await axios.post('dayoff/save', data);
    }
    catch (e) {
        return null;
    }
}
export async function deleteDayOffApi(data) {
    try {
        return await axios.post('dayoff/delete', data);
    }
    catch (e) {
        return null;
    }
}