export interface ERSResponse {
        operation: string,
        messages: [
            {
                title: string;
                type: string;
                code: string;
            }
        ];
};