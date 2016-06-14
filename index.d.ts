declare module DeadSimpleAjax {
    interface options {
        onBeforeSend(request: XMLHttpRequest, verb: string, url: string): void;
        returnRawResponse: boolean;
    }

    function get<T>(url: string, payload?: any, options?: options): Promise<T>;
    function post<T>(url: string, payload?: any, options?: options): Promise<T>;
    function put<T>(url: string, payload?: any, options?: options): Promise<T>;
    function del<T>(url: string, payload?: any, options?: options): Promise<T>;
}

export = DeadSimpleAjax;