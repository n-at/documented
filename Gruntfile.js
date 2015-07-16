module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            build: {
                files: [
                    {
                        src: "res/less/style.less",
                        dest: "res/css/style.css"
                    }, {
                        expand: true,
                        ext: ".css",
                        extDot: "first",
                        cwd: "res/less/themes",
                        src: "*.theme.less",
                        dest: "res/css/themes/"
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.registerTask('default', ['less:build']);
};
