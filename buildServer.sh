cd ~/education/educationServer/
meteor build --directory ../build
rsync -av -e "ssh -p 22" ../build/bundle root@fog0.s2corp.vn:/opt/tuielearning
cd ../educationClient
