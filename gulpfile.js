const fs = require("fs");
const path = require("path");
const { src, dest, task, watch, series } = require('gulp');
const Gitdown = require('gitdown');
const rename = require("gulp-rename");
const debug = require("gulp-debug");
const pandoc = require("gulp-pandoc");

task('gitdown', async () => {
  if (!fs.existsSync("dist")) {
    fs.mkdirSync("dist");
  }

  const gitdown = Gitdown.readFile(path.join(__dirname, "src", "index.md"));
  await gitdown.writeFile('dist/_merged.md');
});

task('pandoc', () => {
  return src("dist/_merged.md")
    .pipe(debug({ title: "merged" }))
    .pipe(pandoc({
      from: "gfm",
      to: "gfm",
      args: ['--wrap=none'],
      ext: "md"
    }))
    .pipe(debug({ title: "pandoc output:" }))
    .pipe(rename("output.md"))
    .pipe(dest("dist"));
});

task('build', series("gitdown", "pandoc"));

task('watch', () => {
  watch('./src', series(['build']));
});


task('default', series('build'));
