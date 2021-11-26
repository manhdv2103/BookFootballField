const invalidFeedbackList = [
    'Hãy chọn sân muốn đặt.',
    'Hãy điền tên của bạn.',
    'Tên không dài quá 50 kí tự.',
    'Hãy điền số điện thoại của bạn.',
    'Số điện thoại không dài quá 50 kí tự.',
    'Số điện thoại nhập vào không hợp lệ.',
    'Hãy chọn khung giờ muốn đặt.',
    'Hãy nhập số giờ muốn đặt.',
    'Chỉ được phép nhập số dương.',
    'Hãy nhập số người chơi.',
    'Hãy nhập số đội chơi.',
    'Chỉ được phép nhập số nguyên dương.'
];
const needValidationInputs = document.getElementsByClassName('needs-validation');
const totalInputs = document.getElementsByClassName('for-total-calculation');
const urlParams = new URLSearchParams(window.location.search);

// Check if the input is valid
// If it is return true, else return false
function isInputValid(elem) {
    const input = elem.currentTarget || elem;
    let inputLength = input.value.length;

    const invalidMessage = input.parentElement.getElementsByClassName('invalid-message')[0];
    let invalidFeedbackId;
    let isValid = false;

    // Check every possible error cases
    if (inputLength == 0) {
        switch (input.id) {
            case 'fields-selector':
                invalidFeedbackId = 0;
                break;
            case 'booker-name':
                invalidFeedbackId = 1;
                break;
            case 'tel':
                invalidFeedbackId = 3;
                break;
            case 'time-selector':
                invalidFeedbackId = 6;
                break;
            case 'numof-hours':
                invalidFeedbackId = 7;
                break;
            case 'numof-players':
                invalidFeedbackId = 9;
                break;
            case 'numof-teams':
                invalidFeedbackId = 10;
                break;
        }
    } else if (input.validity.patternMismatch) {
        switch (input.id) {
            case 'booker-name':
                invalidFeedbackId = 2;
                break;
            case 'tel':
                invalidFeedbackId = inputLength > 50 ? 4 : 5;
                break;
            case 'numof-hours':
                invalidFeedbackId = 8;
                break;
            case 'numof-players':
            case 'numof-teams':
                invalidFeedbackId = 11;
                break;
        }
    } else isValid = true;

    invalidMessage.innerText = invalidFeedbackList[invalidFeedbackId];
    return isValid;
}

// Validate all the inputs that need to be validated
function validateAllInputs() {
    let isAllValid = true;

    for (const input of needValidationInputs) {
        let isLastValid = isAllValid;
        if (!isInputValid(input)) isAllValid = false;
        if (isLastValid !== isAllValid) input.focus();
    }
}

// Calculate the total booking cost and display it
function sumTotal() {
    const total = document.getElementById('total');
    const uniform = document.getElementById('extra-service2');
    const referee = document.getElementById('extra-service3');

    let isAllValid = true;
    for (const input of totalInputs) {
        if (!isInputValid(input) && !(input.id === 'numof-teams' && !uniform.checked)) {
            isAllValid = false;
        }
    }

    // Calculate booking cost only if all the relevant inputs are valid
    if (isAllValid) {
        let hourlyPrice = parseInt(document.getElementById('time-selector').value) || 0;
        let numOfHours = parseFloat(document.getElementById('numof-hours').value) || 0;
        let numOfTeams = parseInt(document.getElementById('numof-teams').value) || 0;

        let uniformPrice = uniform.checked ? parseInt(uniform.value) : 0;
        let refereePrice = referee.checked ? parseInt(referee.value) : 0;

        let sum = Math.ceil(numOfHours * (hourlyPrice + refereePrice) + numOfTeams * uniformPrice);
        total.innerText = sum.toLocaleString('vi-VN') + ' VNĐ';
        total.classList.remove('total-warning');
    } else {
        total.innerText = 'Hãy lựa chọn thông tin đặt sân';
        total.classList.add('total-warning');
    }
}

// Show all information of the selected field
function showFieldInfo(fieldId) {
    function setDisplayFieldInfo(fieldInfo) {
        for (let i = 0; i < fieldInfo.length; i++) {
            fieldInfo[i].style.display = i == fieldId ? 'inline' : '';
        }
    }

    if (fieldId !== '') {
        setDisplayFieldInfo(document.getElementsByClassName('field-addr'));
        setDisplayFieldInfo(document.getElementsByClassName('field-contact'));
    }
}

// Validate form when users submit
const form = document.getElementById('booking-form');
form.addEventListener(
    'submit',
    function (event) {
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();

            validateAllInputs();
            for (input of needValidationInputs) {
                input.addEventListener('input', isInputValid);
                input.addEventListener('blur', isInputValid);
            }
        } else {
            alert(
                `Bạn đã nhập đúng tất cả dữ liệu.\nTổng tiền của bạn là ${
                    document.getElementById('total').innerText
                }.`
            );
        }

        sumTotal();
        form.classList.add('was-validated');
    },
    false
);

// Show all information of the field that users have selected in another page
const fieldSelection = document.getElementById('fields-selector');
fieldSelection.value = urlParams.get('bookedFieldId') || '';
showFieldInfo(fieldSelection.value);
