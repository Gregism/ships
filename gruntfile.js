module.exports = function(grunt){
  grunt.initConfig({
    watch: {
      options:{
        livereload: true,
      },
      html:{
        files: ['*.html'],
        
      },
      js:{
        files: ['js/*.js'],
      },
      css:{
        files: ['css/**/*.css'],
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['watch']);
};