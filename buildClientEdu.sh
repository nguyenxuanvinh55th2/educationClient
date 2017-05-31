cd ~/education/educationClient/
rm -rf dist/*
meteor-client bundle --url "http://13.228.29.146:3000/admin"
time npm run build
rsync -av -e "ssh -p 22" dist/. root@13.228.29.146:/var/www/elearning/static --delete
# rsync -av -e "ssh -p 22" images/. root@fog0.s2corp.vn:/var/www/data/images
scp ~/education/educationClient/dist/index.html root@13.228.29.146:/var/www/elearning
