### Hw4 Messenger-Clone

### Install packages

```shell
npm i
```
### Setup .env file

```js
DATABASE_URL=
NEXTAUTH_SECRET=

PUSHER_APP_ID=
NEXT_PUBLIC_PUSHER_APP_KEY=
PUSHER_SECRET=
NEXT_PUBLIC_PUSHER_CLUSTER=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

GITHUB_ID=
GITHUB_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

#### MongoDB
點選 Network Access
![Alt text](image-1.png)
加入 0.0.0.0/0 的 IP位置
![Alt text](image.png)
選 MongoDB for VS Code 並複製到 DATABASE_URL
記得將"mongodb+srv://boyuancao58:<password>@cluster0.1gpztbq.mongodb.net/" 內的 password 改成你的密碼，並在最後加上 test

ex : "mongodb+srv://boyuancao58:123456789@cluster0.1gpztbq.mongodb.net/test"
![Alt text](image-2.png)

#### NEXTAUTH_SECRET
NEXTAUTH_SECRET 直接複製 NEXTAUTH_SECRET
ex : NEXTAUTH_SECRET="NEXTAUTH_SECRET"

#### Pusher
Pusher如同上上課範例
複製
id到PUSHER_APP_ID
key到NEXT_PUBLIC_PUSHER_APP_KEY
secret到PUSHER_SECRET
cluster到NEXT_PUBLIC_PUSHER_CLUSTER
![Alt text](image-3.png)

#### Cloudinary
到https://cloudinary.com/註冊一個帳號

到dashboard複製Cloud Name到env裡面的NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
![Alt text](image-4.png)

點選左下角設定
![Alt text](image-5.png)
進入upload
![Alt text](image-6.png)
點選Add upload preset
![Alt text](image-7.png)
設定成unsigned並儲存
![Alt text](image-8.png)
複製該新增的名稱到 next13-messenger\app\conversations\[conversationId]\components\Form.tsx裡的CldUploadButton裡的uploadPreset
![Alt text](image-9.png)
![Alt text](image-10.png)

#### Github OAuth
OAuth如同上上課範例到github弄一個OAuth Apps
Homepage URL和Authorization callback URL都填入http://localhost:3000
接著在env輸入對應的值


#### google cloud
到Google Cloud Platform的頁面點選左上專案並新增傳案
![Alt text](image-11.png)
等跑完點選"選取專案"
![Alt text](image-12.png)
找到已啟用的API和服務
![Alt text](image-13.png)
點選OAuth consent screen，並選擇外部
![Alt text](image-14.png)
命名專案並在使用者支援電子郵件和開發人員聯絡資訊填入自己的email
一直儲存

到憑證建立憑證點選OAuth用戶端ID
![Alt text](image-15.png)

選擇網頁應用程式
在已授權的重新導向 URI
填入http://localhost:3000/api/auth/callback/google
![Alt text](image-16.png)
接著在env輸入對應的值


### Setup Prisma

```shell
npx prisma db push

```

### Start the app

```shell
npm run dev
```

在使用時須填入已註冊的email不能亂填

## Available commands

Running commands with npm `npm run [command]`

| command         | description                              |
| :-------------- | :--------------------------------------- |
| `dev`           | Starts a development instance of the app |
