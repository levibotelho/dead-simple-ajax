var gulp = require("gulp");
var eslint = require("gulp-eslint");

gulp.task("default", function () {
	return gulp.src("./index.js")
		.pipe(eslint())
		.pipe(eslint.formatEach())
		.pipe(eslint.failAfterError());
});