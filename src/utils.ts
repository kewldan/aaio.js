type JsonSerializable =
    | object
    | string
    | number
    | boolean
    | null
    | undefined
    | JsonSerializable[];

export function createSendRequest<KeyRequired extends boolean = false>(
    basePath: string,
    options?: { apiKeyRequired: KeyRequired },
) {
    return async function sendRequestBase<Data extends JsonSerializable>(
        uri: string,
        {
            apiKey,
            data,
        }: {
            data?: Record<string, string | number>;
        } & (KeyRequired extends true ? { apiKey: string } : { apiKey?: never }),
    ): Promise<Data> {
        const headers: HeadersInit = {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
        };

        if (apiKey) {
            headers["X-Api-Key"] = apiKey
        }

        const response = await fetch(`https://aaio.so${basePath}${uri}`, {
            method: "POST",
            body: new URLSearchParams(
                data
                    ? Object.entries(data).map(([key, val]) => [key, String(val)])
                    : [],
            ),
            headers,
        });
        return await response.json();
    };
}

export const sendApiRequest = createSendRequest("/api", {apiKeyRequired: true});
export const sendMerchantRequest = createSendRequest("/merchant");
