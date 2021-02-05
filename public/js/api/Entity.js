/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */
class Entity {
    /**
     * Запрашивает с сервера список данных.
     * Это могут быть счета или доходы/расходы
     * (в зависимости от того, что наследуется от Entity)
     * */
    static list(data, callback) {
        let url = this.URL;

        if (data) {
            url += `?account_id=${data}`;
        }

        createRequest({
            url,
            method: 'GET',
            responseType: 'json',
            data: null,
            callback: (err, response) => {
                callback(err, response);
            }
        });
    }

    /**
     * Создаёт счёт или доход/расход с помощью запроса
     * на сервер. (в зависимости от того,
     * что наследуется от Entity)
     * */
    static create(data, callback) {
        createRequest({
            url: this.URL,
            method: 'PUT',
            responseType: 'json',
            data,
            callback: (err, response) => {
                callback(err, response);
            }
        });
    }

    /**
     * Удаляет информацию о счёте или доходе/расходе
     * (в зависимости от того, что наследуется от Entity)
     * */
    static remove(data, callback) {

    }
}