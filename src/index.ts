import { Plugin, WorkFlowContext, File } from 'fuse-box';

import svgstore = require('svgstore');

interface SVGStorePluginOptions {
    group?: string;
}

class SVGStorePluginClass implements Plugin {
    public test: RegExp = /\.svg$/;

    private svgstore: svgstore;

    private group: string;

    public constructor(options: SVGStorePluginOptions = {}) {
        if (options.group) this.group = options.group;
    }

    public init(context: WorkFlowContext): void {
        context.allowExtension('.svg');
        if (this.group) this.svgstore = svgstore();
    }

    public transform(file: File): void {
        this.svgstore = svgstore();
        file.loadContents();
        this.svgstore.add(file.info.fuseBoxPath, file.contents);
        Object.assign(file, {
            contents: `
                module.exports = {
                    svg: ${JSON.stringify(this.svgstore.toString({ inline: true }))},
                    path: '#' + ${JSON.stringify(file.info.fuseBoxPath)},
                };
            `,
        });
    }
}

export const SVGStorePlugin = (): SVGStorePluginClass => new SVGStorePluginClass();
