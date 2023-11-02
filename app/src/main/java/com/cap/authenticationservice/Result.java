package com.cap.authenticationservice;

public class Result<T> {

    public static <T> Result<T> of(T value) {
        return new Result<T>(value);
    }

    public static <T> Result<T> ofError(String errorMsg) {
        return new Result<T>(errorMsg);
    }

    private T value;
    private String errorMsg;

    public Result(){
        value = null;
        errorMsg = "";
    }

    public Result(T value) {
        this.value = value;
        errorMsg = "";
    }

    public Result(String errorMsg){
        value = null;
        this.errorMsg = errorMsg;
    }

    public T get()  {
        return value;
    }

    public boolean isPresent() {
        return value != null;
    }

    public String getErrorMsg() {
        return isPresent() ? "" : errorMsg;
    }

    
}