import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { experiments, container } from "@rspack/core";
import { createHash } from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const thisPluginName = "webpack-subresource-integrity";

class TestPlugin {

    /**
     * Create a new instance.
     *
     * @public
     */
    constructor (options) {
    }

    setup = (compilation, compiler) => {

        //       compilation.hooks.beforeRuntimeRequirements.tap(thisPluginName, () => {
        //     console.log("", this);
        // });
 const { Compilation } = compiler.webpack;
        compilation.hooks.processAssets.tap(
            {
                name: thisPluginName,
                stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
                // additionalAssets: true
            },
            (records, aa) => {
              
              // console.log("SubresourceIntegrityPlugin: processAssets", records, this, aa, compilation);
              compilation.chunks.forEach((chunk) => {
                console.log(chunk.id, chunk.name);
              });
            }
        );
    };

    apply (compiler) {
            compiler.hooks.afterPlugins.tap("webpack-subresource-integrity", (xCompiler) => {
        xCompiler.hooks.thisCompilation.tap(
            {
                name: "webpack-subresource-integrity",
                stage: -10000
            },
            (compilation) => {
                this.setup(compilation, compiler);
            }
        );

        // installStatsFactoryPlugin(xCompiler);
    });
    }

}

/**
 * @type {import('webpack').Configuration | import('@rspack/cli').Configuration}
 */
const config = {
  mode: "production",
  devtool: false,
  entry: {
    main: "./src/index",
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new experiments.SubresourceIntegrityPlugin(),
    new container.ModuleFederationPlugin({
      name: "app",
      filename: "remoteEntry.js",
      exposes: {
        "./render": "./src/render.js",
      },
      shared: {
        react: {
          singleton: true,
          // eager: true,
          requiredVersion: "^19.0.0",
        },
        "react-dom": {
          singleton: true,
          // eager: true,
          requiredVersion: "^19.0.0",
        },
      },
    }),
    new TestPlugin()
  ],
  output: {
    clean: true,
    path: path.resolve(__dirname, "rspack-dist"),
    filename: "[name].js",
    crossOriginLoading: "anonymous",
  },
  optimization: {
    chunkIds: "named",
    moduleIds: "named",
    splitChunks:{
      
    }
  },
  experiments: {
    css: true,
  },
};

export default config;
