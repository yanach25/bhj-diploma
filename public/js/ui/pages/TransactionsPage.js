/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
    lastOptions;
    /**
     * Если переданный элемент не существует,
     * необходимо выкинуть ошибку.
     * Сохраняет переданный элемент и регистрирует события
     * через registerEvents()
     * */
    constructor(element) {
        if (!element) {
            throw new Error('Элемент не существует');
        }
        this.element = element;
    }

    /**
     * Вызывает метод render для отрисовки страницы
     * */
    update() {
        this.render();
    }

    /**
     * Отслеживает нажатие на кнопку удаления транзакции
     * и удаления самого счёта. Внутри обработчика пользуйтесь
     * методами TransactionsPage.removeTransaction и
     * TransactionsPage.removeAccount соответственно
     * */
    registerEvents() {
        const removeAccountBtn = this.element.querySelector('.remove-account');

        removeAccountBtn.onclick = () => {
            this.removeAccount();
        }

        const removeTransactions = document.querySelectorAll('.transaction__remove');
        removeTransactions.forEach(btn => {
            btn.onclick = () => {
                this.removeTransaction(btn.dataset.id);
            }
        })

    }

    /**
     * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
     * Если пользователь согласен удалить счёт, вызовите
     * Account.remove, а также TransactionsPage.clear с
     * пустыми данными для того, чтобы очистить страницу.
     * По успешному удалению необходимо вызвать метод App.update()
     * для обновления приложения
     * */
    removeAccount() {
        if (confirm('Удалить счет?')) {
            Account.remove(this.lastOptions.account_id, (err, response) => {
                if (response.success) {
                    this.clear();
                    App.update();
                }
            });
        }
    }

    /**
     * Удаляет транзакцию (доход или расход). Требует
     * подтверждеия действия (с помощью confirm()).
     * По удалению транзакции вызовите метод App.update()
     * */
    removeTransaction(id) {
        if (confirm('Удалить доход/расход?')) {
            Transaction.remove(id, (err, response) => {
                if (response.success) {
                    App.update();
                }
            });
        }

    }

    /**
     * С помощью Account.get() получает название счёта и отображает
     * его через TransactionsPage.renderTitle.
     * Получает список Transaction.list и полученные данные передаёт
     * в TransactionsPage.renderTransactions()
     * */
    render(options) {
        if (!options) {
            options = this.lastOptions;
        }

        if (options) {
            this.lastOptions = options;
            this.clear();

            Account.get(options.account_id, (err, response) => {
                if (response.success) {
                    this.renderTitle(response.data.name);
                }
            });

            Transaction.list(options.account_id, (err, response) => {
                if (response.success) {
                    this.renderTransactions(response.data);
                }
            })
        }
    }

    /**
     * Очищает страницу. Вызывает
     * TransactionsPage.renderTransactions() с пустым массивом.
     * Устанавливает заголовок: «Название счёта»
     * */
    clear() {
        this.renderTransactions([]);
        this.renderTitle('Название счёта');
    }

    /**
     * Устанавливает заголовок в элемент .content-title
     * */
    renderTitle(name) {
        const title = this.element.querySelector('.content-title');
        title.textContent = name;
    }

    /**
     * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
     * в формат «10 марта 2019 г. в 03:20»
     * */
    formatDate(date) {
        const newDate = new Date(date);
        const months = [
            'января',
            'февраля',
            'марта',
            'апреля',
            'мая',
            'июня',
            'июля',
            'августа',
            'сентября',
            'октября',
            'ноября',
            'декабря',
        ];

        const month = months[newDate.getMonth()];

        let hour = newDate.getHours();
        if (hour < 10) {
            hour = '0' + hour;
        }

        let minutes = newDate.getMinutes();
        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        return `${newDate.getDate()} ${month} ${newDate.getFullYear()} г. в ${hour}:${minutes}`;
    }

    /**
     * Формирует HTML-код транзакции (дохода или расхода).
     * item - объект с информацией о транзакции
     * */
    getTransactionHTML(item) {
        const el = document.createElement('div');
        el.className = `transaction transaction_${item.type} row`;
        el.innerHTML = `
            <div class="col-md-7 transaction__details">
              <div class="transaction__icon">
                  <span class="fa fa-money fa-2x"></span>
              </div>
              <div class="transaction__info">
                  <h4 class="transaction__title">${item.name}</h4>
                  <!-- дата -->
                  <div class="transaction__date">${this.formatDate(item.created_at)}</div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="transaction__summ">
              <!--  сумма -->
                  ${item.sum} <span class="currency">₽</span>
              </div>
            </div>
            <div class="col-md-2 transaction__controls">
                <!-- в data-id нужно поместить id -->
                <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                    <i class="fa fa-trash"></i>  
                </button>
            </div>
      `

        return el;
    }

    /**
     * Отрисовывает список транзакций на странице
     * используя getTransactionHTML
     * */
    renderTransactions(data) {
        const content = this.element.querySelector('.content');
        content.innerHTML = '';

        if (data.length) {
            data.forEach(item => {
                content.appendChild(this.getTransactionHTML(item));
            })
        }

        this.registerEvents();
    }
}