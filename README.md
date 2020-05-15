# LibCore

# Bump the version
cd projects/lib-core/;
npm version patch;
cd ../../;

# Build the library
npm run package;

# Publish the library
npm publish ./dist/lib-core/stephaneeybert-lib-core-
ng-version-sync-parent

# In the client application
npm install ng-environmenter
npm install @stephaneeybert/lib-core
