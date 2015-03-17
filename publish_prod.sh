svn update ../auto2o

demeteorizer -o ../build
cp -Rf ../build/* ../auto2o/
cd ../auto2o

svn revert programs/server/boot.js

svn st | awk '{if ( $1 == "?") { print $2}}' | xargs svn add

svn commit -m 'update'
bae app publish