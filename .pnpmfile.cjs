function readPackage(pkg, context) {
  // Allow build scripts for esbuild (required for vite)
  if (pkg.name === 'esbuild') {
    return {
      ...pkg,
      pbmBuild: true
    };
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage
  }
};
