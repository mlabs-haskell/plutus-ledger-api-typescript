{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
    pre-commit-hooks-nix.url = "github:cachix/pre-commit-hooks.nix";
    pre-commit-hooks-nix.inputs.nixpkgs.follows = "nixpkgs";
    hci-effects.url = "github:hercules-ci/hercules-ci-effects";
    flake-lang.url = "github:mlabs-haskell/flake-lang.nix";
    prelude-typescript.url = "github:mlabs-haskell/prelude-typescript";
  };

  outputs = inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; }
      {
        systems = [ "x86_64-linux" "x86_64-darwin" ];
        imports = [
          ./hercules-ci.nix
          ./pre-commit.nix
        ];
        perSystem = { config, inputs', system, ... }:
          let
            tsFlake = inputs.flake-lang.lib.${system}.typescriptFlake
              {
                name = "plutus-ledger-api";
                src = ./.;
                npmExtraDependencies = [ inputs'.prelude-typescript.packages.tgz ];
                devShellHook =
                  ''
                    ${config.devShells.dev-pre-commit.shellHook}
                  '';
              };
          in
          {
            packages = {
              # Tarball of the package
              tgz = tsFlake.packages.plutus-ledger-api-typescript-tgz;

              # Tarball of the package
              node2nix = tsFlake.packages.plutus-ledger-api-typescript-node2nix;

              # Documentation
              docs = tsFlake.packages.plutus-ledger-api-typescript.overrideAttrs (_self: (_super: {
                npmBuildScript = "docs";
                installPhase =
                  ''
                    mv ./docs $out
                  '';
              }));
            };

            # Provides a development environment
            devShells.default = tsFlake.devShells.plutus-ledger-api-typescript;

            # Runs `npm test`
            checks.default = tsFlake.checks.plutus-ledger-api-typescript-test;
          };
      };
}
