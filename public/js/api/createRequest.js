/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const f = function() {},
        {
            method = 'GET',
            callback = f,
            responseType,
            async = true,
            data = {}
        } = options,
        xhr = new XMLHttpRequest();
    xhr.responseType = responseType;

    xhr.onload = function() {
        if (xhr.status === 200) {
            callback(xhr.response);
        }
    }

    xhr.onerror = function() {
        callback(null, `запрос по адресу ${options.url} не был успешен`);
    }

    xhr.open(method, options.url, async);
    xhr.send(data);




};