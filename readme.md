# it will install all the dependency
npm install

# copy your config in index.js

# to build the project
npm run build

# run the project via live server (install the live server extension in visual code)
    right click on "index.html"
    click on "Run with Live Server"

# to resolve cors issue
    gcloud auth login
    copy cors.json to root folder
    gsutil cors set cors.json gs://<bucket_name>

# for hosting
    firebase login
    firebase init
    firebase deploy