import gulp from 'gulp';
import babel from 'gulp-babel';
import watch from 'gulp-watch';
import cached from 'gulp-cached';
import remember from 'gulp-remember';
import gls from 'gulp-live-server';

import del from 'del';

let jsfile = 'src/**/*.js';

gulp.task('clean', (cbk) => {
    del(['dist'], cbk);
});

gulp.task('js', () => {
    return gulp.src(jsfile).
        pipe(cached('js')).
        pipe(remember('js')).
        pipe(babel()).
        pipe(gulp.dest('dist'))
});

gulp.task('watch', () => {
    let watcher = gulp.watch(jsfile, ['js']);

    watcher.on('change', (evt) => {
        if (evt.type === 'deleted') {
            delete cached.caches.js[evt.path];
            remember.forget('js', evt.path);
        }
    });
});

gulp.task('serve', ['js'], () => {
    let server = gls.new('dist/app.js');
    server.start();

    let watcher = gulp.watch(jsfile, ['js']);

    watcher.on('change', (evt) => {
        if (evt.type === 'deleted') {
            delete cached.caches.js[evt.path];
            remember.forget('js', evt.path);
        }
        
        // restart
        server.start.bind(server)();
    });

});
