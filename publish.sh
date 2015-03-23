svn update ../auto2o_staging
#rm -f ../auto2o_staging/programs/web.browser/*.css
#rm -f ../auto2o_staging/programs/web.browser/*.js
#svn st ../auto2o_staging | grep '^!' | awk '{print $2}' | xargs svn delete --force

demeteorizer -o ../build
cp -Rf ../build/* ../auto2o_staging/
cd ../auto2o_staging

svn revert programs/server/boot.js

svn st | awk '{if ( $1 == "?") { print $2}}' | xargs svn add

svn commit -m 'update'
bae app publish