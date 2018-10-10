#! /usr/bin/env bash
openssl aes-256-cbc -K $encrypted_7bed071027e5_key -iv $encrypted_7bed071027e5_iv -in .travis/muffin.enc -out .travis/muffin -d
chmod 600 .travis/muffin
echo -e "Host $deploy_host\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
eval "$(ssh-agent -s)" # start the ssh agent
ssh-add .travis/muffin

git remote add deploy $deploy_user@$deploy_host:$deploy_uri
git push deploy master

ssh $deploy_user@$deploy_host "cd $deploy_uri && \
	docker-compose up --build -d && \
	sleep 5 && \
	docker-compose ps"
