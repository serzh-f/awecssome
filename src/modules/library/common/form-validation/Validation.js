let mainConfig = {
    errorMessages : {
        inputErrorClassName : '_error'
    }
};

export default new class Validation {
    constructor() {
        this.error = '.form__requirements';
        this.errroAnimateSpeed = 250;
        this.bindEvents();
    }

    isFormValid($form) {
        let inputs = $form.find('input, textarea'),
            isFormValid = true;

        $form.attr('novalidate', 'novalidate');

        for (let i = 0; i < inputs.length; i++) {
            if (!this.validateInput(inputs[i])) {
                isFormValid = false;
            }
        }
        return isFormValid;
    }

    validateInput (input) {
        let isCurrentInputValid = input.checkValidity(),
            $input = $(input);

        if (!isCurrentInputValid) {
            $input.addClass(mainConfig.errorMessages.inputErrorClassName);
            this.showError($input);
        } else {
            $input.removeClass(mainConfig.errorMessages.inputErrorClassName);
            this.hideError($input);
        }

        return isCurrentInputValid;
    }

    showError($input) {
        let $error = $input.siblings(this.error);

        $error.animate({
            height: 14
        }, this.errroAnimateSpeed, () => {
        });
    }

    hideError($input) {
        let $error = $input.siblings(this.error);

        $error.animate({
            height: 0
        }, this.errroAnimateSpeed, () => {
        });
    }

    bindEvents() {
        //check input validity on blur
        $(document).on('blur', 'input[required], textarea[required]', (e) => {
            let isCurrentInputValid = e.target.checkValidity(),
                $currentInput = $(e.target);

            if ($(e.target).hasClass('js-phone')) {
                isCurrentInputValid = e.target.value.match(/[+][0-9]{3}\s[0-9]{2}\s[0-9]{3}-[0-9]{2}-[0-9]{2}/);
            }

            if ($(e.target).hasClass('js-workingHoursInput')) {
                let firstCharOfStr = e.target.value.substring(0, 1);

                switch (firstCharOfStr) {
                    case '0':
                        isCurrentInputValid = e.target.value.match(/^[0][0-9]:[0-5][0-9]$/);
                        break;

                    case '1':
                        isCurrentInputValid = e.target.value.match(/^[1][0-9]:[0-5][0-9]$/);
                        break;

                    case '2':
                        isCurrentInputValid = e.target.value.match(/^[2][0-4]:[0-5][0-9]$/);
                        break;
                }
            }

            if (isCurrentInputValid) {
                $currentInput.removeClass(mainConfig.errorMessages.inputErrorClassName);
            } else {
                $currentInput.addClass(mainConfig.errorMessages.inputErrorClassName);
            }
        });
    }

    removeErrors($form) {
        let inputs = $form.find('input, textarea');

        for (let i = 0; i < inputs.length; i++) {
            $(inputs[i]).removeClass(mainConfig.errorMessages.inputErrorClassName);
        }
    }
};

//:invalid:not(:focus):not(:placeholder-shown)