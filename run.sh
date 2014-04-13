# todo: check out watchify
echo "Browserifying stuff"
./node_modules/browserify/bin/cmd.js \
	-r ./lib/color.js:color \
	> public/javascripts/color.js

echo "Running node.js server"
node app.js