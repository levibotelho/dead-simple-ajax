var gulp = require("gulp");
var eslint = require("gulp-eslint");
var jasmine = require('gulp-jasmine');

gulp.task("lint", function () {
	return gulp.src("./index.js")
		.pipe(eslint())
		.pipe(eslint.formatEach())
		.pipe(eslint.failAfterError());
});

gulp.task("default", ["lint"], function () {
	gulp.src("./spec/global-spec.js")
		.pipe(jasmine());
});