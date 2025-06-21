

const API_BASE_URL = 'https://localhost:7053/api';

/**
 * Função genérica para fazer requisições à API.
 * @param {string} endpoint - O endpoint da API (ex: 'Clientes').
 * @param {RequestInit} options - Opções para a requisição fetch (method, headers, body).
 * @returns {Promise<any>} - A resposta da API em JSON ou vazia.
 */
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Erro na API: ${response.status} ${response.statusText}. Detalhes: ${errorBody}`);
        }

        if (response.status === 204) {
            return;
        }

        return response.json();
    } catch (error) {
        console.error('Falha na comunicação com a API:', error);
        alert(`Erro ao comunicar com o servidor: ${error.message}`);
        throw error; 
    }
}

/**
 * Busca dados da API (GET).
 * @param {string} endpoint -
 * @returns {Promise<any>}
 */
export function fetchData(endpoint) {
    return apiRequest(endpoint);
}

/**
 * Envia dados para a API (POST).
 * @param {string} endpoint 
 * @param {object} data 
 * @returns {Promise<any>}
 */
export function postData(endpoint, data) {
    return apiRequest(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}

/**
 * Atualiza dados na API (PUT).
 * @param {string} endpoint 
 * @param {number|string} id 
 * @param {object} data 
 * @returns {Promise<any>}
 */
export function putData(endpoint, id, data) {
    return apiRequest(`${endpoint}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}

/**
 * Deleta dados na API (DELETE).
 * @param {string} endpoint 
 * @param {number|string} id 
 * @returns {Promise<any>}
 */
export function deleteData(endpoint, id) {
    return apiRequest(`${endpoint}/${id}`, {
        method: 'DELETE',
    });
}
