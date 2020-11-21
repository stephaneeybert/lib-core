# LibCore

# Bump the library project version
cd projects/lib-core/;
npm version patch;
cd ../../;

# Build the library
npm run package;

# Sync the workspace version to the library project one
ng-version-sync-parent;

# Publish the library
npm publish ./dist/lib-core/stephaneeybert-lib-core-

# Install the dependencies in the client application
npm install ng-environmenter
npm install file-saver
npm install @stephaneeybert/lib-core@latest

# Serve again the client application
Ctrl+C
ng serve