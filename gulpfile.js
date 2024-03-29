"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var less = require("gulp-less");
var csso = require("gulp-csso");
var del = require("del");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var webp = require("gulp-webp");
var imagemin = require("gulp-imagemin");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var path = require("path");

gulp.task("css", function() {
  return gulp
    .src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task("server", function() {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", gulp.series("css"));
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("build-server", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
});


gulp.task("start", gulp.series("css", "server"));

function buildHtml() {
  return gulp.src("source/*.html").pipe(gulp.dest("build/"));
}

function clean() {
  return del("build");
}

function copyFonts() {
  return gulp.src("source/fonts/*.woff*").pipe(gulp.dest("build/fonts"));
}

function buildCss(cb) {
  gulp
    .src("source/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(gulp.dest("build/css"));
  cb();
}

function buildJs() {
  return gulp
    .src("source/js/*")
    .pipe(gulp.dest("build/js"));
}

function optimizeImages() {
  return gulp
    .src("source/img/*")
    .pipe(imagemin())
    .pipe(gulp.dest("build/img/"));
}

function makeWebp() {
  return gulp
    .src("build/img/*.{png,jpg}")
    .pipe(webp())
    .pipe(gulp.dest("build/img"));
}

function makeSprite() {
  return gulp
    .src("source/img/*.svg")
    .pipe(
      svgmin(function(file) {
        var prefix = path.basename(file.relative, path.extname(file.relative));
        return {
          plugins: [
            {
              cleanupIDs: {
                prefix: prefix + "-",
                minify: true
              }
            }
          ]
        };
      })
    )
    .pipe(svgstore())
    .pipe(gulp.dest("source/img"));
}

function copySprite() {
  return gulp.src("source/img/img.svg")
  .pipe(gulp.dest("build/img"))
}

gulp.task("make-sprite", makeSprite);

gulp.task("build", function(cb) {
  return gulp.series(
    clean,
    buildHtml,
    buildCss,
    buildJs,
    copyFonts,
    optimizeImages,
    makeSprite,
    copySprite,
    makeWebp
  )(cb);
});
