.PHONY : help build

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
	# Concat & minify JS
	jammit -c jammit.yml -o build/js
	# Uncomment minified js / remove dev.js
	sed -i 's/<!-- scripts concatenated/<!-- scripts concatenated -->/' build/*.html
	sed -i 's/\/scripts concatenated -->/<!-- \/scripts concatenated -->/' build/*.html
	sed -i '/<!-- scripts development -->/,/<!-- \/scripts development -->/d' build/*.html
	@echo "Done!"

clean:
	@echo "Cleaning..."
	rm -rf ./build
	@echo "Done!"
