import { httpClient } from "../config/AxiosHelper";

export const createRoomApi = async (roomDetail) => {
    const response = await httpClient.post(`/api/v1/rooms`, roomDetail, {
        headers: {
            "Content-Type": "text/plain",
        },
    });
    return response.data;
};

export const getRoomStatus = async (roomID) => {
    const response = await httpClient.get(`/api/v1/rooms/${roomID}`, {
        headers: {
            "Content-Type": "text/plain",
        },
    });
    return response;
};



export const chatMessages = async (roomId, size = 50, page = 0) => {
    const response = await httpClient.get(`/api/v1/rooms/${roomId}/messages?size=${size}&page=${page}`);
    return response.data;
};

export const getRoomMembers = async (roomId) => {
    const response = await httpClient.get(`/api/v1/rooms/${roomId}/members`);
    return response.data; // returns list of usernames
};
