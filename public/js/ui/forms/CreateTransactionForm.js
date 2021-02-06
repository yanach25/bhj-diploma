/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
    /**
     * Вызывает родительский конструктор и
     * метод renderAccountsList
     * */
    constructor(element) {
        super(element);
    }

    /**
     * Получает список счетов с помощью Account.list
     * Обновляет в форме всплывающего окна выпадающий список
     * */
    renderAccountsList() {
        Account.list(User.current(), (err, response) => {
            if (err) {
                return;
            }
            if (!response.data) {
                return;
            }

            const select = this.element.querySelector('.accounts-select');
            console.log(select, response);

            response.data.forEach((item, index) => {
                select.options[index] = new Option(item.name, item.id);
            });
        });

    }

    /**
     * Создаёт новую транзакцию (доход или расход)
     * с помощью Transaction.create. По успешному результату
     * вызывает App.update(), сбрасывает форму и закрывает окно,
     * в котором находится форма
     * */
    onSubmit(data) {

    }
}