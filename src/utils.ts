export async function sendRequest(apiKey: string, uri: string, data?: Record<string, string | number>) {
    const response = await fetch(`https://aaio.so/api${uri}`, {
        method: 'POST',
        body: new URLSearchParams(
            data ? Object.entries(data).map(([key, val]) => [key, String(val)]) : [],
        ),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Api-Key': apiKey
        }
    });
    return await response.json();
}
