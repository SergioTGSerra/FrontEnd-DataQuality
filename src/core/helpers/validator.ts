function validateMinDeg(rule, value, callback) {
    const minDeg = parseFloat(value);
    if (isNaN(minDeg)) {
        callback(new Error("Please enter a valid number"));
    } else if (minDeg < 0 || minDeg > 100) {
        callback(new Error("Min Validity must be between 0 and 100"));
    } else if (value.toString().includes(',')) {
        callback(new Error("Min Validity cannot contain a comma"));
    } else {
        callback();
    }
    }

export { validateMinDeg };