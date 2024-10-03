# unite-tune-web

# For Develope
## DevelopEnvironment
do this command on your localPC.
```shell
npm start
````

# For Production

## Deploy for FireBaseHosting

### before prepare
1. create environment file for "production" by this command
```shell
cp .env.local .env.production.local
```

2. edit content of ".env.production.local" for production value

### deploy
1. do this command in your localPC　　
```shell
npm run build
```
2. do this command in your localPC　　
do this command in your localPC　　
```shell
firebase deploy --only hosting:unite-core
```
