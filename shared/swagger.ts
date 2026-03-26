export type HttpStatus = number;

export type SwaggerDocs = {
    "users/login": {
        method: "POST";
        output:
            | {
                  ok: boolean;
                  status: HttpStatus;
                  message: string;
                  body: undefined;
              }
            | {
                  ok: boolean;
                  status: HttpStatus;
                  message: string;
                  body: {
                      token: string;
                  };
              };
        input: {
            email: string;
            password: string;
        };
    };

    "users/logout": {
        method: "GET";
        output: {
            ok: boolean;
            status: HttpStatus;
            message: string;
        };
        input: undefined;
    };

    "users/register": {
        method: "POST";
        output: {
            ok: boolean;
            status: HttpStatus;
            message: string;
        };
        input: {
            full_name: string;
            email: string;
            password: string;
        };
    };
};
