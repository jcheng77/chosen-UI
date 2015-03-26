svn update ../auto2o
#rm -f ../auto2o/programs/web.browser/*.css
#rm -f ../auto2o/programs/web.browser/*.js
#svn st ../auto2o | grep '^!' | awk '{print $2}' | xargs svn delete --force

demeteorizer -o ../build
cp -Rf ../build/* ../auto2o/
cd ../auto2o

svn revert programs/server/boot.js

svn st | awk '{if ( $1 == "?") { print $2}}' | xargs svn add

svn commit -m 'update'
bae app publish