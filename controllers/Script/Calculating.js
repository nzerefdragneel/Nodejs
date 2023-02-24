module.exports = {
    calculating: (x, y, calc) => {
        a = parseInt(x);
        b = parseInt(y);

        switch (calc) {
            case '+':
                return a + b;
                break;
            case '-':
                return a - b;
                break;
            case '*':
                return a * b;
                break;
            case '/':
                if (b == 0) {
                    throw 'Chia cho 0';
                    return false;
                    break;
                }
                return a / b;
                break;
            default:
                throw 'Không thực hiện được';
                return false;
                break;
        }
    },
    handle: (x, y, calc) => {
        if (isNaN(x))
            throw 'X không hợp lệ';
        if (isNaN(y))
            throw 'Y không hợp lệ';
        if (!calc)
            throw 'Chưa nhập phép tính';
        if (parseInt(y) == 0 && calc == '/')
            throw 'Chia cho 0'
        return true;
    }

};
