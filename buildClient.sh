cd ~/education/educationClient/
rm -rf dist/*
meteor-client bundle --url "https://tuielearning.s2corp.vn/admin"
time npm run build
rsync -av -e "ssh -p 22" dist/. root@fog0.s2corp.vn:/var/www/tuielearning/static --delete
# rsync -av -e "ssh -p 22" images/. root@fog0.s2corp.vn:/var/www/data/images
scp ~/education/educationClient/dist/index.html root@fog0.s2corp.vn:/var/www/tuielearning
