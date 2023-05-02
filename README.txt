How to setup application:
- Download xampp for server and db hosting
- Optional Android studio/Xcode (iOS) for emulator or Expo if on your phone

Backend setup (sportmeetup-server):
1. go to terminal 
2. type npm install
3. type npx prisma generate
4. open xampp, start mysql and apache
5. create database on phpmyadmin named "joineve"
6. type npx prisma migrate dev
7. type npx prisma db seed
8. type npm run dev to run server

Frontend setup(sportmeetup-app): 
1. go to terminal
2. type yarn
3. setup baseURL in file internalAPI to your IP
4. npm run start to run app
5. scan qr code on your phone or open emulator
