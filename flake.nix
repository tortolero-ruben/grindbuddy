{
  description = "Grind Buddy - SvelteKit application";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_22
            railway
          ];

          shellHook = ''
            echo "🚀 Grind Buddy Development Environment"
            echo "Node.js version: $(node --version)"
            echo "npm version: $(npm --version)"
            echo ""
            echo "Available commands:"
            echo "  npm run dev       - Start development server"
            echo "  npm run build     - Build for production"
            echo "  npm run start     - Start production server"
            echo "  npm run test      - Run tests"
            echo "  railpack build .  - Test Railway build locally"
            echo ""
          '';
        };
      }
    );
}
