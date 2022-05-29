class MyError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status ? status : 500
    }

}


module.exports = MyError;