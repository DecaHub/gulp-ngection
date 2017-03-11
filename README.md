## ngsource

This is the wrapper for the [ngfinder](https://www.npmjs.com/package/ngfinder) npm package.

## Why

### Problem

My Angular files were not being injected in the correct order to avoid errors. 

### Offered solutions by others

There are gulp plugins that sort Angular files in the proper order by reading their content. I used one of them; however it came with a downside. Whenever a Javascript file is changed in my project, through a watcher, a new injection of JS files is triggered. When no Javascript file was being added or deleted, my index.html file (where the JS files were being injected) kept changing and needed to be staged into git. Why? The order of the files within a category, for example components, kept changing after the new injection. This re-ordering within category did not have any negative effect on running the application or generating errors since their dependencies were above them, but it did create the need to commit a petty change to the repository. 

### My offered solution

I believe that commits to a repository need to be fundamental. Having to consistently commit "Change order of JS files" or committing the file in a bundle of other files with no related changes to it is a bad practice and creates improper repo documentation. Therefore, I created this module that sorts Angular files in logical order and will not generate a new version of index.html upon injection of only changed files when used properly in the Gulp workflow.

## Install

```console
$ npm install --save-dev ngsource
```

or 

```console
$ yarn add --dev ngsource
```


## Usage

`ngsource` is meant to feed the stream of a tool like [gulp-inject](https://www.npmjs.com/package/gulp-inject) with source files.

Require the package in your project:

```js
const ngsource = require("ngsource");
```

There are three key stages for using `ngsource`:

### 1. Starting the Gulp workflow: 

Source files need to be defined for the first time to be then injected.

On your `default` or `init` task make the following call:

```js
ngsource.set(["app/dist/**/*.css"]);
```

`ngsource.set()` will call scan `app/dist` for Angular and other `.js` files. 

It takes a required object, referred to ask Finder Task, that indicates the target directory to scan and any paths that should be ignored while scanning. 

```js
let finderTask = {
  target: "app/dist",
  ignore: "app/dist/lib"
}
```

Within the Finder Task object, the `target` property is required and must be an array that indicates a path; the `ignore` property is optional and can be a string that indicates a path or an array of path strings.

```js
let finderTask = {
  target: "app/dist"
}
```

is also a valid object.

It takes as an optional argument an array of paths or `gulp.src`  friendly strings. This array indicates what other sources other than `.js` files, you want to include in the source bundle. This additional sources could be `.css` files for example.

However, since ngFinder returns null if the arguments passed to it are invalid, it is recommended to enclose this function in a try...catch block:

```s
try {
    
    ngsource.set(
      ["app/dist/**/*.css"]
    );
    
  } catch (error) {
    
    log.danger(error.stack);
    return;
    
  }

```

This try...catch block is using the package `bootstrap-logs` to log the messages in a colorful way. If there is an error while setting the source, the error is thrown, caught and the Gulp workflow is interrupted.

### Injecting files

Your `default` or `init` task will call for your injection task. There are two types of injections when using `ngsource`:

* Injection when new files are added or existing files are deleted. _Note: This will include injecting files for the first time running the project since all the files are considered as new by the Task Runner).
* Injection when the content of an existing file is changed. 

Hence, a task is created for each type of injection: `inject` and `inject:add-remove-file`.



### 2. Injecting: first time, new files or deleted files

`inject` would call `ngsource.get()` to set the source for `gulp-inject`:

```js
  let injectSrc = gulp.src(ngsource.get(), {read: false});
  
  return gulp.src('app/index.html')
    .pipe(injector(injectSrc, injectOptions))
    .pipe(gulp.dest('app'));
```

`inject` will be called by a watcher that detects when a Javascript or SASS/CSS file has been modified. `ngsource.get()` doesn't rescan the tree for Javascript files. Since the file structure hasn't changed, the sources remain the same. Returns the existing source array.
 
### 3. Injecting: added or removed files


```js
  let injectSrc = gulp.src(ngsource.refresh(), {read: false});
  
  return gulp.src('app/index.html')
    .pipe(injector(injectSrc, injectOptions))
    .pipe(gulp.dest('app'));
```

`inject:add-remove-file` will be called by a watcher that detects when a Javascript or SASS/CSS file has been added or removed. `ngsource.refresh()` scans the tree for Javascript files and creates and returns a new source array.
