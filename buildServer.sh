cd ~/education/educationServer/
meteor build --directory ../build
rsync -av -e "ssh -p 22" ../build/bundle root@fog0.s2corp.vn:/opt/tuielearning
rsync -av -e "ssh -p 22" public/imgs/. root@fog0.s2corp.vn:/var/www/data/images
cd ../educationClient
