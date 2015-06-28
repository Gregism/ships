module.exports = function(grunt){
  grunt.initConfig({
    watch: {
      options:{
        livereload: true,
      },
      html:{
        files: ['lists/templates/*.html'],
        
      },
      js:{
        files: ['scripts/*.js'],
      },
      css:{
        files: ['lists/static/**/*.css'],
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['watch']);
};