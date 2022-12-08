# Express Rest APIS
## Installation
1. Install Modules
    ```bash
    npm install
    ```
    yarn
    ```
    yarn install
    ```
2. Run
- Dev
    ```bash
    npm run dev
    ```
- Start
    ```bash
    npm run start
    ```
## Endpoint
- **Tiktok**
    ```
    /api/tiktok?url={TiktokUrl}
    ```
- **Pixiv**
    ```
    /api/pixiv?mode={mode}&query={query}&random={random}&r18={r18}
    ```
    - eg
    ```
    /api/pixiv?mode=search&query=fgo&random=1&r18=1
    ```
    ```sh
    mode = ['search', 'get']
    query = string || int
    random = [0, 1] // 0 = false, 1 = true
    r18 = [0, 1] // 0 = false, 1 = true

    notes:
        if mode is 'get'
        and the query is not id from pixiv
        it will return random result
    ```
- **Youtube**
    ```
    /api/youtube?url={url}
    ```
 - **Image cecan**
    ```
    /api/image/cecan
    ```
- **18 xnxx**
    ```
    /api/18/xnxx/search?query={query}
    ```
    ```
    /api/18/xnxx/download?url={url}
    ```
