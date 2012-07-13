.PHONY : help build
BUILDID=$(shell date +%F.%H%M)

help:
	@echo "make build:"
	@echo "    build the webpage"
	@echo "make clean:"
	@echo "

build: clean
build:
	@echo "Building..."
	mkdir build
	# Copy images
	cp -r src/img build
	# Copy CSS
	cp -r src/css build
	# Copy HTML
	cd src && find -type f -name \*.html -exec cp {} ../build --parents \; && cd ..
	# Copy farbtastic
	cd src && cp -r js/lib/farbtastic js/lib/modernizr.js ../build --parents && cd ..
	# Concat & minify JS
	jammit -c jammit.yml -o build/js
	# Uncomment minified js / remove dev.js
	sed -i 's/<!-- scripts concatenated/<!-- scripts concatenated -->/' build/*.html
	sed -i 's/\/scripts concatenated -->/<!-- \/scripts concatenated -->/' build/*.html
	sed -i '/<!-- scripts development -->/,/<!-- \/scripts development -->/d' build/*.html
	# Add cache busting querystring to assets
	sed -i 's/{{BUILDID}}/'"$(BUILDID)"'/' build/*.html
	# Create a tar-ball
	tar -czvf "twitterfontana.$(BUILDID).tgz" build
	@echo "Done!"

clean:
	@echo "Cleaning..."
	rm -rf ./build
	rm twitterfontana.*.tgz
	@echo "Done!"
