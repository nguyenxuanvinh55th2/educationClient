cd ~/java/educationClient/
rm -rf dist/*
meteor-client bundle --url "https://dinhvanquang.xyz/admin"
time npm run build
rsync -av -e "ssh -p 22" dist/. root@188.166.229.24:/var/www/tuielearning/static --delete
# rsync -av -e "ssh -p 22" images/. root@fog0.s2corp.vn:/var/www/data/images
scp ~/java/educationClient/dist/index.html root@188.166.229.24:/var/www/tuielearning
