"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.failure = exports.success = void 0;
/** Define success and failure */
class Success {
    data;
    constructor(data) {
        this.data = data;
    }
    isSuccess() {
        return true;
    }
    isFailure() {
        return false;
    }
}
class Failure {
    error;
    constructor(error) {
        this.error = error;
    }
    isSuccess() {
        return false;
    }
    isFailure() {
        return true;
    }
}
const success = (data) => {
    return new Success(data);
};
exports.success = success;
const failure = (error) => {
    return new Failure(error);
};
exports.failure = failure;
